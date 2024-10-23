"use server"

import { cookies } from "next/headers"
import { Account, Client, Databases, Query } from "node-appwrite"
import { AUTH_COOKIE } from "../auth/constants"
import { DATABASE_ID, DEPARTMENTS_ID, STAFF_ID } from "@/config"

export const getDepartments = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

        const session = await cookies().get(AUTH_COOKIE)

        if (!session)  return { documents: [], total: 0};

        client.setSession(session.value)
        
        const account = new Account(client);
        const databases = new Databases(client);
        const user = await account.get();

        const staff = await databases.listDocuments(
            DATABASE_ID,
            STAFF_ID,
            [Query.equal("userId", user.$id)]
        );

        if (staff.total === 0) {
            return {documents: [], total: 0};
        }

        const departmentIds = staff.documents.map((staff) => staff.departmentId);

        const departments = await databases.listDocuments(
            DATABASE_ID,
            DEPARTMENTS_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", departmentIds)
            ]
        );

        return departments;
    } catch {
         return  {documents: [], total: 0};
        ;
    }
}