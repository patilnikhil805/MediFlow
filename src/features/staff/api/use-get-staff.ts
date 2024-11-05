import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetStaffProps {
  departmentId: string;
}

export const useGetStaff = ({ departmentId }: UseGetStaffProps) => {
  const query = useQuery({
    queryKey: ["staff", departmentId],
    queryFn: async () => {
      const response = await client.api.staff.$get({
        query: { departmentId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch staff");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};