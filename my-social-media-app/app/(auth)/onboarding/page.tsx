import AccountProfile from "@/components/forms/AccountProfile"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const OnBoarding = async () => {
    const user = await currentUser()

    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(user.id) 
        
        if(userInfo.onboarded){
            redirect('/')
        } else{
            const userData = {
                id: user?.id,
                objectId: userInfo?._id,
                username: userInfo?.username || user?.username,
                name: userInfo?.name || user?.firstName,
                biography: userInfo?.biography || "",
                imageUrl: userInfo?.image || user?.imageUrl
            }
            return(
                <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
                    <h1 className="head-text">Onboarding</h1>
                    <p className="text-light-2 mt-3 text-base-regular">Please fill the following fields to complete your profile setup.</p>
                    <section className="mt-9 bg-dark-2 p-10">
                        <AccountProfile 
                        user={userData}
                        buttonTitle="continue"            
                        />
                    </section>
                </main>
            )
        }
    }
}

export default OnBoarding