import { fetchThreadById } from "@/lib/actions/thread.actions"
import { fetchActivities, fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

const ActivityPage = async () => {
    const user = await currentUser()
    if(!user){
        return null
    } else {
        const userInfo = await fetchUser(user.id)
        if(!userInfo?.onboarded){
            redirect("/onboarding")
        } else{
            const activities = await fetchActivities(userInfo._id)
            return(
                <section className="mt-10 flex flex-col gap-5">
                        {
                            activities.length > 0 ? 
                            <>
                                {
                                    activities.map(async (activity) => {
                                        const originalThread = await fetchThreadById(activity.parentId)
                                        return(
                                            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                                                <article className="activity-card">
                                                    <Image 
                                                     src={activity.author.image}
                                                     alt="profile image"
                                                     width={20}
                                                     height={20}
                                                     className="rounded-full object-cover"
                                                     />
                                                     <p className="!text-small-regular text-light-1">
                                                        <span className="mr-1 text-primary-500">
                                                            {activity.author.username}
                                                        </span>
                                                        {originalThread.parentId ? " replied to your comment": " replied to your thread"}
                                                     </p>
                                                </article>
                                            </Link>
                                        )
                                    })
                                }
                            </>
                            :
                            <p className="!text-base-regular text-light-3">No activities yet</p>
                        }
                </section>
            )
        }
    }
}

export default ActivityPage