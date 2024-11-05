import { getCurrent } from '@/features/auth/query'
import { JoinDepartmentForm } from '@/features/departments/components/join-workspace-form';
import { getDepartmentInfo } from '@/features/departments/query';
import { redirect } from 'next/navigation';
import React from 'react'

interface DepartmentIdSettingsJoinPageProps {
  params: {
      departmentId: string;
    };
}

  const DepartmentIdJoinPage = async ({
    params
  }: DepartmentIdSettingsJoinPageProps) => {
      const user = await getCurrent();
      if (!user) redirect ("/sign-in")
      
      const initialValues = await getDepartmentInfo({
        departmentId: params.departmentId,
      })

      if (!initialValues ) {
        redirect("/")
      }
        



  return (
    <div className='w-full lg:max-w-xl'>
      <JoinDepartmentForm initialValues={initialValues} />
    </div>
  )
}

export default DepartmentIdJoinPage