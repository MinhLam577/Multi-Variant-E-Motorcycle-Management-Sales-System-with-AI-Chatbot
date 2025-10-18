import { cn } from "@/src/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
    return (
        <input
            className={cn(
                "py-[0.25rem] px-[2.5rem] w-full text-neutral-900 outline-none border-none text-start placeholder-neutral-400 bg-transparent",
                className
            )}
            {...props}
        />
    );
};

export default Input;
