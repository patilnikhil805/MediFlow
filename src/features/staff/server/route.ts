import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getStaff } from "../utils";
import { DATABASE_ID, STAFF_ID } from "@/config";
import { Query } from "node-appwrite";
import { StaffRole } from "../types";

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ departmentId: z.string() })),
        async (c) => {
            const { users } = await createAdminClient();
            const databases = c.get("databases")
            const user = c.get("user")
            const { departmentId} = c.req.valid("query")

            const staff = await getStaff({
                databases,
                departmentId,
                userId: user.$id
            })

            if (!staff) {
                return c.json({error: "Unauthorized " }, 401);
            }

            const staffs = await databases.listDocuments(
                DATABASE_ID,
                STAFF_ID,
                [Query.equal("departmentId", departmentId)]
            )

            const populatedStaff = await Promise.all(
                staffs.documents.map(async (staff) => {
                    const user = await users.get(staff.userId);

                    return {
                        ...staff,
                        name: user.name,
                        email: user.email
                    }
                })
            )
            return c.json({
                data: {
                    ...staffs,
                    documents: populatedStaff,
                
                }
            })
        }
        
    )
    .delete (
        "/:staffId",
        sessionMiddleware,
        async (c) => {
            const { staffId } = c.req.param();
            const user = c.get("user")
            const databases = c.get("databases")

            const staffToDelete = await databases.getDocument(
                DATABASE_ID,
                STAFF_ID,
                staffId,

            )

            const allStaffInDepartment = await databases.listDocuments(
                DATABASE_ID,
                STAFF_ID,
                [Query.equal("departmentId", staffToDelete.departmentId)]
              );

              const staff = await getStaff({
                databases,
                departmentId: staffToDelete.departmentId,
                userId: user.$id,
              });

              if (!staff) {
                return c.json({ error: "Unauthorized" }, 401);
              }
          
              if (staff.$id !== staffToDelete.$id && staff.role !== StaffRole.ADMIN) {
                return c.json({ error: "Unauthorized" }, 401);
              }
          
              if (allStaffInDepartment.total === 1) {
                return c.json({ error: "Cannot delete the only member" }, 400);
              }
          
              await databases.deleteDocument(DATABASE_ID, STAFF_ID, staffId);
              return c.json({ data: { $id: staffToDelete.$id } });
        }   

    )
    .patch(
        "/:staffId",
        sessionMiddleware,
        zValidator("json", z.object({ role: z.nativeEnum(StaffRole) })),
        async (c) => {
          const { staffId } = c.req.param();
          const { role } = c.req.valid("json");
          const user = c.get("user");
          const databases = c.get("databases");
    
          const staffToUpdate = await databases.getDocument(
            DATABASE_ID,
            STAFF_ID,
            staffId
          );
    
          const allStaffInDepartment = await databases.listDocuments(
            DATABASE_ID,
            STAFF_ID,
            [Query.equal("departmentId", staffToUpdate.departmentId)]
          );
    
          const staff = await getStaff({
            databases,
            departmentId: staffToUpdate.departmentId,
            userId: user.$id,
          });
    
          if (!staff) {
            return c.json({ error: "Unauthorized" }, 401);
          }
    
          if (staff.role !== StaffRole.ADMIN) {
            return c.json({ error: "Unauthorized" }, 401);
          }
    
          if (allStaffInDepartment.total === 1) {
            return c.json({ error: "Cannot downgrade the only member" }, 400);
          }
    
          await databases.updateDocument(DATABASE_ID, STAFF_ID, staffId, {
            role,
          });
    
          return c.json({ data: { $id: staffToUpdate.$id } });
        }
      );
export default app;