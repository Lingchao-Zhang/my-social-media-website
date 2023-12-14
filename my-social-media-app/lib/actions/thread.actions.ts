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
        throw new Error(`Failed to create or update user: ${error.message}`)
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
                                    select: "_id name parentId image"
                                }
                            })
        
        const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})
        const displayedThreads = await threadsQuery.exec()
        const isNext = totalThreadsCount > skipThreadsAmount + displayedThreads.length

        return { displayedThreads, isNext }
    } catch(error: any){
        throw new Error(`Failed to create or update user: ${error.message}`)
    }
}

export { createThread, fetchThreads}