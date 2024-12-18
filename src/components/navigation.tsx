'use client'
import { cn } from '@/lib/utils'
import { Settings, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { FaHospitalUser } from 'react-icons/fa'
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go'
import { usePathname } from 'next/navigation'
import { useDepartmentId } from '@/features/departments/hooks/use-department-id'

const routes = [
    {
        label: "Home",
        href: "",
        icon: GoHome,
            activeIcon: GoHomeFill,
    },
    {
        label: "Treatment Tasks",
        href: "/tasks",
        icon: GoCheckCircle,
            activeIcon: GoCheckCircleFill,
    },
    {
        label: "Medical Staff",
        href: "/staff",
        icon: FaHospitalUser,
            activeIcon: FaHospitalUser,
    },
    {
        label: "Settings",
        href: "/settings",
        icon: SettingsIcon,
            activeIcon: SettingsIcon,
    },
    
]



const Navigation = () => {
    const departmentId = useDepartmentId();
    const pathname = usePathname()
  return (
    <ul className='flex flex-col'>
        {routes.map((item) => {
            const fullHref = `/departments/${departmentId}${item.href}`
            
            const isActive = pathname === fullHref
            const Icon = isActive ? item.activeIcon : item.icon

            return (
                <Link key={item.href} href={fullHref}>
                    <div className={cn(
                        "flex items-center gap-2.5 p-2.5 rouned-md font-medium hover:text-primary transition text-neutral-500",
                        isActive && 'bg-white shadow-sm hover:opacity-100 text-primary'
                    )}>
                        <Icon className='size-5 text-neutral-500'/>
                        {item.label}
                    </div>
                </Link>
            )
        })}
    </ul>
  )
}

export default Navigation