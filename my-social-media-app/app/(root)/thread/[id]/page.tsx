import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreadById } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { paramsType } from "@/types"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Comment from "@/components/forms/Comment"
const SingleThread = async ({params: {id}}: paramsType) => {
    const user = await currentUser()
    if(!user){
        return null
      } else{
        const userInfo = await fetchUser(user.id)
        if(!userInfo?.onboarded){
          redirect("/onboarding")
        } else {
          const thread = await fetchThreadById(id)
          return (
              <section className="relative">
                <div>
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
                </div>
                <div className="mt-7">
                  <Comment 
                    threadId={thread._id} 
                    currentUserId={userInfo._id} 
                    currentUserImage={userInfo.image} 
                  />           
                </div>
                <div className="mt-10">
                  {
                    thread.children.map((child: any) => (
                      <ThreadCard 
                        key={child._id}
                        threadId={child._id} 
                        currentUserId={user.id} 
                        content={child.text} 
                        createdAt={child.createdAt}
                        parentId={child.parentId} 
                        author={child.author} 
                        community={child.community} 
                        comments={child.children} 
                        isComment={true}          
                      />            
                    ))
                  }
                </div>
              </section>
          )
        }
      }
}

export default SingleThread