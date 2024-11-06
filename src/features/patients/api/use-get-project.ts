"use client"

import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface useGetPatientsProps {
    departmentId: string;
}

export const useGetPatients = ({departmentId} : useGetPatientsProps) => {
    const query = useQuery({
        queryKey: ["patients", departmentId],
        queryFn: async () => {
            const response = await client.api.patients.$get({
                query: {departmentId}
            });


            if(!response.ok) {
                throw new Error("Failed to fetch patients");
            }

            const { data } = await response.json();

            return data
        }
    })

    return query
}