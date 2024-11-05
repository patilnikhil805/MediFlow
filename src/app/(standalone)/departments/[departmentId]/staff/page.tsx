import { redirect } from "next/navigation";


import { getCurrent } from "@/features/auth/query";
import { StaffList } from "@/features/staff/components/staff-list";

const DepartmentIdStaffPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <StaffList/>
    </div>
  );
};

export default DepartmentIdStaffPage;