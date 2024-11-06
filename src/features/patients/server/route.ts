import { DATABASE_ID, IMAGES_BUCKET_ID, PATIENT_ID } from "@/config";
import { getStaff } from "@/features/staff/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createPatientSchema} from "../schemas";

const app = new Hono()
.post(
  "/",
  sessionMiddleware,
  zValidator("form", createPatientSchema),
  async (c) => {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");

    const { name, image, departmentId } = c.req.valid("form");

    const staff = await getStaff({
      databases,
      departmentId,
      userId: user.$id,
    });

    if (!staff) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
      const file = await storage.createFile(
        IMAGES_BUCKET_ID,
        ID.unique(),
        image
      );

      const arrayBuffer = await storage.getFilePreview(
        IMAGES_BUCKET_ID,
        file.$id
      );

      uploadedImageUrl = `data:image/png;base64,${Buffer.from(
        arrayBuffer
      ).toString("base64")}`;
    }

    const patient = await databases.createDocument(
      DATABASE_ID,
      PATIENT_ID,
      ID.unique(),
      {
        name,
        imageUrl: uploadedImageUrl,
        departmentId,
      }
    );

    return c.json({ data: patient });
  }
)
.get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ departmentId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { departmentId } = c.req.valid("query");

      if (!departmentId) {
        return c.json({ error: "Missing workspaceId" }, 400);
      }

      const staff = await getStaff({
        databases,
        departmentId,
        userId: user.$id,
      });

      if (!staff) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const patients = await databases.listDocuments(
        DATABASE_ID,
        PATIENT_ID,
        [Query.equal("departmentId", departmentId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: patients });
    }
  )

export default app;