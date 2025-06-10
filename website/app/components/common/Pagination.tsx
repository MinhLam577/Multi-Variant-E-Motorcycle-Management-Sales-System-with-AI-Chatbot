// "use client";
// import { useState } from "react";

// const Pagination = () => {
//   const [currentPage, setCurrentPage] = useState(2);
//   const totalPages = 3;
//   const pages = [];

//   const handleClick = (page) => {
//     setCurrentPage(page);
//   };

//   for (let i = 1; i <= totalPages; i++) {
//     pages.push(
//       <li
//         role="button"
//         key={i}
//         className={`page-item ${i === currentPage ? "active" : ""}`}
//         onClick={() => handleClick(i)}
//       >
//         <span className="page-link">{i}</span>
//       </li>
//     );
//   }

//   return (
//     <ul className="page_navigation">
//       <li role="button" className="page-item">
//         <span className="page-link">
//           <span className="fa fa-arrow-left" />
//         </span>
//       </li>
//       {pages}
//       <li role="button" className="page-item">
//         <span className="page-link">
//           <span className="fa fa-arrow-right" />
//         </span>
//       </li>
//     </ul>
//   );
// };

// export default Pagination;

import classNames from "classnames";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // Nếu cần lấy query hiện tạ
// import path from "src/constants/path";

const RANGE = 2;
export default function Pagination({ queryObject }) {
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
                    <Link
                        href={{
                            pathname: "/listing-v1",
                            query: {
                                ...queryObject,
                                current: pageNumber.toString(),
                            },
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
                    </Link>
                );
            });
    };
    return (
        <div className="mt-6 flex flex-wrap justify-center">
            {page === 1 ? (
                <span className="mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm">
                    Prev
                </span>
            ) : (
                <Link
                    href={{
                        pathname: "/listing-v1",
                        query: {
                            ...queryObject,
                            current: (page - 1).toString(),
                        },
                    }}
                    className="mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm"
                >
                    Prev
                </Link>
            )}

            {renderPagination()}
            {page === pageSize ? (
                <span className="mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm">
                    Next
                </span>
            ) : (
                <Link
                    href={{
                        pathname: "/listing-v1",
                        query: {
                            ...queryObject,
                            current: (page + 1).toString(),
                        },
                    }}
                    className="mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm"
                >
                    Next
                </Link>
            )}
        </div>
    );
}
