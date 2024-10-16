"use client"

import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import React from 'react'
import { Card,CardContent,CardHeader,CardTitle, CardDescription } from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-seprator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from "next/link"

const SignUpCard = () => {
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
            <form className='space-y-4'>
            <Input
                required
                type='text'
                value={""}
                onChange={() => {}}
                placeholder='Enter your name'
                disabled={false}
                />
                <Input
                required
                type='email'
                value={""}
                onChange={() => {}}
                placeholder='Enter email address'
                disabled={false}
                />
                <Input
                required
                type='password'
                value={""}
                onChange={() => {}}
                placeholder='Enter password'
                disabled={false}
                min={8}
                max={256}
                />
                <Button disabled={false} size="lg" className='w-full'>
                    Register
                </Button>
            </form>
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
    </Card>
  )
}

export default SignUpCard