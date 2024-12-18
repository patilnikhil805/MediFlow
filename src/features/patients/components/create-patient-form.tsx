'use client'


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-seprator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCreatePatients } from "../api/use-create-patient";
import { createPatientSchema } from "../schemas";
import { useCreateDepartment } from "@/features/departments/api/use-create-department";
import { useDepartmentId } from "@/features/departments/hooks/use-department-id";




interface CreatePatientFormProps {
    onCancel?: () => void;
};

export const CreatePatientForm = ({onCancel}: CreatePatientFormProps ) => {
    const departmentId = useDepartmentId()
    const router = useRouter();

    const { mutate, isPending } = useCreatePatients();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createPatientSchema>>({
        resolver: zodResolver(createPatientSchema.omit({ departmentId: true})),
        defaultValues: {
            
        },
        })

        const onSubmit = (values: z.infer<typeof createPatientSchema>) => {
            const finalValues = {
                ...values,
                departmentId,
                image: values.image instanceof File ? values.image : "",
            }

            if (!finalValues.name) {
                toast.error("Patient name is required");
                return;
            }

            mutate({ form: finalValues}, {
                onSuccess: ({}) => {
                    
                    // router.push(`/departments/${data.$id}`);
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
                        Create a new patient
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
                                            Patient Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Enter patient name"
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
                                                    Patient Icon
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
                                Create Patient
                            </Button>

                        </div>
                        </form>
                    </Form>
                    
                </CardContent>                
            </Card>
        )
}


