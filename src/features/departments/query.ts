"use server";

import { DATABASE_ID, DEPARTMENTS_ID, STAFF_ID } from "@/config";
import { getStaff } from "../staff/utils";
import { Department } from "./types";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";

export const getDepartments = async () => {
    try {
        const { databases, account } = await createSessionClient();
        const user = await account.get();

        const staff = await databases.listDocuments(
            DATABASE_ID,
            STAFF_ID,
            [Query.equal("userId", user.$id)]
        );

        if (staff.total === 0) {
            return { documents: [], total: 0 };
        }

        const departmentIds = staff.documents.map((staff) => staff.departmentId);

        const departments = await databases.listDocuments(
            DATABASE_ID,
            DEPARTMENTS_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", departmentIds),
            ]
        );

        return departments;
    } catch {
        return { documents: [], total: 0 };
    }
};

interface getDepartmentProps {
    departmentId: string;
}

export const getDepartment = async ({ departmentId }: getDepartmentProps) => {
    try {
        const { databases, account } = await createSessionClient();
        const user = await account.get();

        const staff = await getStaff({
            databases,
            userId: user.$id,
            departmentId,
        });

        if (!staff) {
            return null;
        }

        const department = await databases.getDocument<Department>(
            DATABASE_ID,
            DEPARTMENTS_ID,
            departmentId
        );

        return department;
    } catch {
        return null;
    }
};

interface getDepartmentInfoProps {
    departmentId: string;
}

export const getDepartmentInfo = async ({ departmentId }: getDepartmentInfoProps) => {
    try {
        const { databases } = await createSessionClient();

        const department = await databases.getDocument<Department>(
            DATABASE_ID,
            DEPARTMENTS_ID,
            departmentId
        );

        return {
            name: department.name,
        };
    } catch {
        return null;
    }
};
