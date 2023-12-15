import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreads } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Home() {
  const result = await fetchThreads(1, 20)
  const user = await currentUser()
  const threads = result.displayedThreads 
  if(!user){
    return null
  } else{
    const userInfo = await fetchUser(user.id)
    if(!userInfo.onboarded){
      redirect("/onboarding")
    } else {
      return (
        <section className="mt-9 flex flex-col gap-10">
          {
            threads.length === 0 ? 
            (
              <p className="no-result">No threads founded</p>
            ) : 
            (
              <>
              {
                threads.map((thread) => (
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
                ))
              }
              </>
            )
          }
        </section>
      )
    }
  }
}