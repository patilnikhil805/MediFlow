"use client"

import { useGetDepartments } from "@/features/departments/api/use-get-departments"
import { RiAddCircleFill} from 'react-icons/ri'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { DepartmentAvatar } from "@/features/departments/components/department-avatar"
import { useRouter } from "next/navigation"
import { useDepartmentId } from "@/features/departments/hooks/use-department-id"
import { useCreateDepartmentModal } from "@/features/departments/hooks/use-create-department-modal"




const DepartmentSwitcher = () => {
  const departmentId = useDepartmentId();
  const { data: departments } = useGetDepartments();
  const router = useRouter();
  const { open } = useCreateDepartmentModal()

  const onSelect = (id: string) => {
    router.push(`/departments/${id}`)
  }


  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">
          Departments
        </p>
        <span onClick={open}className="text-neutral-500 cursor-pointer hover:opacity-75 transition">
            <RiAddCircleFill  size={20} />
        </span>
      </div>
      <Select onValueChange={onSelect} value={departmentId}>
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1" >
          <SelectValue placeholder="No department selected" />
          <SelectContent>
            {
              departments?.documents.map((department) => (
                <SelectItem key={department.$id} value={department.$id}>
                  <div className="flex justify-start items-center gap-4 font-medium">
                      <DepartmentAvatar name={department.name} image={department.imageUrl} />
                      <span className="truncate">
                        {department.name}
                      </span>
                  </div>
                </SelectItem>
              ))
            }
          </SelectContent>
        </SelectTrigger>
      </Select>

    </div>
  )
}

export default DepartmentSwitcher