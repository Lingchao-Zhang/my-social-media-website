"use server"

import { threadType } from "@/types"
import { connectToMongoDB } from "../mongoose"
import Thread from "../models/thread.model"
import { revalidatePath } from "next/cache"
import User from "../models/user.model"

const createThread = async ({ text, author, communityId, path}: threadType) => {
    try{
        connectToMongoDB()

        const createdThread = await Thread.create(
            {
                text,
                author,
                community: communityId
            }
        )

        // update user to add new created thread
        await User.findByIdAndUpdate(author, {
            $push: { threads: createdThread._id }
        })
        revalidatePath(path)
    } catch(error: any){
        throw new Error(`Failed to create thread: ${error.message}`)
    }
}

const fetchThreads = async (currentPageNumber: number, pageSize: number) => {
    try{
        connectToMongoDB()

        // don't need to fetch threads in the previous pages
        const skipThreadsAmount = (currentPageNumber - 1) * pageSize
        const threadsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
                             .sort({ createdAt: "desc"})
                             .skip(skipThreadsAmount)
                             .limit(pageSize)
                             .populate({ path: "author", model: User})
                             .populate({ 
                                path: "children",
                                populate: {
                                    path: "author",
                                    model: User,
                                    select: "_id username parentId image"
                                }
                            })
        
        const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})
        const displayedThreads = await threadsQuery.exec()
        const isNext = totalThreadsCount > skipThreadsAmount + displayedThreads.length

        return { displayedThreads, isNext }
    } catch(error: any){
        throw new Error(`Failed to fetch threads: ${error.message}`)
    }
}

const fetchThreadById = async (threadId: string) => {
    try{
        connectToMongoDB()

        // TODO: populate community
        const thread = await Thread.findById(threadId)
                             .populate(
                                {
                                    path: "author",
                                    model: User,
                                    select: "_id id username image"
                                }
                             )
                             .populate(
                                {
                                    path: "children",
                                    populate: [
                                        {
                                            path: "author",
                                            model: User,
                                            select: "_id id username parentId image" 
                                        },
                                        {
                                            path: "children",
                                            model: Thread,
                                            populate: {
                                                path: "author",
                                                model: User,
                                                select: "_id id username parentId image" 
                                            }
                                        }
                                    ]
                                }
                             ).exec()
        return thread
    } catch(error: any){
        throw new Error(`Failed to fetch thread: ${error.message}`)
    }
}

const addCommentToThread = async (threadId: string, commentText: string, authorId: string, path: string) => {
    try{
        connectToMongoDB()

        // 1. find the original thread that needs to be added comment.
        const originalThread = await Thread.findById(threadId)

        // 2. create a new thread for the comment
        const commentThread = await Thread.create({
            text: commentText,
            author: authorId,
            parentId: threadId
        })

        // 3. add the comment to the original thread
        originalThread.children.push(commentThread)

        // 4. save the updated original thread
        await originalThread.save()
        
        revalidatePath(path)
    } catch(error: any){
        throw new Error(`Failed to add comment to the thread: ${error.message}`)
    }
}
export { createThread, fetchThreads, fetchThreadById, addCommentToThread }