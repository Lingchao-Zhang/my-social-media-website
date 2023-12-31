"use client"
import { deleteThread } from "@/lib/actions/thread.actions";
import { DeleteThreadType } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation";

const DeleteThread = ({ threadId }: DeleteThreadType) => {
    const router = useRouter()

    return(
        <Image
            src='/delete.svg'
            alt='delete'
            width={18}
            height={18}
            className='cursor-pointer object-contain'
            onClick={async () => {
                await deleteThread(threadId);
                router.refresh()
            }}
        />
    )
}

export default DeleteThread