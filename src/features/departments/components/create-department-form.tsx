'use client'


import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createDepartmentSchema } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotted-seprator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateDepartment } from "../api/use-create-department";
import { useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";




interface CreateDepartmentFormProps {
    onCancel?: () => void;
};

export const CreateDepartmentForm = ({onCancel}: CreateDepartmentFormProps ) => {

    const { mutate, isPending } = useCreateDepartment();
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof createDepartmentSchema>>({
        resolver: zodResolver(createDepartmentSchema),
        defaultValues: {
            
        },
        })

        const onSubmit = (values: z.infer<typeof createDepartmentSchema>) => {
            mutate({ json: values});
        };

        return (
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex p-7">
                    <CardTitle className="text-cl font-bold">
                        Create a new department
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
                                              <div>
                                                <Image />
                                              </div>
                                            ) : (
                                              <Avatar />
                                            )}
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


