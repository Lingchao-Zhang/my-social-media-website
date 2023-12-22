"use client"
import { threadValidation } from "@/lib/validation/thread"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useOrganization } from "@clerk/nextjs"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
  } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { createThread } from "@/lib/actions/thread.actions"

const ThreadCreation = ({ userId }: { userId: string }) => {
    const pathname = usePathname()
    const router = useRouter()
    const { organization } = useOrganization()
    const form = useForm<z.infer<typeof threadValidation>>({
        resolver: zodResolver(threadValidation),
        defaultValues: {
            thread: "",
            userId: userId
        }
      })
    
    const onSubmit = async (values: z.infer<typeof threadValidation>) => {
        // create thread
        const newThread = {
            text: values.thread,
            author: userId,
            communityId: organization?.id ? organization.id : null,
            path: pathname
        }

        await createThread(newThread)
        router.push("/")
    }
    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                    <FormField
                        control={form.control}
                        name="thread"
                        render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="mt-10 text-base-semibold text-light-2">Thread Content</FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                                <Textarea
                                    rows={15}
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="bg-purple-400">Submit</Button>
                </form>
            </ Form>
        </div>
    )
}

export default ThreadCreation