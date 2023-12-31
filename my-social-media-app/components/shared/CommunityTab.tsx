import { CommunityTabType } from "@/types"
import ThreadCard from "../cards/ThreadCard"
import UserCard from "../cards/UserCard"
import { fetchCommunityThreads } from "@/lib/actions/community.actions"

const CommunityTab = async ({ tabLabel, currentUserId, communityInfo }: CommunityTabType) => {
    if(tabLabel === "Threads"){
        const result = await fetchCommunityThreads(communityInfo.communityId)
        const threads= result.threads
        return(
            <section className="mt-9 flex flex-col gap-10">
                {
                    threads.map((thread: any) => (
                        <ThreadCard 
                            key={thread._id}
                            threadId={thread._id} 
                            currentUserId={currentUserId} 
                            content={thread.text} 
                            createdAt={thread.createdAt}
                            parentId={thread.parentId} 
                            author={thread.author} 
                            community={thread.community} 
                            comments={thread.children}          
                        />   
                    ))
                }
            </section>
        )
    } else if(tabLabel === "Members"){
        return(
            <section className="mt-9 flex flex-col gap-10">
                {
                  communityInfo.members.map((member) => (
                    <UserCard 
                        userId={member.id} 
                        username={member.username} 
                        name={member.name} 
                        image={member.image} 
                    />
                  ))
                }
            </section>
        )
    } else if(tabLabel === "Requests"){
        return(
            <section className="mt-9 flex flex-col gap-10">
            </section>
        )
    }
}

export default CommunityTab