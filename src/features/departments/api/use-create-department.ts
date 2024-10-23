import { useMutation,useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.departments["$post"]>;
type RequestType = InferRequestType<typeof client.api.departments["$post"]>;

export const useCreateDepartment = () => {
    const router = useRouter()
    const queryClient = useQueryClient();


    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({form}) => {

            if (!form.name) {
                throw new Error("Missing department name");
            }
            const response = await client.api.departments.$post({form})
            if (!response.ok) {
                throw new Error("Failed to create")
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Department created")
            queryClient.invalidateQueries({queryKey: ["departments"]})
        },
        onError: () => {
            toast.error("Failed to create department")
        }
    })

    return mutation;
}