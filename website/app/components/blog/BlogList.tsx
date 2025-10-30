"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import { reaction } from "mobx";
import { globalFilterBlogData } from "@/src/stores/blog";
import { paginationData } from "@/src/stores/order.store";
import { filterEmptyFields } from "@/utils";
import { formatDate } from "@/src/lib/utils";
const BlogList = observer(() => {
    const store = useStore();
    const blogStore = store.blogsObservable;
    const blogCategoryStore = store.blogCategoryObservable;
    const scrollToTop = () => {
        window.scrollTo({
            top: 350,
            behavior: "smooth",
        });
    };
    const updateUrl = (newParams: globalFilterBlogData & paginationData) => {
        // Lấy các tham số hiện tại từ URL
        const newQueryParams = new URLSearchParams(
            Object.entries(newParams).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        );
        window.history.replaceState(null, "", `?${newQueryParams.toString()}`);
    };

    useEffect(() => {
        blogCategoryStore.getListBlogCategories();
    }, []);

    useEffect(() => {
        const reactionBlog = reaction(
            () => ({
                ...blogStore.globalFilter,
                ...blogStore.pagination,
            }),
            (filter) => {
                // Cập nhật URL với các tham số mới
                updateUrl(
                    filterEmptyFields({
                        ...filter,
                    })
                );
                const query = {
                    ...filter,
                };
                blogStore.getListBlog(query);
                scrollToTop();
            },
            {
                fireImmediately: true,
            }
        );
        return () => {
            reactionBlog();
        };
    }, []);
    return (
        <>
            {blogStore?.data?.map((post) => (
                <div
                    key={post.id}
                    className="flex flex-col md:flex-row gap-4 mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                    {/* Thumbnail */}
                    <div className="md:w-[30%] w-full h-[200px] md:h-auto relative">
                        <Image
                            src={post.thumbnail}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between p-4 md:w-[70%] w-full">
                        <div>
                            {/* Meta info */}
                            <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 mb-2">
                                <span className="flex items-center gap-1">
                                    <span className="flaticon-user" />
                                    {"admin"}
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="flaticon-chat" />
                                    {20} Comments
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="flaticon-calendar-1" />
                                    {formatDate(post.createdAt)}
                                </span>
                            </div>

                            {/* Title */}
                            <h4 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                                <Link href={`/blog-single/${post.id}`}>
                                    {post.title}
                                </Link>
                            </h4>
                        </div>

                        {/* Read more */}
                        <Link
                            href={`/blog-single/${post.id}`}
                            className="text-blue-600 text-sm font-medium mt-3 inline-flex items-center hover:underline"
                        >
                            Read More
                            <span className="ml-1 fas fa-plus" />
                        </Link>
                    </div>
                </div>
            ))}
        </>
    );
});

export default BlogList;
