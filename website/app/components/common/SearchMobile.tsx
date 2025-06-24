"use client";

import {
    EnumProductStore,
    EnumProductStoreLabel,
} from "@/src/stores/productStore";
import { SelectOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "@/public/css/search-mobile.css";
const SearchMobile = observer(() => {
    const router = useRouter();
    const [selectValue, setSelectValue] = useState(EnumProductStore.CAR);
    const handleSearch = (value: string) => {
        if (value.trim() === "") {
            return;
        }
        const encodedValue = encodeURIComponent(`${value.trim()}`);
        const queryString = `search=${encodedValue}&type=${selectValue}`;
        router.push(`/listing-v1?${queryString}`);
    };

    const getSelectData = () => {
        return Object.keys(EnumProductStoreLabel).map((key) => {
            const value =
                EnumProductStore[key as keyof typeof EnumProductStoreLabel];
            const label =
                EnumProductStoreLabel[
                    key as keyof typeof EnumProductStoreLabel
                ].toLowerCase();
            return {
                value: value,
                label: label.charAt(0).toUpperCase() + label.slice(1),
            };
        });
    };
    return (
        <section className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 mt-28 lg:mt-0 lg:hidden !bg-[var(--primary-bike)] search-mobile flex-col sm:flex-row gap-4 sm:!gap-0">
            <Input
                type="search"
                id="search"
                placeholder="Search..."
                className="w-full px-3 py-2 text-gray-700 border focus:outline-none grow"
                allowClear
                suffix={
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<i className="fas fa-search"></i>}
                        className="!bg-[var(--primary-bike)] !border-0 !text-white"
                        onClick={() => {
                            const inputElement = document.getElementById(
                                "search"
                            ) as HTMLInputElement;
                            if (inputElement) {
                                handleSearch(inputElement.value);
                            }
                        }}
                    />
                }
                onPressEnter={(e) => {
                    const inputValue = (e.target as HTMLInputElement).value;
                    handleSearch(inputValue);
                }}
            />
            <Select
                defaultValue={getSelectData()[0].value}
                className="!w-32 !border-0 !text-white !h-12 !bg-transparent !border-none focus:!border-none focus:!outline-none !rounded-none hidden sm:block"
                options={getSelectData().map((item) => ({
                    value: item.value,
                    label: item.label,
                }))}
                onChange={(value) => {
                    setSelectValue(value);
                }}
            />
            <div className="flex items-center gap-2 overflow-x-auto !scrollbar-hide !w-full sm:hidden search-mobile-select">
                {getSelectData().map((item) => (
                    <span
                        key={item.value}
                        className={`!cursor-pointer !text-black !bg-[var(--primary-bike)] !rounded-full !bg-white !text-sm px-2 py-1 ${
                            selectValue === item.value ? "active" : ""
                        }`}
                        onClick={() => {
                            setSelectValue(item.value);
                        }}
                    >
                        <SelectOutlined className="mr-1" />
                        {item.label}
                    </span>
                ))}
            </div>
        </section>
    );
});

export default SearchMobile;
