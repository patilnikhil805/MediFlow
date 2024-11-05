import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.staff)[":staffId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.staff)[":staffId"]["$patch"]
>;

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.staff[":staffId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Staff updated");
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: () => {
      toast.error("Failed to update staff");
    },
  });

  return mutation;
};