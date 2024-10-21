

import { getCurrent } from "@/features/auth/actions";
import { CreateDepartmentForm } from "@/features/departments/components/create-department-form";
import { redirect } from "next/navigation";



export default async function Home() {
    const currentuser =  await getCurrent();

    if (!currentuser) redirect("/sign-in");

  return (
    <div>
      <CreateDepartmentForm  />
    </div>
  )
}