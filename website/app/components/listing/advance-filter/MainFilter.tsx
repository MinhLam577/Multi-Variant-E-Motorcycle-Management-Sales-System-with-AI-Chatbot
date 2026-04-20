"use client";
import { useStore } from "@/context/store.context";
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
        queryObject,
    }: {
        handleFilterChange: Dispatch<SetStateAction<globalFilterType>>;
        queryObject: globalFilterType;
    }) => {
        const store = useStore();
        const StoreBrand = store.brandObservable;
        const [selectedBrand, setSelectedBrand] = useState("");
        const [search, setSearch] = useState("");
        const [priceMin, setPriceMin] = useState<string | number | undefined>(
            queryObject.price_min || ""
        );
        const [priceMax, setPriceMax] = useState<string | number | undefined>(
            queryObject.price_max || ""
        );
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
            await StoreBrand.getListBrand({ page: 1, size: 1000 });
        };

        useEffect(() => {
            if (queryObject.brandID) {
                setSelectedBrand(queryObject.brandID);
            } else {
                setSelectedBrand("");
            }
            if (queryObject.search) {
                setSearch(queryObject.search);
            } else {
                setSearch("");
            }
            if (queryObject.price_min) {
                setPriceMin(queryObject.price_min);
            } else {
                setPriceMin("");
            }
            if (queryObject.price_max) {
                setPriceMax(queryObject.price_max);
            } else {
                setPriceMax("");
            }
        }, [queryObject]);

        return (
            <>
                {/* <div className="col-12 col-sm-4 col-lg-4">
                    <div className="w-full advance_search_style">
                        <input
                            className="h-9 bg-[#fff] text-sm text-[#555] border border-[#ccc] border-solid outline-none px-3 rounded-md w-full"
                            value={search || ""}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debounceInputChange(e.target.value, "search");
                            }}
                            placeholder="Nhập từ khóa"
                        />
                    </div>
                </div> */}
                {/* Price min and Price max */}

                <div className="col-12 col-sm-4 col-lg-2">
                    <div className="advance_search_style">
                        <input
                            type="number"
                            className="form-control !text-sm !h-9"
                            placeholder="Giá tối thiểu"
                            value={priceMin || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPriceMin(value);
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
                            value={priceMax || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPriceMax(value);
                                debounceInputChange(value, "price_max");
                            }}
                        />
                    </div>
                </div>

                {/* Thương hiệu */}
                {/* <div className="col-12 col-sm-4 col-lg-2">
                    <div className="advance_search_style">
                        <select
                            className="form-select show-tick !h-9"
                            value={queryObject.brandID || ""}
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
                </div> */}
            </>
        );
    }
);

export default MainFilter;
