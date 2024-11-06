import { useQueryState , parseAsBoolean} from 'nuqs'


export const useCreatePatientModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-patient",
        parseAsBoolean.withDefault(false).withOptions({clearOnDefault: true})
    )

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return {
        isOpen,
        open,
        close,
        setIsOpen
        
    };
}