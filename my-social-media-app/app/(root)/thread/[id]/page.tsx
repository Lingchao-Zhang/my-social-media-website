import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreadById } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { paramsType } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const SingleThread = async ({params: {id}}: paramsType) => {
    const user = await currentUser()
    if(!user){
        return null
      } else{
        const userInfo = await fetchUser(user.id)
        if(!userInfo.onboarded){
          redirect("/onboarding")
        } else {
          const thread = await fetchThreadById(id)
          return (
              <section className="relative">
                  <ThreadCard 
                    key={thread._id}
                    threadId={thread._id} 
                    currentUserId={user.id} 
                    content={thread.text} 
                    createdAt={thread.createdAt}
                    parentId={thread.parentId} 
                    author={thread.author} 
                    community={thread.community} 
                    comments={thread.children}           
                  />             
              </section>
          )
        }
      }
}

export default SingleThread