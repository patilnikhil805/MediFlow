"use client"

import { DottedSeparator } from "@/components/dotted-seprator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useJoinDepartment } from "../api/use-join-department"
import { useInviteCode } from "../hooks/use-invite-code"
import { useDepartmentId } from "../hooks/use-department-id"
import { useRouter } from "next/navigation"


interface JoinDepartmentFormProps {
    initialValues: {
        name: string
    }
}

export const JoinDepartmentForm = ({
    initialValues
} : JoinDepartmentFormProps) => {
    
    const departmentId = useDepartmentId();
    const inviteCode = useInviteCode();
    const { mutate, isPending } = useJoinDepartment();
    const router = useRouter();

    const onSubmit  = () => {
        mutate({
            param: { departmentId },
            json: { code: inviteCode}
        }, {
            onSuccess: ({ data }) => {
                router.push(`/departments/${data.$id}`);
            }

        })
    }
    


    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join Department
                </CardTitle>
                <CardDescription>
                    You've been invited to join <strong>{initialValues.name}</strong> Department
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <div>
                <CardContent className="p-7">
                    <div className="flex flex-col lg:flex-row gap-2 items-center justify-between">
                        <Button className="w-full lg:w-fit" 
                                type="button"
                                asChild
                                variant={"secondary"}
                                disabled={isPending}
                        >
                            <Link href={"/"}>
                            Cancel
                            </Link>
                        </Button>
                        <Button className="w-full lg:w-fit"
                                size={"lg"}
                                type="button"
                                onClick={onSubmit}
                                disabled={isPending}
                        >
                            Join Department
                        </Button>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}