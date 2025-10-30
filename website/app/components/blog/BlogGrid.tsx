"use client";
import blogPosts from "@/data/blog";
import { useStore } from "@/context/store.context";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const BlogGrid = observer(() => {
    const store = useStore();
    const storeBlog = store.blogsObservable;
    useEffect(() => {
        fetchBlogList();
    }, []);
    const fetchBlogList = () => {
        storeBlog.getListBlog();
    };
    return (
        <>
            {storeBlog?.data?.map((post) => (
                <div
                    key={post.id}
                    className="col-md-6 col-xl-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    <div className="for_blog">
                        <div className="thumb">
                            <Image
                                width={394}
                                height={254}
                                style={{ objectFit: "cover" }}
                                className="img-whp"
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
                                                {"author"}
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <span className="flaticon-chat" />
                                                {1} Comments
                                            </a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#">
                                                <span className="flaticon-calendar-1" />
                                                {new Date().toLocaleDateString(
                                                    "vi-VN"
                                                )}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <h4 className="title">
                                    <Link href="/blog-single">
                                        {post.title}
                                    </Link>
                                </h4>
                                <Link
                                    href="/blog-single"
                                    className="more_listing"
                                >
                                    Read More{" "}
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
});

export default BlogGrid;
