import ThreadCreation from "@/components/forms/ThreadCreation"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const CreateThread = async () => {
    const user = await currentUser()
    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(user.id)
        if(!userInfo.onboarded){
            redirect("/onboarding")
        } else{
            return(
                <>
                    <h1 className="head-text">Create Thread</h1>
                    
                    <ThreadCreation userId={userInfo._id} />
                </>
            )
        }
    }
}

export default CreateThread