import { cn } from "@/src/lib/utils";

type ButtonProps = React.ComponentProps<"button"> & {
    // custom props here
    isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
    children,
    className,
    isLoading = false,
    ...props
}) => {
    return (
        <button
            className={cn(
                // base styles
                "border-none outline-none py-[.625rem] px-2 bg-transparent flex items-center justify-center cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
