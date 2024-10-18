"use client"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import React from 'react'
import { Card,CardContent,CardHeader,CardTitle } from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-seprator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import Link from "next/link"
import { LoginSchema } from "../auth/schemas"
import { useLogin } from "../api/use-login"





const SignInCard = () => {
    const {mutate} = useLogin();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            email: "",
            password: "",
        }
    })

const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    mutate({json: values});
}

  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
        <CardHeader className='flex items-center justify-center text-center p-7'>
            <CardTitle className='text-2xl'>
                Welcome Back
            </CardTitle>
        </CardHeader>
        <div className='px-7 mb-2'>
            <DottedSeparator />
        </div>
        <CardContent className='p-7'>
            <Form {...form}>
            <form  onSubmit = {form.handleSubmit(onSubmit)}className='space-y-4'>
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                        {...field}
                        type='email'
                        placeholder='Enter email address'   
                    />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                    )}
                />
                <FormField
                    name="password"
                    control={form.control}
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                        {...field}
                        type='password'
                        placeholder='Enter password'   
                    />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                    )}
                />
                
                
                <Button disabled={false} size="lg" className='w-full'>
                    Login
                </Button>
            </form>
            </Form>
        </CardContent>
        <div className='px-7'>
            <DottedSeparator/>
        </div>
        <CardContent className='p-7 flex flex-col gap-y-4'>
            <Button variant={"secondary"} disabled={false} size="lg" className='w-full'>
            <span className="mr-2 text-2xl">
                <FcGoogle />
            </span>
                Login with Google
            </Button>
        </CardContent>
        <CardContent>
            <Button variant={"secondary"} disabled={false} size="lg" className='w-full'>
            <span className="mr-2 text-2xl">
                <FaGithub />
            </span>

                Login with Github
            </Button>
        </CardContent>
        <div className="px-7 mb-5">
            <DottedSeparator/>
        </div>
        <CardContent className="px-7 flex items-center justify-center">
                <p>
                    Dont have an account?
                    <Link href={"/sign-up"}>
                        <span className="text-blue-700"> Sign Up</span>
                    </Link>
                </p>
        </CardContent>
    </Card>
  )
}

export default SignInCard