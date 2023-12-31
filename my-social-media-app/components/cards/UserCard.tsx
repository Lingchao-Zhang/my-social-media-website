"use client"
import { UserCardType } from "@/types"
import Image from "next/image"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

const UserCard = ({ userId, username, name, image }: UserCardType) => {
    const router = useRouter()
    return(
        <article className="user-card">
            <div className="user-card_avatar">
                <Image 
                 src={image}
                 alt="profile image"
                 width={48}
                 height={48}
                 className="rounded-full"
                 />
                 <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>
                 </div>
            </div>
            <Button className="user-card_btn" onClick={() => router.push(`/profile/${userId}`)}>View Profile</Button>
        </article>
    )
}

export default UserCard