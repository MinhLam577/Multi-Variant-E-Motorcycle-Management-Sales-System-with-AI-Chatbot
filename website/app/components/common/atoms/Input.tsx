import { cn } from "@/src/lib/utils";
import { forwardRef } from "react";

// Bước 1: Thêm forwardRef và ref vào props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref} // Đây là dòng quan trọng!
                className={cn(
                    "py-[0.25rem] px-[2.5rem] w-full text-neutral-900 outline-none border-none text-start placeholder-neutral-400 bg-transparent",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export default Input;
