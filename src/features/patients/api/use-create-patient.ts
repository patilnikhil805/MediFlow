import { useMutation,useQueryClient } from "@tanstack/react-query";
import { InferRequestType,InferResponseType } from "hono";

import { client } from "@/lib/rpc"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.patients["$post"], 200>;
type RequestType = InferRequestType<typeof client.api.patients["$post"]>;

export const useCreatePatients = () => {
    const router = useRouter()
    const queryClient = useQueryClient();


    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({form}) => {

            if (!form.name) {
                throw new Error("Missing patient name");
            }
            const response = await client.api.patients.$post({form})
            if (!response.ok) {
                throw new Error("Failed to create")
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Patient created")
            queryClient.invalidateQueries({queryKey: ["patients"]})
        },
        onError: () => {
            toast.error("Failed to create patients")
        }
    })

    return mutation;
}