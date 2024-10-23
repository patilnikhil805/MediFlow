import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createDepartmentSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, DEPARTMENTS_ID, IMAGES_BUCKET_ID, STAFF_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { StaffRole } from "@/features/staff/types";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
    .get("/", sessionMiddleware, async (c) => {

        const user = c.get('user')
        const databases = c.get("databases")

        const staff = await databases.listDocuments(
            DATABASE_ID,
            STAFF_ID,
            [Query.equal("userId", user.$id)]
        );

        if (staff.total === 0) {
            return c.json({ data: {documents: [], total: 0}});
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

        return c.json({data : departments});
    })
    .post(
        '/',
        zValidator("form", createDepartmentSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get('user')
            const storage = c.get('storage')
            
            const {name, image} = c.req.valid("form")
            
            let uploadedImageUrl: string | undefined;

            if (image instanceof File ) {
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                );

                const arrayBuffer = await storage.getFilePreview(
                    IMAGES_BUCKET_ID,
                    file.$id,

                )

                uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
            }

            const department = await databases.createDocument(
                DATABASE_ID,
                DEPARTMENTS_ID,
                ID.unique(),
                {
                    name,
                    userId: user.$id,
                    imageUrl: uploadedImageUrl,
                    inviteCode: generateInviteCode(9)
                }
            );

            await databases.createDocument(
                DATABASE_ID,
                STAFF_ID,
                ID.unique(),
                {
                    userId: user.$id, 
                    departmentId: department.$id,
                    role: StaffRole.ADMIN,
                },
            )

            return c.json({ data: department});
        }
    )
export default app