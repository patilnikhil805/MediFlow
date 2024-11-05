import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.staff)[":staffId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.staff)[":staffId"]["$delete"]
>;

export const useDeleteStaff = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.staff[":staffId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Staff deleted");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: () => {
      toast.error("Failed to delete staff");
    },
  });

  return mutation;
};