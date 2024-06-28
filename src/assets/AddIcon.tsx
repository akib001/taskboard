type AddIconProps = {
    className?: string;
};

const AddIcon = ({ className }: AddIconProps) => {
    return (
        <svg
            className={className}
            focusable="false"
            viewBox="0 0 24 24"
            aria-hidden="true"
            width="1em"
            height="1em"
            display="inline-block"
            fontSize="1.5rem"
        >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
        </svg>
    );
};

export default AddIcon;
