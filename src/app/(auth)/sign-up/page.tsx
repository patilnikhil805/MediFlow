

import { getCurrent } from '@/features/auth/query'
import SignUpCard from '@/features/auth/components/sign-up-card'
import { redirect } from 'next/navigation'
import React from 'react'

const SignUp =  async () => {
  const currentuser = await getCurrent()

  if (currentuser) redirect ("/")
  return (
    <div>
      <SignUpCard/>
    </div>
  )
}

export default SignUp