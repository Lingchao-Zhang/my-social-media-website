import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchTaggedUsers, fetchUser, fetchUserComments } from "@/lib/actions/user.actions"
import { paramsType } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import Image from "next/image"
import { fetchUserThreads } from "@/lib/actions/user.actions"
import ProfileTab from "@/components/shared/ProfileTab"

const ProfilePage = async ({ params: { id }}: paramsType) => {
    const user = await currentUser()
    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(id)
        // if login user view himself profile and he isn't onboarded, then redirect to "/onboarding"
        if(id === user.id && !userInfo?.onboarded){
            redirect("/onboarding")
        } 
        // if login user view another user and that user is not onboarded, then back to the home page
        else if(id !== user.id && !userInfo?.onboarded){
            redirect("/")
        } else{
            const result = await fetchUserThreads(id)
            const threads= result.threads
            const comments = await fetchUserComments(userInfo._id)
            const taggedAuthors = await fetchTaggedUsers(userInfo._id)
            return(
               <div>
                 <ProfileHeader 
                    image={userInfo.image}
                    username={userInfo.username}
                    name={userInfo.name}
                    biography={userInfo.biography} 
                    accountId={userInfo.id} 
                    authUserId={user.id}                 
                />
z
                <div className="mt-9">
                    <Tabs defaultValue="threads" className="w-full">
                        <TabsList className="tab">
                            {
                                profileTabs.map((profileTab) => (
                                    <TabsTrigger
                                        className="tab" 
                                        key={profileTab.value} 
                                        value={profileTab.value}
                                    >   
                                        <Image 
                                            src={profileTab.icon}
                                            alt={profileTab.label}
                                            width={24}
                                            height={24}
                                            className="object-contain"
                                        />
                                        <p className="max-sm:hidden">{profileTab.label}</p>
                                        {
                                            profileTab.label === "Threads" ?
                                            (<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                                {threads.length}
                                            </p> )
                                            :
                                            profileTab.label === "Replies" ?
                                            (<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                                {comments.length}
                                            </p>)
                                            :
                                            <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                                {taggedAuthors.length}
                                            </p>
                                        }
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                        {
                            profileTabs.map((profileTab) => (
                                <TabsContent
                                    className="w-full text-light-1" 
                                    key={`content-${profileTab.value}`} 
                                    value={profileTab.value}
                                >
                                    <ProfileTab 
                                        tabLabel={profileTab.label} 
                                        currentUserId={user.id} 
                                        profileUser={{
                                            objectId: userInfo._id,
                                            id: userInfo.id,
                                            username: userInfo.username,
                                            image: userInfo.image
                                        }} 
                                    />
                                </TabsContent>
                            ))
                        }
                    </Tabs>
                </div>
               </div>
            )
        }
    }
}
export default ProfilePage