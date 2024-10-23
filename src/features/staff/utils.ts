import { DATABASE_ID, STAFF_ID } from "@/config";
import { Query, type Databases } from "node-appwrite";

interface getStaffProps {
    databases: Databases,
    departmentId: string;
    userId: string;
}

export const getStaff = async ({databases, departmentId, userId}: getStaffProps) => {
    const staff = await databases.listDocuments(
        DATABASE_ID,
        STAFF_ID,
        [
            Query.equal("departmentId", departmentId),
            Query.equal("userId", userId),
        ]
    )
    return staff.documents[0]
}
