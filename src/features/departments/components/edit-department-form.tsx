'use client'


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateDepartmentSchema } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-seprator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Department } from "../types";
import { useUpdateDepartment } from "../api/use-update-department";
import { useConfirm } from "../hooks/use-confirm";
import { useDeleteDepartment } from "../api/use-delete-department";
import { useResetInviteCode } from "../api/use-reset-invite-code";




interface EditDepartmentFormProps {
    onCancel?: () => void;
    initialValues: Department;
};

export const EditDepartmentForm = ({onCancel, initialValues}: EditDepartmentFormProps ) => {

    const router = useRouter();

    const { mutate, isPending } = useUpdateDepartment();
    const inputRef = useRef<HTMLInputElement>(null);
    const { mutate: deleteDepartment, isPending: isDeletingDepartment} = useDeleteDepartment();

    const { mutate: resetInviteCode, isPending: isResettingInviteCode} = useResetInviteCode();


    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone",
        "destructive",
    );

    const [ResetDialog, confirmReset] = useConfirm(
        "Reset invite link",
        "This will invalidate current invite link",
        "destructive",
    );

    const handleDelete = async () => {
        const ok = await confirmDelete();

        if (!ok) return;

        deleteDepartment({
            param: { departmentId: initialValues.$id},
        }, {
            onSuccess: () => {
                window.location.href = "/"
            }
        })
    }

    const handleResetInviteCode = async () => {
        const ok = await confirmReset();

        if (!ok) return;

        resetInviteCode({
            param: { departmentId: initialValues.$id},
        }, {
            onSuccess: () => {
                router.refresh();
            }
        })
    }

    const form = useForm<z.infer<typeof updateDepartmentSchema>>({
        resolver: zodResolver(updateDepartmentSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        },
        })

        const onSubmit = (values: z.infer<typeof updateDepartmentSchema>) => {
            const finalValues = {
                ...values,
                image: values.image instanceof File ? values.image : "",
            }

            if (!finalValues.name) {
                toast.error("Department name is required");
                return;
            }

            mutate({ form: finalValues,
                    param: {departmentId: initialValues.$id}
            }, {
                onSuccess: ({data}) => {
                    
                    router.push(`/departments/${data.$id}`);
                    form.reset();
                }

            });
        };

        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                form.setValue("image", file);
            }
        }

        const fullInviteLink = `${window.location.origin}/departments/${initialValues.$id}/join/${initialValues.inviteCode}`

        const handleCopyInviteLink = () => {
            navigator.clipboard.writeText(fullInviteLink)
            .then(() => toast.success("Invite link copied"))
        }

        return (
            <div className="flex flex-col gap-y-4">
                <DeleteDialog />
                <ResetDialog />
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                    <Button size="sm" variant={"secondary"} onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
                        <ArrowLeftIcon className="size-4 mr-2"/>
                        Back
                    </Button>
                    <CardTitle className="text-xl font-bold">
                        {initialValues.name}
                    </CardTitle>
                </CardHeader>
                <div className="px-7">
                    <DottedSeparator/>
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-y-4">

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Department Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter department name"
                                                />
                                        </FormControl>
                                    </FormItem>
                                )}
                                
                                />
                                <FormField
                                    control={form.control}
                                    name='image'
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-y-2">
                                          <div className="flex items-center gap-x-5">
                                            {field.value ? (
                                              <div className="size-[72px] relative rounded-md overflow-hidden">
                                                <Image
                                                  alt="logo"
                                                  fill
                                                  className="object-cover"
                                                  src={
                                                    field.value instanceof File ? URL.createObjectURL(field.value) : field.value
                                                  }
                                                />
                                              </div>
                                            ) : (
                                              <Avatar className="size-[72px]">
                                                <AvatarFallback>
                                                    <ImageIcon className="size-[36px] text-neutral-100"/>
                                                </AvatarFallback>
                                              </Avatar>
                                            )}
                                            <div className="flex flex-col ">
                                                <p className="text-sm">
                                                    Department Icon
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    JPG, PNG, SVG, OR JPEG, MAX 1MB
                                                </p>
                                                <input 
                                                    className="hidden"
                                                    type="file"
                                                    accept=".jpg, .png, .svg, .jpeg"
                                                    ref={inputRef}
                                                    onChange={handleImageChange}
                                                    disabled={isPending}
                                                />
                                                {field.value ? (

                                            <Button
                                            type="button"
                                            disabled={isPending}
                                            variant={"destructive"}
                                            size="xs"
                                            className="w-fit mt-2"
                                            onClick={() => {
                                                field.onChange(null)
                                                if (inputRef.current) {
                                                    inputRef.current.value = "";
                                                }
                                            }}
                                            >
                                            Remove Image
                                            </Button>
                                            ) : (
                                                <Button
                                                type="button"
                                                disabled={isPending}
                                                variant={"teritary"}
                                                size="xs"
                                                className="w-fit mt-2"
                                                onClick={() => inputRef.current?.click()}
                                                >
                                                Upload Image
                                            </Button>
                                            )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                      
                                />
                            </div>
                        <DottedSeparator className="py-7"/>
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size='lg'
                                variant={'secondary'}
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "invisible")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size='lg'
                                variant={'primary'}
                                disabled={isPending}
                                
                            >
                                Save Changes
                            </Button>

                        </div>
                        </form>
                    </Form>
                    
                </CardContent>                
            </Card>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">
                            Invite Staff
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Use code to invite medical staff to join the department
                        </p>
                        <div className="mt-4">
                            <div className="flex items-center gap-x-2">
                                    <Input disabled value={fullInviteLink}/>
                            <Button
                                onClick={handleCopyInviteLink}
                                variant={"secondary"}
                                className="size-12"
                                >
                                <CopyIcon/>
                            </Button>
                        
                            </div>

                        </div>
                        
                        <Button
                            className="mt-6 w-fit ml-auto"
                            size='sm'
                            variant='destructive'
                            type="button"
                            disabled={isPending || isResettingInviteCode }
                            onClick={handleResetInviteCode}
                        >
                           Reset Invite Link
                        </Button>
                    </div>

                </CardContent>
            </Card>
            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">
                            Danger Zone
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Deleting a department is irreversible and will remove all associated data
                        </p>
                        <Button
                            className="mt-6 w-fit ml-auto"
                            size='sm'
                            variant='destructive'
                            type="button"
                            disabled={isPending || isDeletingDepartment }
                            onClick={handleDelete}
                        >
                           Delete Department 
                        </Button>
                    </div>

                </CardContent>
            </Card>
            </div>
        )
}


