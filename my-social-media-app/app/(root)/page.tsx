import { fetchThreads } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs"

export default async function Home() {
  const result = await fetchThreads(1, 20)
  const threads = result.displayedThreads 
  console.log(threads)
  return (
    <section></section>
  )
}