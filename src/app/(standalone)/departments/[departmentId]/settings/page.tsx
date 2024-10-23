import { getCurrent } from "@/features/auth/query";
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


    return ( 
        <div>
            DepartmentIdSettingsPage: {params.departmentId}
        </div>
     );
}
 
export default DepartmentIdSettingsPage;