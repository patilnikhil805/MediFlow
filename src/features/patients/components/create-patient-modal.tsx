'use client'

import { ResponsiveModal } from "@/components/responsive-modal";


import { useCreatePatientModal } from "../hooks/use-create-patient-modal";
import { CreatePatientForm } from "./create-patient-form";

export const CreatePatientModal = () => {

    const { isOpen, setIsOpen, close} = useCreatePatientModal();

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreatePatientForm onCancel={close} />
        </ResponsiveModal>
    )
}