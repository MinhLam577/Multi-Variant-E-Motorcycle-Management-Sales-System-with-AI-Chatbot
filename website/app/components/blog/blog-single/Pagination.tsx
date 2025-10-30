"use client";

import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";

const Pagination = () => {
    const pages = [
        {
            label: "Bài viết trước",
            className: "pag_prev",
            iconClassName: "fa fa-angle-left mr5",
        },
        {
            label: "Bài viết sau",
            className: "pag_next text-end",
            iconClassName: "fa fa-angle-right ml5",
        },
    ];

    const store = useStore();
    const blogStore = store.blogsObservable;

    return (
        <div className="mbp_pagination_tab">
            <div className="row">
                {pages.map((page, index) => (
                    <div className="col-6 col-sm-6 col-lg-6" key={index}>
                        <div className={page.className}>
                            <div className="detls">
                                <h5 className="!text-base">
                                    {page.label === "Bài viết trước" ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const prevBlog =
                                                    blogStore.PrevDataById;
                                                if (prevBlog) {
                                                    window.location.href = `/blog-single/${prevBlog.id}`;
                                                }
                                            }}
                                        >
                                            <span
                                                className={page.iconClassName}
                                            />
                                            {page.label}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const nextBlog =
                                                    blogStore.NextDataById;
                                                if (nextBlog) {
                                                    window.location.href = `/blog-single/${nextBlog.id}`;
                                                }
                                            }}
                                        >
                                            {page.label}
                                            <span
                                                className={page.iconClassName}
                                            />
                                        </button>
                                    )}{" "}
                                </h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default observer(Pagination);
