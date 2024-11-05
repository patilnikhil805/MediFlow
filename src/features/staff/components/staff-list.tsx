"use client";

import Link from "next/link";
import { Fragment } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/features/departments/hooks/use-confirm";
import { StaffRole } from "../types";
import { DottedSeparator } from "@/components/dotted-seprator";
import { useGetStaff } from "../api/use-get-staff";
import { useDeleteStaff } from "../api/use-delete-staff";
import { useUpdateStaff } from "../api/use-update-staff";
import { useDepartmentId } from "@/features/departments/hooks/use-department-id";
import { StaffAvatar } from "./staff-avatar";



export const StaffList = () => {
  const departmentId = useDepartmentId();
  const { data } = useGetStaff({ departmentId });

  const [ConfirmDialog, confirm] = useConfirm(
    "Remove Member",
    "This member will be removed from the workspace",
    "destructive"
  );

  const { mutate: deleteStaff, isPending: deletingStaff } = useDeleteStaff();
  const { mutate: updateStaff, isPending: updatingStaff } = useUpdateStaff();

  const handleUpdateStaff = (staffId: string, role: StaffRole) => {
    updateStaff({ param: { staffId }, json: { role } });
  };

  const handleDeleteStaff = async (staffId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteStaff(
      { param: { staffId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${departmentId}`}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Staff List</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((staff, index) => (
          <Fragment key={staff.$id}>
            <div className="flex items-center gap-2">
              <StaffAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={staff.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{staff.name}</p>
                <p className="text-xs font-medium">{staff.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVertical className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdateStaff(staff.$id, StaffRole.ADMIN)
                    }
                    disabled={updatingStaff}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() =>
                      handleUpdateStaff(staff.$id, StaffRole.STAFF)
                    }
                    disabled={updatingStaff}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeleteStaff(staff.$id)}
                    disabled={deletingStaff}
                  >
                    Remove {staff.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2.5 bg-neutral-400/40" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};