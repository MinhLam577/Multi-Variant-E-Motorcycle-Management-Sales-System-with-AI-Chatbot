"use client";
import { formatDate } from "@/src/lib/utils";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const Blog = () => {
    const store = useStore();
    const blogStore = store.blogsObservable;

    useEffect(() => {
        blogStore.getListBlog({
            ...blogStore.pagination,
        });
    }, []);
    return (
        <>
            {blogStore.data &&
                blogStore.data.slice(0, 3).map((post) => (
                    <div
                        key={post.id}
                        className="col-md-6 col-xl-4"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        <div className="for_blog">
                            <div className="thumb">
                                <div className="tag">{"BLOG"}</div>
                                <Image
                                    width={394}
                                    height={254}
                                    style={{ objectFit: "cover" }}
                                    className="img-whp h-72"
                                    src={post?.thumbnail}
                                    alt={post.title}
                                />
                            </div>
                            <div className="details">
                                <div className="wrapper">
                                    <div className="bp_meta">
                                        <ul>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <span className="flaticon-user" />
                                                    {"admin"}
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <span className="flaticon-chat" />
                                                    {0} Comments
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <span className="flaticon-calendar-1" />
                                                    {formatDate(post.createdAt)}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <h4 className="text-base font-bold min-h-[3rem] !flex justify-start items-center text-black">
                                        <Link href={`/blog-single/${post.id}`}>
                                            <span className="line-clamp-1">
                                                {post.title}
                                            </span>
                                        </Link>
                                    </h4>
                                    <Link
                                        href="/blog-single"
                                        className="more_listing"
                                    >
                                        Xem thêm{" "}
                                        <span className="icon">
                                            <span className="fas fa-plus" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
        </>
    );
};

export default observer(Blog);
