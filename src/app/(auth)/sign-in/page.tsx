import { getCurrent } from '@/features/auth/query'
import SignInCard from '@/features/auth/components/sign-in-card'
import { redirect } from 'next/navigation'
import React from 'react'

const SignInPage = async () => {
const currentuser = await getCurrent()

if (currentuser) redirect ("/")
  return <SignInCard />
}

export default SignInPage