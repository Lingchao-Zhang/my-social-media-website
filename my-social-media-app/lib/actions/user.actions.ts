"use server"

import { onboardingUser } from "@/types"
import User from "../models/user.model"
import { connectToMongoDB } from "../mongoose"
import { revalidatePath } from "next/cache"

const updateUser = async ({ 
    userId, 
    username, 
    name, 
    image, 
    biography,
    path 
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

export { updateUser }