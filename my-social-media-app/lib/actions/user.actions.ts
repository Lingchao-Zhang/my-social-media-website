"use server" 

import { fetchUserParamsType, onboardingUser } from "@/types"
import User from "../models/user.model"
import { connectToMongoDB } from "../mongoose"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import { ObjectId } from "mongoose"
import { fetchThreadById } from "./thread.actions"
import Community from "../models/community.model"

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
                                },
                                {
                                    path: "community",
                                    model: Community,
                                    select: "_id id communityname name image"
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
                                                    : 
                                                User.find({ id: {$ne: currentUserId}, $or: [{username: {$regex: regex}}, {name: {$regex: regex}}]}) 
                                                .skip(skipUsersAmount)
                                                .limit(pageSize)
                                                
        const totalUsersCount = searchParam.trim() === "" ? await User.countDocuments({ id: {$ne: currentUserId}}) : 
                                                            await User.countDocuments({ id: {$ne: currentUserId}, $or: [{username: {$regex: regex}}, {name: {$regex: regex}}]})
        const displayedUsers = await usersQuery.exec()
        const isNext = totalUsersCount > skipUsersAmount + displayedUsers.length

        return { displayedUsers, isNext }
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
                                        select: "id username name image"
                                     })
        
        return comments
    } catch(error: any){
        throw new Error(`Failed to fetch activities: ${error.message}`)
    }
}

const fetchTaggedUsers = async (userId: ObjectId) => {
    try{
        connectToMongoDB()
        const otherComments = await fetchActivities(userId)
        const userComments = await fetchUserComments(userId)

        let authors: any[] = []
        let authorsId: any[] = []
        for(let i=0; i < otherComments.length; i++){
            if(!authors.includes(otherComments[i].author)){
                authors.push(otherComments[i].author)
                authorsId.push(otherComments[i].author.id)
            }
        }

        for(let i=0; i < userComments.length; i++){
            const thread = await fetchThreadById(userComments[i].parentId)
            if(!authorsId.includes(thread.author.id)){
                authors.push(thread.author)
            }
        }

        return authors
    } catch(error: any){
        throw new Error(`Failed to fetch tagged users: ${error.message}`)
    }
}

const fetSuggestedUsers = async (userId: ObjectId) => {
    try{
        connectToMongoDB()
        // 1. users from the same community
        // 2. tagged users(exclude your tagged user and yourself) of your tagged users
        const taggedUsers = await fetchTaggedUsers(userId)
        const taggedUsersId = taggedUsers.reduce((acc, taggedUser) => {
            return acc.concat(taggedUser.id)
        },[]) 
        const currentUser = await User.findOne({ _id: userId })
        let suggestedUsers: any[] = []
        
        if(currentUser.communities.length !== 0){
            for(let i = 0; i < currentUser.communities.length; i++){
                const communityObjectId = currentUser.communities[i]
                const community = await Community.findOne({ _id: communityObjectId })
                const creator = await User.findOne({ _id: community.createdBy })
                if(creator.id !== currentUser.id){
                    suggestedUsers.push(creator)
                }
                for(let j = 0; j < community.members.length; j++){
                    const memberObjectId = community.members[j]
                    const member = await User.findOne({ _id: memberObjectId })
                    if(member.id !== currentUser.id && !taggedUsersId.includes(member.id)){
                        suggestedUsers.push(member)
                    }
                }
            }
        }

        for(let i = 0; i < taggedUsers.length; i++){
            const taggedUsersOfTaggedUser = await fetchTaggedUsers(taggedUsers[i]._id)
            
            for(let j = 0; j < taggedUsersOfTaggedUser.length; j++){
                const taggedUsersOfTaggedUserId = taggedUsersOfTaggedUser[j].id
                // exclude user herself and her tagged users
                if(taggedUsersOfTaggedUserId !== currentUser.id && !taggedUsersId.includes(taggedUsersOfTaggedUserId)){
                    suggestedUsers.push(taggedUsersOfTaggedUser[j])
                }
            }
        }

        return suggestedUsers
    } catch(error: any){
        throw new Error(`Failed to fetch suggested users: ${error.message}`)
    }
}

export { updateUser, fetchUser, fetchUserThreads, fetchUserComments, fetchUsers, fetchActivities, fetchTaggedUsers, fetSuggestedUsers }