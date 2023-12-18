
import { ThreadCardType } from "@/types"
import Image from "next/image"
import Link from "next/link"

const ThreadCard = ({ 
    threadId,
    currentUserId,
    content,
    parentId,
    author,
    createdAt,
    community,
    comments,
    isComment }: ThreadCardType) => {
    return(
        <article className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"}`}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 flex-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image 
                              src={author.image}
                              alt="Profile Image"
                              fill
                              className="cursor-pointer rounded-full"
                            />
                        </Link>
                        <div className="thread-card_bar"/>
                    </div>
                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.username}</h4>
                        </Link>
                        <p className="mt-2 text-small-regular text-light-2">{content}</p>
                        <div className={`${isComment ? "mb-10" : ""} mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <Image 
                                src={"/heart-gray.svg"}
                                alt="heart"
                                width={24}
                                height={24}
                                className="cursor-pointer object-contain" 
                                />
                                <Link href={`/thread/${threadId}`}>
                                    <Image 
                                    src="/reply.svg"
                                    alt="reply"
                                    width={24}
                                    height={24}
                                    className="cursor-pointer object-contain" 
                                    />
                                </Link>
                                <Image 
                                src="/share.svg"
                                alt="share"
                                width={24}
                                height={24}
                                className="cursor-pointer object-contain" 
                                />
                                <Image 
                                src="/repost.svg"
                                alt="repost"
                                width={24}
                                height={24}
                                className="cursor-pointer object-contain" 
                                />
                            </div>
                            {
                                comments.length > 0 ? 
                                <Link href={`/thread/${threadId}`}>
                                    <div className="flex">
                                        {
                                            comments.map((comment) => (
                                                <Image 
                                                key={comment.author.image}
                                                src={comment.author.image}
                                                alt="images of commentors"
                                                height={14}
                                                width={14}
                                                className="cursor-pointer object-contain rounded-xl"
                                                />
                                            ))
                                        }
                                        <p className="mt-1 ml-2 text-subtle-medium text-gray-1">{comments.length} {comments.length === 1 ? "reply" : "replies"}</p>
                                    </div>
                                </Link>
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default ThreadCard