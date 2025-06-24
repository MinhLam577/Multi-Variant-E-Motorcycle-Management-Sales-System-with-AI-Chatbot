"use client";
import { Dispatch, SetStateAction } from "react";
import MainFilter from "./MainFilter";
import { globalFilterType } from "@/src/stores/productStore";
export interface IAdvanceFilterProps {
    handleFilterChange: Dispatch<SetStateAction<globalFilterType>>;
    handleClearAllFilters: () => void;
    queryObject: globalFilterType;
}
const AdvanceFilter: React.FC<IAdvanceFilterProps> = ({
    handleFilterChange,
    handleClearAllFilters,
    queryObject,
}) => {
    const handleDeleteAll = () => {
        handleClearAllFilters();
    };

    return (
        <>
            <div className="row">
                <MainFilter
                    handleFilterChange={handleFilterChange}
                    queryObject={queryObject}
                />
                {/*search */}
                <div className="col col-sm-4 col-lg-2">
                    <div className="advance_search_style">
                        <button
                            className="btn !h-9 flex items-center justify-center text-sm bg-[rgb(255,77,79,0.7)] border-none text-white hover:!bg-[rgb(255,77,79,0.8)] hover:text-white rounded-md"
                            onClick={() => handleDeleteAll()}
                        >
                            Xóa tất cả
                        </button>
                    </div>
                </div>
                {/* End .col */}
            </div>
            {/* End .row */}
        </>
    );
};

export default AdvanceFilter;
