import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/user.actions"
import { paramsType } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { communityTabs } from "@/constants"
import Image from "next/image"
import { fetchCommunityById } from "@/lib/actions/community.actions"
import CommunityTab from "@/components/shared/CommunityTab"

const CommunityPage = async ({ params: { id }}: paramsType) => {
    const user = await currentUser()
    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(user.id)
        if(!userInfo?.onboarded){
            redirect("/onboarding")
         } else{
            const communityInfo = await fetchCommunityById(id)
            return(
               <div>
                 <ProfileHeader 
                    image={communityInfo.image}
                    username={communityInfo.communityname}
                    name={communityInfo.name}
                    biography={communityInfo.biography} 
                    accountId={communityInfo.createdBy.id} 
                    authUserId={user.id}                 
                />
z
                <div className="mt-9">
                    <Tabs defaultValue="threads" className="w-full">
                        <TabsList className="tab">
                            {
                                communityTabs.map((communityTab) => (
                                    <TabsTrigger
                                        className="tab" 
                                        key={communityTab.value} 
                                        value={communityTab.value}
                                    >   
                                        <Image 
                                            src={communityTab.icon}
                                            alt={communityTab.label}
                                            width={24}
                                            height={24}
                                            className="object-contain"
                                        />
                                        <p className="max-sm:hidden">{communityTab.label}</p>
                                        {
                                            communityTab.label === "Threads" ?
                                            (<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                                1
                                            </p> )
                                            :
                                            communityTab.label === "Members" ?
                                            (<p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                                2
                                            </p>)
                                            :
                                            null
                                        }
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                        {
                            communityTabs.map((communityTab) => (
                                <TabsContent
                                    className="w-full text-light-1" 
                                    key={`content-${communityTab.value}`} 
                                    value={communityTab.value}
                                >
                                    <CommunityTab 
                                      tabLabel={communityTab.label}
                                      currentUserId={user.id}
                                      communityInfo={
                                        { 
                                            communityId: communityInfo.id,
                                            members: communityInfo.members
                                        }
                                      }
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
export default CommunityPage