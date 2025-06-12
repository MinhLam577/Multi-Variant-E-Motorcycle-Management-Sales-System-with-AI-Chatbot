"use client";
import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import { debounce } from "lodash";
import { globalFilterType } from "@/src/stores/productStore";
const MainFilter = observer(
    ({
        handleFilterChange,
    }: {
        handleFilterChange: Dispatch<SetStateAction<globalFilterType>>;
    }) => {
        const store = useStore();
        const StoreBrand = store.brandObservable;
        const [selectedBrand, setSelectedBrand] = useState("");
        const [search, setSearch] = useState("");
        const debounceInputChange: (
            value: string,
            field: "search" | "brandID" | "price_min" | "price_max"
        ) => void = useCallback(
            debounce(
                (
                    value: string | number | undefined,
                    field: "search" | "brandID" | "price_min" | "price_max"
                ) => {
                    handleFilterChange((prev) => ({
                        ...prev,
                        [field]: value,
                    }));
                },
                400
            ),
            []
        );
        useEffect(() => {
            handleData();
        }, []);
        const handleData = async () => {
            await StoreBrand.getListBrand({ page: 1, size: 10 });
        };
        return (
            <>
                <div className="col-12 col-sm-4 col-lg-4">
                    <div className="w-full advance_search_style">
                        <input
                            className="h-9 bg-[#fff] text-sm text-[#555] border border-[#ccc] border-solid outline-none px-3 rounded-md w-full"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debounceInputChange(e.target.value, "search");
                            }}
                            placeholder="Nhập từ khóa"
                        />
                    </div>
                </div>
                {/* Price min and Price max */}

                <div className="col-12 col-sm-4 col-lg-2">
                    <div className="advance_search_style">
                        <input
                            type="number"
                            className="form-control !text-sm !h-9"
                            placeholder="Giá tối thiểu"
                            onChange={(e) => {
                                const value = e.target.value;
                                debounceInputChange(value, "price_min");
                            }}
                        />
                    </div>
                </div>
                <div className="col-12 col-sm-4 col-lg-2">
                    <div className="advance_search_style !text-sm">
                        <input
                            type="number"
                            className="form-control !text-sm !h-9"
                            placeholder="Giá tối đa"
                            onChange={(e) => {
                                const value = e.target.value;
                                debounceInputChange(value, "price_max");
                            }}
                        />
                    </div>
                </div>

                {/* Thương hiệu */}
                <div className="col-12 col-sm-4 col-lg-2">
                    <div className="advance_search_style">
                        <select
                            className="form-select show-tick !h-9"
                            value={selectedBrand}
                            onChange={(e) => {
                                setSelectedBrand(e.target.value);
                                debounceInputChange(e.target.value, "brandID");
                            }}
                        >
                            <option value="">Tất cả thương hiệu</option>
                            {StoreBrand?.listBrand.map((value) => (
                                <option key={value.id} value={value.id}>
                                    {value.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </>
        );
    }
);

export default MainFilter;
