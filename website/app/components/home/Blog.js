"use client";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const Blog = observer(() => {
    // blog-single/ad010575-0ec2-46b7-8357-936952659985
    const store = useStore();
    const storeBlog = store.blogsObservable;
    useEffect(() => {
        fetchBlogList();
    }, []);
    const fetchBlogList = async () => {
        await storeBlog.getListBlog();
    };
    // .slice(0, 3)
    return (
        <>
            {storeBlog?.data?.slice(0, 3).map((post) => (
                <div
                    key={post.id}
                    className="col-md-6 col-xl-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <Link href={`/blog-single/${post.id}`}>
                        <div className="for_blog">
                            <div className="relative w-full thumb cursor-pointer">
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded z-10">
                                    tag
                                </div>

                                <Image
                                    width={394}
                                    height={254}
                                    className="w-full h-[254px] object-cover rounded-lg"
                                    src={post.thumbnail}
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
                                                    author-name
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <span className="flaticon-chat" />
                                                    {10} Bình luận
                                                </a>
                                            </li>

                                            <li className="list-inline-item">
                                                <a href="#">
                                                    <span className="flaticon-calendar-1" />
                                                    {Date.now()}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <h4 className="title line-clamp-2 min-h-[3.5rem]">
                                        <Link href={`/blog-single/${post.id}`}>
                                            {post.title}
                                        </Link>
                                    </h4>

                                    <Link
                                        href="/blog-single"
                                        className="more_listing"
                                    >
                                        Xem thêm
                                        <span className="icon">
                                            <span className="fas fa-plus" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </>
    );
});

export default Blog;
