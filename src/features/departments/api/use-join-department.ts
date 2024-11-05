import { useMutation,useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.departments[":departmentId"]["join"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.departments[':departmentId']["join"]["$post"]>;

export const useJoinDepartment = () => {
    const router = useRouter()
    const queryClient = useQueryClient();


    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({param, json}) => {
            
            const response = await client.api.departments[':departmentId']["join"]["$post"]({param, json})
            if (!response.ok) {
                throw new Error("Failed to join department ")
            }

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Joined Department")
            queryClient.invalidateQueries({queryKey: ["departments"]})
            queryClient.invalidateQueries({queryKey: ["departments", data.$id]})
        },
        onError: () => {
            toast.error("Failed to join department")
        }
    })

    return mutation;
}