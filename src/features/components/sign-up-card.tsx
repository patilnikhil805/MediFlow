"use client"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import React from 'react'
import { Card,CardContent,CardHeader,CardTitle, CardDescription } from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-seprator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema } from "../auth/schemas"
import { useRegister } from "../api/use-register"


const SignUpCard = () => {
    const {mutate} = useRegister();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            name: "",
            email: "",
            password: "",
        }
    })

const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    mutate({ json: values});
}
  return (
    <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
        <CardHeader className='flex items-center justify-center text-center p-7'>
            <CardTitle className='text-2xl'>
                Sign Up
            </CardTitle>
            <CardDescription>
                By signing up, you agree to our{" "}
                <Link href={"/privacy"}>
                    <span className="text-blue-700">Privacy Policy</span>
                </Link>
                and {" "}
                <Link href={"/terms"}>
                    <span className="text-blue-700">Terms of Service</span>
                </Link>
            </CardDescription>
        </CardHeader>
        <div className='px-7 mb-2'>
            <DottedSeparator />
        </div>
        <CardContent className='p-7'>
        <Form {...form}>
            <form onSubmit = {form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <Input
                        {...field}
                        type='string'
                        placeholder='Enter your name'   
                    />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
                    )}
                />
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
                    Register
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
                    Already have an account?
                    <Link href={"/sign-in"}>
                        <span className="text-blue-700"> Sign In</span>
                    </Link>
                </p>
        </CardContent>
    </Card>
  )
}

export default SignUpCard