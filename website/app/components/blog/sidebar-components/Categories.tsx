"use client";

import { useStore } from "@/context/store.context";
import { Skeleton } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const Categories = observer(() => {
    const store = useStore();
    const blogCategoriesStore = store.blogCategoryObservable;
    const blogStore = store.blogsObservable;
    useEffect(() => {
        blogCategoriesStore.getListBlogCategories({
            ...blogCategoriesStore.globalFilter,
            ...blogCategoriesStore.pagination,
        });
    }, []);

    return (
        <Skeleton
            active
            loading={blogCategoriesStore.loading}
            paragraph={{ rows: 3, width: "100%" }}
        >
            <ul className="list_details">
                <li
                    className="cursor-pointer"
                    onClick={() => {
                        blogStore.setGlobalFilter({
                            ...blogStore.globalFilter,
                            blog_category_id: undefined,
                        });
                    }}
                >
                    <a href="#all">Tất cả</a>
                </li>
                {blogCategoriesStore.data &&
                    blogCategoriesStore.data.map((category) => (
                        <li
                            key={category.id}
                            className="cursor-pointer"
                            onClick={() => {
                                blogStore.setGlobalFilter({
                                    ...blogStore.globalFilter,
                                    blog_category_id: category.id,
                                });
                            }}
                        >
                            <a
                                href={`#${category.name
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                            >
                                {category.name}
                            </a>
                        </li>
                    ))}
            </ul>
        </Skeleton>
    );
});

export default Categories;
