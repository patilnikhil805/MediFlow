import { getCurrent } from "@/features/auth/query";
import { getDepartment } from "@/features/departments/actions";
import { EditDepartmentForm } from "@/features/departments/components/edit-department-form";
import { redirect } from "next/navigation";

interface DepartmentIdSettingsPageProps {
    params: {
        departmentId: string;
    };
}

const DepartmentIdSettingsPage = async ({
    params
}: DepartmentIdSettingsPageProps) => {
    const user = await getCurrent();
    if (!user) redirect ("/sign-in")

    const initialValues = await getDepartment({departmentId: params.departmentId});

    if (!initialValues) {
        redirect(`/department/${params.departmentId}`)
    }

    return ( 
        <div className="w-full lg:max-w-3xl">
            <EditDepartmentForm initialValues={initialValues} />
        </div>
     );
}
 
export default DepartmentIdSettingsPage;