import { fetchUserComments, fetchUserThreads } from "@/lib/actions/user.actions"
import { ThreadTabType } from "@/types"
import ThreadCard from "../cards/ThreadCard"
import { fetchThreadById } from "@/lib/actions/thread.actions"

const ThreadTab = async ({ tabLabel, currentUserId, profileUser}: ThreadTabType) => {
    if(tabLabel === "Threads"){
        const result = await fetchUserThreads(profileUser.id)
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
                            author={profileUser} 
                            community={thread.community} 
                            comments={thread.children}          
                        />   
                    ))
                }
            </section>
        )
    } else if(tabLabel === "Replies"){
        const comments = await fetchUserComments(profileUser.objectId)
        return(
            <section className="mt-9 flex flex-col gap-10">
                {
                    comments.map(async (comment: any) => {
                        const originalThread = await fetchThreadById(comment.parentId)
                        return(
                            <>
                                <ThreadCard 
                                    key={originalThread._id}
                                    threadId={originalThread._id} 
                                    currentUserId={currentUserId} 
                                    content={originalThread.text} 
                                    createdAt={originalThread.createdAt}
                                    parentId={originalThread.parentId} 
                                    author={originalThread.author} 
                                    community={originalThread.community} 
                                    comments={originalThread.children}         
                                />  
                                <ThreadCard 
                                    key={comment._id}
                                    threadId={comment._id} 
                                    currentUserId={currentUserId} 
                                    content={comment.text} 
                                    createdAt={comment.createdAt}
                                    parentId={comment.parentId} 
                                    author={profileUser} 
                                    community={comment.community} 
                                    comments={comment.children}
                                    isComment={true}          
                                />   
                            </>
                        )
                    })
                }
            </section>
        )
    } else if(tabLabel === "Tagged"){
        return(
            <section className="mt-9 flex flex-col gap-10">
            </section>
        )
    }
}

export default ThreadTab