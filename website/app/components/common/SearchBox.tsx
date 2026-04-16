"use client";
import { ChangeEvent, forwardRef, KeyboardEvent, useState } from "react";
import { SearchNormal, CloseCircle, SearchNormal1 } from "iconsax-reactjs";
import Button from "./atoms/Button";
import Input from "./atoms/Input";
import { cn } from "@/src/lib/utils";

export interface SearchBoxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    buttonClassName?: string;
    inputClassName?: string;
    clearButtonClassName?: string;
    onSearch?: (value: string) => void;
    onClear?: () => void;
}

const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
    (
        {
            className,
            wrapperClassName,
            buttonClassName,
            inputClassName,
            clearButtonClassName,
            placeholder = "Bạn đang tìm gì hôm nay...",
            value: controlledValue,
            defaultValue,
            onChange,
            onSearch,
            onClear,
            onKeyDown,
            ...inputProps
        },
        ref
    ) => {
        // Hỗ trợ cả controlled và uncontrolled
        const [internalValue, setInternalValue] = useState(
            defaultValue?.toString() ?? ""
        );

        const isControlled = controlledValue !== undefined;
        const value = isControlled ? controlledValue : internalValue;

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            if (!isControlled) {
                setInternalValue(newValue);
            }
            onChange?.(e);
        };

        const handleClear = () => {
            if (!isControlled) {
                setInternalValue("");
            }
            onClear?.();
            // Focus lại input sau khi clear (UX tốt hơn)
            const inputEl = (ref as React.RefObject<HTMLInputElement>)?.current;
            inputEl?.focus();
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter" && onSearch) {
                onSearch(value?.toString() ?? "");
            }
            if (e.key === "Escape") {
                handleClear();
            }
            onKeyDown?.(e);
        };

        const hasValue = value && value.toString().length > 0;

        return (
            <div
                className={cn(
                    "relative flex items-center w-full bg-white rounded-md border border-neutral-200 focus-within:border-blue-500 transition-colors",
                    wrapperClassName
                )}
            >
                <Button
                    type="button"
                    className={cn(
                        "absolute left-1 h-8 w-8 text-neutral-500 hover:text-neutral-700",
                        buttonClassName
                    )}
                    aria-label="Tìm kiếm"
                >
                    <SearchNormal1 size={20} className="text-current" />
                </Button>

                <Input
                    ref={ref}
                    type="text"
                    placeholder={placeholder}
                    value={value ?? ""}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "h-10 pl-10 pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                        inputClassName
                    )}
                    {...inputProps}
                />

                {hasValue && (
                    <Button
                        type="button"
                        onClick={handleClear}
                        className={cn(
                            "absolute right-1 h-8 w-8 text-neutral-500 hover:text-neutral-700",
                            clearButtonClassName
                        )}
                        aria-label="Xóa tìm kiếm"
                    >
                        <CloseCircle size={18} className="text-current" />
                    </Button>
                )}
            </div>
        );
    }
);

SearchBox.displayName = "SearchBox";

export default SearchBox;
