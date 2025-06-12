import { paginationData } from "@/src/stores/order.store";
import { globalFilterType } from "@/src/stores/productStore";
import classNames from "classnames";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

const RANGE = 2;

export interface PaginationProps {
    setQueryObject: Dispatch<SetStateAction<globalFilterType>>;
    queryObject: globalFilterType & paginationData;
}
const Pagination: React.FC<PaginationProps> = ({
    setQueryObject,
    queryObject,
}) => {
    const page = Number(queryObject.current) || 1;
    const pageSize = Number(queryObject.pageSize) || 10;

    const renderPagination = () => {
        let dotAfter = false;
        let dotBefore = false;
        const renderDotBefore = (index: number) => {
            if (!dotBefore) {
                dotBefore = true;
                return (
                    <span
                        key={index}
                        className="mx-2 rounded border bg-white px-3 py-2 shadow-sm"
                    >
                        ...
                    </span>
                );
            }
            return null;
        };
        const renderDotAfter = (index: number) => {
            if (!dotAfter) {
                dotAfter = true;
                return (
                    <span
                        key={index}
                        className="mx-2 rounded border bg-white px-3 py-2 shadow-sm"
                    >
                        ...
                    </span>
                );
            }
            return null;
        };
        return Array(pageSize)
            .fill(0)
            .map((_, index) => {
                const pageNumber = index + 1;
                // Điều kiện để return về ...
                if (
                    page <= RANGE * 2 + 1 &&
                    pageNumber > page + RANGE &&
                    pageNumber < pageSize - RANGE + 1
                ) {
                    return renderDotAfter(index);
                } else if (
                    page > RANGE * 2 + 1 &&
                    page < pageSize - RANGE * 2
                ) {
                    if (pageNumber < page - RANGE && pageNumber > RANGE) {
                        return renderDotBefore(index);
                    } else if (
                        pageNumber > page + RANGE &&
                        pageNumber < pageSize - RANGE + 1
                    ) {
                        return renderDotAfter(index);
                    }
                } else if (
                    page >= pageSize - RANGE * 2 &&
                    pageNumber > RANGE &&
                    pageNumber < page - RANGE
                ) {
                    return renderDotBefore(index);
                }

                return (
                    <button
                        onClick={() => {
                            setQueryObject((prev) => ({
                                ...prev,
                                current: pageNumber.toString(),
                                pageSize: pageSize.toString(),
                            }));
                        }}
                        key={index}
                        className={classNames(
                            "mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm",
                            {
                                "border-cyan-500": pageNumber === page,
                                "border-transparent": pageNumber !== page,
                            }
                        )}
                    >
                        {pageNumber}
                    </button>
                );
            });
    };
    return (
        <div className="mt-6 flex flex-wrap justify-center">
            {page === 1 ? (
                <span className="mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm">
                    Prev
                </span>
            ) : (
                <button
                    onClick={() => {
                        setQueryObject((prev) => ({
                            ...prev,
                            current: (page - 1).toString(),
                        }));
                    }}
                    className="mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm"
                >
                    Prev
                </button>
            )}

            {renderPagination()}
            {page === pageSize ? (
                <span className="mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm">
                    Next
                </span>
            ) : (
                <button
                    onClick={() => {
                        setQueryObject((prev) => ({
                            ...prev,
                            current: (page + 1).toString(),
                        }));
                    }}
                    className="mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm"
                >
                    Next
                </button>
            )}
        </div>
    );
};

export default Pagination;
