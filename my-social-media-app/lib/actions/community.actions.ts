"use server"
import { fetchCommunitiesType } from "@/types"
import Community from "../models/community.model"
import User from "../models/user.model"
import { connectToMongoDB } from "../mongoose"
import Thread from "../models/thread.model"
import { ObjectId } from "mongoose"
import { fetchTaggedUsers } from "./user.actions"

const createCommunity = async (id: string, name: string, communityname: string, image: string, biography: string, creatorId: string) => {
    try{
        connectToMongoDB()
        // 1. find the user who create the community
        const creator = await User.findOne({ id: creatorId })

        // 2. create a new community 
        const community = await Community.create({
            id,
            communityname,
            name,
            image,
            biography,
            createdBy: creator._id
        })

        // 3. add the new founded community to creator
        creator.communities.push(community._id)

        // 4. save the result
        await creator.save()

        return community

    } catch(error: any){
        throw new Error(`Failed to create community: ${error.message}`)
    }
}

const fetchCommunities = async ({ searchParam, currentPageNumber, pageSize }: fetchCommunitiesType) => {
    try{
        connectToMongoDB()

        const skipCommunitiesAmount = (currentPageNumber - 1) * pageSize
        const regex = new RegExp(searchParam, "i")
        const communitiesQuery = searchParam.trim() === "" ? Community.find()
                                                    .skip(skipCommunitiesAmount)
                                                    .limit(pageSize)
                                                    .sort({createdAt: 'desc'})
                                                    .populate([
                                                        {
                                                            path: "members",
                                                            model: User,
                                                            select: "id image"
                                                        }
                                                    ])
                                                     :
                                                    Community.find({$or: [{communityname: {$regex: regex}}, {name: {$regex: regex}}]})
                                                    .skip(skipCommunitiesAmount)
                                                    .limit(pageSize)
                                                    .sort({createdAt: 'desc'})
                                                    .populate([
                                                        {
                                                            path: "members",
                                                            model: User,
                                                            select: "id image"
                                                        }
                                                    ])

        const totalCommuntiesCount = searchParam.trim() === "" ? await Community.countDocuments() : 
        await Community.countDocuments({$or: [{communityname: {$regex: regex}}, {name: {$regex: regex}}]})

        const displayedCommunities = await communitiesQuery.exec()
        const isNext = totalCommuntiesCount > skipCommunitiesAmount + displayedCommunities.length

        return { displayedCommunities, isNext}

    } catch(error: any){
        throw new Error(`Failed to fetch communities: ${error.message}`)
    }
}

const fetchCommunityById = async (communityId: string) => {
    try{
        connectToMongoDB()
        const community = await Community.findOne({ id: communityId })
                                         .populate(
                                            [
                                                {
                                                    path: "createdBy",
                                                    model: User,
                                                    select: "id username name image"
                                                },
                                                {
                                                    path: "members",
                                                    model: User,
                                                    select: "id username name image"
                                                }

                                            ]
                                         )

        return community
    } catch(error: any){
        throw new Error(`Failed to fetch community: ${error.message}`)
    }

}

const fetchCommunityThreads = async (communityId: string) => {
    try{
        connectToMongoDB()
        
        // find the community through its id and retrieve all its threads
        const result = Community.findOne({ id: communityId })
                                 .populate({
                                    path: "threads",
                                    model: Thread,
                                    populate:[
                                        {
                                            path: "author",
                                            model: User,
                                            select: "id username name image"
                                        },
                                        {
                                            path: "community",
                                            model: Community,
                                            select: "_id id communityname name image"
                                        },
                                        {
                                            path: "children",
                                            model: Thread,
                                            populate: {
                                                path: "author",
                                                model: User,
                                                select: "id username name image"
                                            }
                                        }
                                    ]
                                 })
        return result
    } catch(error: any){
        throw new Error(`Failed to fetch threads from the community: ${error.message}`)
    } 
}

