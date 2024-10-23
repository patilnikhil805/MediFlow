import { useQueryState , parseAsBoolean} from 'nuqs'


export const useCreateDepartmentModal = () => {
    const [isOpen, setIsOpen] = useQueryState(
        "create-department",
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