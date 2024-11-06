import Navbar from '@/components/navbar';
import Sidebar from '@/components/Sidebar';
import { CreateDepartmentModal } from '@/features/departments/components/create-department-modal';
import { CreatePatientModal } from '@/features/patients/components/create-patient-modal';
import React, { Children } from 'react'

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({children}: DashboardLayoutProps) => {
  return (
    <div className='min-h-screen '>
        <CreateDepartmentModal />
        <CreatePatientModal/>
        
        <div className='flex w-full h-full'>
            <div className='fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto'>
                <Sidebar />

            </div>
            <div className='lg:pl-[264px] w-full'>
                <div className='mx-auto max-w-screen-2xl h-full'>
                    <Navbar/>
                    <main className='h-full py-8 px-6 flex flex-col'>
                        {children}      
                    </main>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default DashboardLayout