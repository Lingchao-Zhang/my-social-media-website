import { fetSuggestedUsers, fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import UserCard from "../cards/UserCard"
import { fetchSuggestedCommunities } from "@/lib/actions/community.actions"
import CommunityCard from "../cards/CommunityCard"

const RightSideBar = async () => {
    const user = await currentUser()
    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(user.id)
        if(!userInfo?.onboarded){
            redirect("/onboarding")
        } else{
            const suggestedUsers = await fetSuggestedUsers(userInfo._id)
            const suggestedCommunities = await fetchSuggestedCommunities(userInfo._id)
            return(
                <section className="rightsidebar custom-scrollbar">
                    <div className="flex flex-1 flex-col justify-start space-y-4">
                        <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>
                        <div className="flex flex-col">
                            <h4 className="text-light-2">Communities you may know</h4>
                        </div>
                        {
                            suggestedCommunities.map((suggestedCommunity) => (
                                <CommunityCard 
                                    key={suggestedCommunity.id} 
                                    id={suggestedCommunity.id} 
                                    name={suggestedCommunity.name} 
                                    communityname={suggestedCommunity.communityname} 
                                    image={suggestedCommunity.image} 
                                    biography={suggestedCommunity.biography} 
                                    members={suggestedCommunity.members}                                                            
                                />
                            ))
                        }
                    </div>
                    <div className="flex flex-1 flex-col justify-start space-y-4">
                        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
                        <div className="flex flex-col space-y-3">
                            <h4 className="text-light-2">People you may know</h4>
                            {
                                suggestedUsers.map((suggestedUser) => (
                                    <UserCard 
                                        key={suggestedUser.id}
                                        userId={suggestedUser.id} 
                                        username={suggestedUser.username} 
                                        name={suggestedUser.name} 
                                        image={suggestedUser.image}                 
                                    />
                                ))
                            }
                        </div>
                    </div>
                </section>
                
            )
        }
}
}

export default RightSideBar