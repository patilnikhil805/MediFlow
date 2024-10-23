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
import { useCreateDepartment } from "../api/use-create-department";
import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Department } from "../types";




interface EditDepartmentFormProps {
    onCancel?: () => void;
    initalValues: Department;
};

export const EditDepartmentForm = ({onCancel, initalValues}: EditDepartmentFormProps ) => {

    const router = useRouter();

    const { mutate, isPending } = useCreateDepartment();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof updateDepartmentSchema>>({
        resolver: zodResolver(updateDepartmentSchema),
        defaultValues: {
            ...initalValues,
            image: initalValues.imageUrl ?? "",
        },
        })

        const onSubmit = (values: z.infer<typeof updateDepartmentSchema>) => {
            const finalValues = {
                ...values,
                image: values.image instanceof File ? values.image : undefined,
            }

            if (!finalValues.name) {
                toast.error("Department name is required");
                return;
            }

            mutate({ form: finalValues,
                    param: {departmentId: initalValues.$id}
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

        return (
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex p-7">
                    <CardTitle className="text-cl font-bold">
                        {initalValues.name}
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
                                Create Department
                            </Button>

                        </div>
                        </form>
                    </Form>
                    
                </CardContent>                
            </Card>
        )
}


