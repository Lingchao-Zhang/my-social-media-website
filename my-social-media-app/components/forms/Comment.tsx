"use client"
import { CommentType } from "@/types"
import { commentValidation } from "@/lib/validation/thread"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { addCommentToThread } from "@/lib/actions/thread.actions"

const Comment = ({ threadId, currentUserId, currentUserImage }: CommentType) => {
    const pathname = usePathname()
    const router = useRouter()
    const form = useForm<z.infer<typeof commentValidation>>({
        resolver: zodResolver(commentValidation),
        defaultValues: {
            thread: ""
        }
      })
    
    const onSubmit = async (values: z.infer<typeof commentValidation>) => {
        await addCommentToThread(threadId, values.thread, currentUserId, pathname)
        router.refresh()
    }
    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
                    <FormField
                        control={form.control}
                        name="thread"
                        render={({ field }) => (
                        <FormItem className="flex gap-3 items-center w-full">
                            <FormLabel>
                                <Image 
                                 src={currentUserImage}
                                 alt="profile image"
                                 width={48}
                                 height={48}
                                 className="rounded-full object-cover"
                                 />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    placeholder="comment something"
                                    {...field} 
                                    className="no-focus text-light-1 outline-none"
                                />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="comment-form_btn">Reply</Button>
                </form>
            </ Form>
        </div>
    )
}

export default Comment