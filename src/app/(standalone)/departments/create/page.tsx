import { getCurrent } from "@/features/auth/query";
import { CreateDepartmentForm } from "@/features/departments/components/create-department-form";
import { redirect } from "next/navigation";

const DepartmentCreatePage = async () => {

    const user = await getCurrent();
    if (!user) redirect("/sign-in");

    
    return ( 
        <div className="w-full lg:max-w-xl">
            <CreateDepartmentForm/>
        </div>
     );
}
 
export default DepartmentCreatePage;