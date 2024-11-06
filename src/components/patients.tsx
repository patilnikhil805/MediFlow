'use client'

import { useDepartmentId } from '@/features/departments/hooks/use-department-id'
import { useGetPatients } from '@/features/patients/api/use-get-project'
import { useCreatePatientModal } from '@/features/patients/hooks/use-create-patient-modal'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { RiAddCircleFill } from 'react-icons/ri'



const Patients = () => {
  const { open } = useCreatePatientModal();
  const pathname = usePathname();
  const departmentId = useDepartmentId()
  
  const { data } = useGetPatients({
    departmentId
  });

  // const handleAddClick = () => {
  //   console.log("Add new project clicked");
  // };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Patients</p>
        <RiAddCircleFill
          onClick={open}
          className="text-neutral-500 cursor-pointer hover:opacity-75 transition"
          size={20}
        />
      </div>
      {data?.documents.map((patient) => {
        const href = `/departments/${departmentId}/patients/${patient.$id}`;
        const isActive = pathname === href;

        return (
          <Link href={href} key={patient.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              {/* <ProjectAvatar image={project.imageUrl} name={project.name} /> */}
              <span className="truncate">{patient.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  )
}

export default Patients;