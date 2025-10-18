"use client";
import { ChangeEvent, useState } from "react";
import { SearchNormal, CloseCircle } from "iconsax-reactjs";
import Button from "./atoms/Button";
import Input from "./atoms/Input";
const SearchBox = () => {
    const [searchText, setSearchText] = useState("");
    return (
        <div className="relative flex justify-center items-center text-neutral-600 bg-white w-full rounded-md">
            <Button
                variant={null}
                size={null}
                className="hover:text-blue-600 focus:text-blue-600 absolute left-0 top-0 h-[2.5rem] py-[.25rem]
                px-[.625rem] text-neutral-600"
            >
                <SearchNormal size="20" color="currentColor" />
            </Button>
            <Input
                className="h-[2.5rem]"
                placeholder="Bạn đang tìm gì hôm nay..."
                value={searchText}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchText(e.target.value)
                }
            />
            {searchText && (
                <Button
                    variant={null}
                    size={null}
                    className="hover:text-blue-600 focus:text-blue-600 absolute right-0 top-0 text-neutral-700"
                >
                    <CloseCircle
                        size="18"
                        color="currentColor"
                        onClick={() => {
                            setSearchText("");
                        }}
                    />
                </Button>
            )}
        </div>
    );
};

export default SearchBox;
