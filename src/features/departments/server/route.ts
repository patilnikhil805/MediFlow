import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createDepartmentSchema, updateDepartmentSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, DEPARTMENTS_ID, IMAGES_BUCKET_ID, STAFF_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { StaffRole } from "@/features/staff/types";
import { generateInviteCode } from "@/lib/utils";
import { getStaff } from "@/features/staff/utils";
import { X } from "lucide-react";
import { error } from "console";
import { z } from "zod";
import { Department } from "../types";

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
    .patch(
        "/:departmentId",
        sessionMiddleware,
        zValidator("form", updateDepartmentSchema),
        async (c) => {
            const databases = c.get('databases')
            const storage =c.get('storage')
            const user = c.get('user')

            const { departmentId } = c.req.param();
            const { name, image } = c.req.valid("form")

            const staff =  await getStaff({
                databases,
                departmentId,
                userId: user.$id,
            })

            if (!staff || staff.role != StaffRole.ADMIN) {
                return c.json({ error: "Unauthorized"}, 401)
            }
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
            } else {
                uploadedImageUrl = image;
            }

            const department = await databases.updateDocument(
                DATABASE_ID,
                DEPARTMENTS_ID,
                departmentId,
                {
                    name,
                    imageUrl: uploadedImageUrl
                }
            )
            return c.json({ data: department});
        }
    )
    .delete(
        '/:departmentId',
        sessionMiddleware,
        async (c) => {
            const databases = c.get('databases')
            const user = c.get('user')

            const { departmentId} = c.req.param();

            const staff = await getStaff({
                databases,
                departmentId,
                userId: user.$id
            })

            if (!staff || staff.role !== StaffRole.ADMIN) {
                return c.json ({error:  "Unauthorized"}, 401)
            }

            await databases.deleteDocument (
                DATABASE_ID,
                DEPARTMENTS_ID,
                departmentId,
            )

            return c.json({ data: { $id: departmentId}})
            
        }
    )
    .post(
        '/:departmentId/reset-invite-code',
        sessionMiddleware,
        async (c) => {
            const databases = c.get('databases')
            const user = c.get('user')

            const { departmentId} = c.req.param();

            const staff = await getStaff({
                databases,
                departmentId,
                userId: user.$id
            })

            if (!staff || staff.role !== StaffRole.ADMIN) {
                return c.json ({error:  "Unauthorized"}, 401)
            }

            const department = await databases.updateDocument (
                DATABASE_ID,
                DEPARTMENTS_ID,
                departmentId,
                {
                    inviteCode: generateInviteCode(9)
                }
            )

            return c.json({ data: { $id: department}})
            
        }
    )
    .post("/:departmentId/join",
        sessionMiddleware,
        zValidator('json', z.object({ code: z.string() })),
        async (c) => {
            const { departmentId } = c.req.param();
            const { code  } = c.req.valid("json")

            const databases =  c.get("databases")
            const user = c.get("user")

            const staff = await getStaff({
                departmentId,
                userId: user.$id,
                databases,
            })

            if (staff) {
                return c.json({ error: "Already a member"}, 500)
            }

            const department = await databases.getDocument<Department>(
                DATABASE_ID,
                DEPARTMENTS_ID,
                departmentId
            )

            if (department.inviteCode != code) {
                return c.json({error : "Invalid invite code "}, 400);
            }

            await databases.createDocument (
                DATABASE_ID,
                STAFF_ID,
                ID.unique(),
                {
                    departmentId,
                    userId: user.$id,
                    role: StaffRole.STAFF,
                },

            )
            return c.json ({ data: department})
        }
    )
export default app