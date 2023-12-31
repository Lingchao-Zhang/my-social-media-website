import ThreadCard from "@/components/cards/ThreadCard"
import Pagination from "@/components/shared/Pagination"
import { createCommunity, deleteCommunity, updateCommunityInfo } from "@/lib/actions/community.actions"
import { fetchThreads } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Home({ searchParams: { page }}: { searchParams: { page: string | null }}) {
  const user = await currentUser()
  if(!user){
    return null
  } else{
    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded){
      redirect("/onboarding")
    } else {
      const currentPageNumber = page ? parseInt(page) : 1
      const result = await fetchThreads(currentPageNumber, 2)
      const threads = result.displayedThreads 
      const isNext = result.isNext
    
      return (
        <>
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

          <Pagination
            path='/'
            pageNumber={currentPageNumber}
            isNext={isNext}
          />
        </>
      )
    }
  }
}