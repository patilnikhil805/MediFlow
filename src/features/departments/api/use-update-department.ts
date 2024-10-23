import { useMutation,useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.departments[":departmentId"]["$patch"], 200>;
type RequestType = InferRequestType<typeof client.api.departments[":departmentId"]["$patch"]>;

export const useUpdateDepartment = () => {
    const router = useRouter()
    const queryClient = useQueryClient();


    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({form, param}) => {

            if (!form.name) {
                throw new Error("Missing department name");
            }
            const response = await client.api.departments[":departmentId"]["$patch"]({form,param})
            if (!response.ok) {
                throw new Error("Failed to Update department")
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Department updated")
            queryClient.invalidateQueries({queryKey: ["departments"]})
            queryClient.invalidateQueries({queryKey: ["departments", data.$id]})
        },
        onError: () => {
            toast.error("Failed to update department")
        }
    })

    return mutation;
}