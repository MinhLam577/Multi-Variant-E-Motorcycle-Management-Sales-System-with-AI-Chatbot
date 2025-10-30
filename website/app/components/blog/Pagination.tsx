"use client";
import { useStore } from "@/context/store.context";
import classNames from "classnames";
import { useState } from "react";
const RANGE = 2;
const Pagination = () => {
    const store = useStore();
    const blogStore = store.blogsObservable;
    const { current, pageSize } = blogStore.pagination;
    const page = current;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10;
    const pages = [];

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
                            blogStore.setPagination(pageNumber, pageSize);
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

    const handleClick = (page) => {
        setCurrentPage(page);
    };

    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <li
                role="button"
                key={i}
                className={`page-item ${i === currentPage ? "active" : ""}`}
                onClick={() => handleClick(i)}
            >
                <span className="page-link">{i}</span>
            </li>
        );
    }

    return (
        // <ul className="page_navigation">
        //     <li role="button" className="page-item">
        //         <span className="page-link">
        //             <span className="fa fa-arrow-left" />
        //         </span>
        //     </li>
        //     {pages}
        //     <li role="button" className="page-item">
        //         <span className="page-link">
        //             <span className="fa fa-arrow-right" />
        //         </span>
        //     </li>
        // </ul>
        <div className="mt-6 flex flex-wrap justify-center">
            {page === 1 ? (
                <span className="mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2 shadow-sm">
                    Prev
                </span>
            ) : (
                <button
                    onClick={() => {
                        blogStore.setPagination(current - 1, pageSize);
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
                        blogStore.setPagination(current - 1, pageSize);
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
