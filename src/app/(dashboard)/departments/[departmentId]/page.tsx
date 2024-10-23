import { getCurrent } from '@/features/auth/query';
import { redirect } from 'next/navigation';
import React from 'react'

export const DepartmentIdPage =  async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  
  return (
    <div>DepartmentIdPage</div>
  )
}

export default DepartmentIdPage