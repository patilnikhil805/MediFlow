import { useMutation,useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.departments[":departmentId"]["reset-invite-code"]["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.departments[':departmentId']["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
    const router = useRouter()
    const queryClient = useQueryClient();


    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({param}) => {

           
            
            const response = await client.api.departments[':departmentId']["reset-invite-code"]["$post"]({param})
            if (!response.ok) {
                throw new Error("Failed to reset ")
            }

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Invite code reset")
            queryClient.invalidateQueries({queryKey: ["departments"]})
            queryClient.invalidateQueries({queryKey: ["departments", data.$id]})
        },
        onError: () => {
            toast.error("Failed to reset code")
        }
    })

    return mutation;
}