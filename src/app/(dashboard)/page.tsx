

import { getCurrent } from "@/features/auth/query";
import { getDepartments } from "@/features/departments/actions";
import { redirect } from "next/navigation";



export default async function Home() {

    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    const departments = await getDepartments();
    if (departments.total === 0) {
      redirect("/departments/create")
    } else {
      redirect(`/departments/${departments.documents[0].$id}`)
    }
}