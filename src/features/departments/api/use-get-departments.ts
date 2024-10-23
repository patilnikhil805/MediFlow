"use client"

import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetDepartments = () => {
    const query = useQuery({
        queryKey: ["departments"],
        queryFn: async () => {
            const response = await client.api.departments.$get();


            if(!response.ok) {
                throw new Error("Failed to fetch departments");
            }

            const { data } = await response.json();

            return data
        }
    })

    return query
}