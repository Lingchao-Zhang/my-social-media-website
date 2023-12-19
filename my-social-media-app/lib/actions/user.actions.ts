"use server"

import { fetchUserParamsType, onboardingUser } from "@/types"
import User from "../models/user.model"
import { connectToMongoDB } from "../mongoose"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import { ObjectId } from "mongoose"

const updateUser = async ({ 
    userId, username, name, image, biography,path 
}: onboardingUser): Promise<void> => {

    try{
        connectToMongoDB()

        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                image,
                biography,
                onboarded: true
            },
            { upsert: true}
            )

            if(path === "/profile/edit"){
                revalidatePath(path)
            }
    } catch(error: any){
        throw new Error(`Failed to create or update user: ${error.message}`)
    }
}

const fetchUser = async (userId: string) => {
    try{
        connectToMongoDB()
        return await User.findOne({ id: userId })
        
    } catch(error: any){
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

const fetchUserThreads = async (userId: string) => {
    try{
        connectToMongoDB()
        const result = await User.findOne({ id: userId })
                            .populate({
                                path: "threads",
                                model: Thread,
                                populate: [{
                                    path: "children",
                                    model: Thread,
                                    populate: {
                                        path: "author",
                                        model: User,
                                        select: "id username image"
                                    }
                                }]
                            })
        return result
    } catch(error: any){
        throw new Error(`Failed to fetch all threads of the user: ${error.message}`)
    }
}

const fetchUserComments = async (userId: ObjectId) => {
    try{
        connectToMongoDB()
        const comments = Thread.find({ parentId: {$ne: null}, author: userId})
                                .sort({ createdAt: "desc"})
                                .populate({ path: "author", model: User})
                                .populate({ 
                                path: "children",
                                populate: {
                                    path: "author",
                                    model: User,
                                    select: "_id username parentId image"
                                }
                            })
        return comments
    } catch(error: any){
        throw new Error(`Failed to fetch all comments of the user: ${error.message}`)
    }
}

const fetchUsers = async ({ currentUserId, searchParam, currentPageNumber, pageSize }: fetchUserParamsType) => {
    try{
        connectToMongoDB()
        const skipUsersAmount = (currentPageNumber - 1) * pageSize
        const regex = new RegExp(searchParam, "i")
        // find users except current user or user searched by current user
        const usersQuery = searchParam.trim() === "" ? User.find({ id: {$ne: currentUserId}}) 
                                                      .skip(skipUsersAmount)
                                                      .limit(pageSize)
                                                      .sort({ createdAt: 'desc' })
                                                    : 
                                                User.find({ id: {$ne: currentUserId}, $or: [{username: {$regex: regex}}, {name: {$regex: regex}}]}) 
                                                .skip(skipUsersAmount)
                                                .limit(pageSize)
                                                .sort({ createdAt: 'desc' })

        const totalUsersCount = searchParam.trim() === "" ? await Thread.countDocuments({ id: {$ne: currentUserId}}) : 
                                                            await Thread.countDocuments({ id: {$ne: currentUserId}, $or: [{username: {$regex: regex}}, {name: {$regex: regex}}]})
        const displayedUsers = await usersQuery.exec()
        const isNext = totalUsersCount > skipUsersAmount + displayedUsers.length

        return { displayedUsers, isNext}
    } catch(error: any){
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
}

const fetchActivities = async (userId: ObjectId) => {
    try{
        connectToMongoDB()

        // 1. get all threads created by current user
        const threads = await Thread.find({ author: userId })

        // 2. get ids of all comments of all threads and merge them in one array
        const threadsCommentsIds = threads.reduce((acc, currentThread) => {
            return acc.concat(currentThread.children)
        }, [])

        // 3. get all comments through ids.
        const comments = await Thread.find({ _id: {$in: threadsCommentsIds}, author: {$ne: userId} })
                                     .populate({
                                        path: "author",
                                        model: User,
                                        select: "id username image"
                                     })
        
        return comments
    } catch(error: any){
        throw new Error(`Failed to fetch activities: ${error.message}`)
    }
}

export { updateUser, fetchUser, fetchUserThreads, fetchUserComments, fetchUsers, fetchActivities }