"use server"

import { onboardingUser } from "@/types"
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
        const comments = Thread.find({ parentId: {$ne: null}, author: {$in: userId}})
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
export { updateUser, fetchUser, fetchUserThreads, fetchUserComments }