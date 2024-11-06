'use-client'

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { DottedSeparator } from './dotted-seprator'
import Navigation from './navigation'
import DepartmentSwitcher from './department-switcher'
import Patients from './patients'

const Sidebar = () => {
  return (
    <aside className='h-full bg-neutral-100 p-4 w-full'>
        <Link href="/">
            <Image src="/logo.svg" alt="logo" width={164} height={48}/>
        </Link>
        <DottedSeparator className='my-4'/>
        <DepartmentSwitcher />
        <DottedSeparator className='my-4'/>
        <Navigation/>
        <DottedSeparator className='my-4'/>
        <Patients />
    </aside>
  )
}

export default Sidebar