const addMemberToCommunity = async (communityId: string, userId: string) => {
    try{
        connectToMongoDB()

        // 1. find the targeted community
        const targetedCommunity = await Community.findOne({ id: communityId })

        // 2. find the targeted user
        const targetedUser = await User.findOne({ id: userId })

        // 3. if the user is not in the community then add the user to the community
        if(!targetedCommunity.members.includes(targetedUser._id)){
            targetedCommunity.members.push(targetedUser._id)

            // 4. save the updated community
            await targetedCommunity.save()

            // 5. add the community to the user
            targetedUser.communities.push(targetedCommunity._id)

            // 6. save the updated user
            await targetedUser.save()
        }
        
        return targetedCommunity
    } catch(error: any){
        throw new Error(`Failed to add member to community: ${error.message}`)
    } 
}

const removeUserFromCommunity = async (userId: string, communityId: string) => {
    try{
        connectToMongoDB()

        // 1. find the targeted community
        const targetedCommunity = await Community.findOne({ id: communityId })

        // 2. find the targeted user
        const targetedUser = await User.findOne({ id: userId })

        // if user is in the community, then remove this user from the community
        if(targetedCommunity.members.includes(targetedUser._id)){
            // 3. remove user from the community
            targetedCommunity.members.pull(targetedUser._id)
            await targetedCommunity.save()

            // 4. remove the community from the user
            targetedUser.communities.pull(targetedCommunity._id)
            await targetedUser.save()
        }
        
        return { success: true }
    } catch(error: any){
        throw new Error(`Failed to remove user from community: ${error.message}`)
    } 
}

const updateCommunityInfo = async (communityId: string, name: string, communityname: string, image: string) => {
    try{
        connectToMongoDB()
        // 1. find the targeted community and update
        const updatedCommunity = await Community.findOneAndUpdate(
            { id: communityId },
            {
                communityname,
                name,
                image
            }
            )

        return updatedCommunity
    } catch(error: any){
        throw new Error(`Failed to update the community: ${error.message}`)
    } 
}

const deleteCommunity = async (communityId: string) => {
    try{
        connectToMongoDB()

        // 1. find the targeted community
        const targetedCommunity = await Community.findOne({ id: communityId })

        // 2. find all members of the community and delete the community from their communities
        targetedCommunity.members.map(async (member: ObjectId) => {
            await User.findOneAndUpdate(
                { _id: member },
                { $pull: { communities: targetedCommunity._id }}
            )
        })

        // 3. delete the community from creators' communities
        await User.findOneAndUpdate(
            { _id: targetedCommunity.createdBy },
            { $pull: { communities: targetedCommunity._id }}
        ) 

        // 4. delete the threads connected to the community
        await Thread.deleteMany({ community: targetedCommunity._id })

        // 5. delete the community
        await Community.findOneAndDelete({ id: communityId })

        return{ success: true }
    } catch(error: any){
        throw new Error(`Failed to delete the community: ${error.message}`)
    } 
}

const fetchSuggestedCommunities = async (userId: ObjectId) => {
    try{
        connectToMongoDB()
        // community of tagged user
        const currentUser = await User.findOne({ _id: userId })
        const taggedUsers = await fetchTaggedUsers(userId)
        let suggestedCommunites: any[] = []
        for(let i = 0; i < taggedUsers.length; i++){
            const taggedUser = await User.findOne({ id: taggedUsers[i].id })
            if(taggedUser.communities.length !== 0){
                for(let j = 0; j < taggedUser.communities.length; j++){
                    const communityObjectId = taggedUser.communities[j]
                    if(!currentUser.communities.includes(communityObjectId)){
                        const community = await Community.findOne({ _id: communityObjectId })
                        const communityDetails = await fetchCommunityById(community.id)
                        suggestedCommunites.push(communityDetails)
                    }
                }
            }
        }

        return suggestedCommunites
    } catch(error: any){
        throw new Error(`Failed to fetch suggested communites: ${error.message}`)
    } 
}
export { createCommunity, fetchCommunities, fetchCommunityById, 
    fetchCommunityThreads, addMemberToCommunity, removeUserFromCommunity, 
    updateCommunityInfo, deleteCommunity, fetchSuggestedCommunities }