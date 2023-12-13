import AccountProfile from "@/components/forms/AccountProfile"
import { currentUser } from "@clerk/nextjs"

const OnBoarding = async () => {
    const user = await currentUser()
    const userInfo = {}
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

export default OnBoarding