"use client"
import { formValidation } from "@/lib/validation/user"
import { AccountProfileType } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { isBase64Image } from "@/lib/utils"
import { updateUser } from "@/lib/actions/user.actions"
import { usePathname, useRouter } from "next/navigation"

const AccountProfile = ({ user, buttonTitle }:  AccountProfileType) => {
    const [files, setFiles] = useState<File[]>([])
    const pathname = usePathname()
    const router = useRouter()
    const { startUpload } = useUploadThing("media")
    const form = useForm<z.infer<typeof formValidation>>({
        resolver: zodResolver(formValidation),
        defaultValues: {
            profile_image: user.imageUrl || "",
            username: user.username || "",
            name: user.name || "",
            biography: user.biography || "" 
        },
      })
    
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault()

        const fileReader = new FileReader()
        if(e.target.files && e.target.files.length > 0){
            const file = e.target.files[0]
            setFiles(Array.from(e.target.files))

            if(!file.type.includes("image")){
                return
            } else {
                fileReader.onload = async (event) => {
                    const imageDataUrl = event.target?.result?.toString() || ""
                    fieldChange(imageDataUrl)
                }
             fileReader.readAsDataURL(file)
            }
        }
    }
    const onSubmit = async (values: z.infer<typeof formValidation>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const blob = values.profile_image
        const isImageChanged = isBase64Image(blob)
        
        if(isImageChanged){
          const imgRes = await startUpload(files)
          
          if(imgRes && imgRes[0].url){
            values.profile_image = imgRes[0].url
          }
        }

        const onboardingUser = {
          userId: user.id,
          username: values.username,
          name: values.name,
          image: values.profile_image,
          biography: values.biography,
          path: pathname
        }
        
        await updateUser(onboardingUser)

        if(pathname === "/profile/edit"){
          router.back()
        } else {
          router.push("/")
        }
      }
      
    return(
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
            <FormField
                control={form.control}
                name="profile_image"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4">
                    <FormLabel className="account-form_image-label">
                        {
                            field.value ? 
                            <Image 
                            src={field.value}
                            alt="profile image"
                            width={96}
                            height={96}
                            priority
                            className="rounded-full object-contain"
                            />
                            :
                            <Image 
                            src="/profile.svg"
                            alt="profile image"
                            width={24}
                            height={24}
                            className="object-contain"
                            />
                        }
                    </FormLabel>
                    <FormControl className="flex-1 text-base-semibold text-gray-200">
                        <Input  
                            type="file"
                            accept="image/*"
                            placeholder="Upload a photo"
                            className="account-form_image-input"
                            onChange={(e) => handleImageChange(e, field.onChange)} 
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-full">
                    <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
                    <FormControl>
                        <Input
                         className="account-form_input no-focus"
                         {...field}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-full">
                    <FormLabel className="text-base-semibold text-light-2">Username</FormLabel>
                    <FormControl>
                        <Input
                         className="account-form_input no-focus"
                         {...field}  
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-full">
                    <FormLabel className="text-base-semibold text-light-2">Biography</FormLabel>
                    <FormControl>
                        <Textarea
                         className="account-form_input no-focus"
                         {...field} 
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <Button type="submit" className="bg-purple-400">Submit</Button>
        </form>
    </Form>
    )
}

export default AccountProfile