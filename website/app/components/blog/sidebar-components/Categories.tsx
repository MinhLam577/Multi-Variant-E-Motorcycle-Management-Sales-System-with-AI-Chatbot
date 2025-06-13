"use client";

import { useStore } from "@/src/stores";
import { useEffect } from "react";

const Categories = () => {
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
    );
};

export default Categories;
