"use client";
import blogPosts from "@/data/blog";
import apiClient from "@/src/api/apiClient";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { getListBlog } from "../../../src/api/blog";
import { useStore } from "@/src/stores";
import { observer } from "mobx-react-lite";
const BlogList = observer(() => {
  // useEffect(() => {
  //   console.log("oki");
  //   const fetchBlogList = async () => {
  //     const data = await getListBlog();
  //     console.log(data);
  //   };
  //   fetchBlogList();
  // }, []);

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
        <div key={post.id} className="main_blog_post_content">
          <div className="for_blog list-type">
            <div className="thumb w-[30%]">
              <Image
                width={394}
                height={251}
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
                        {post.author}
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-chat" />
                        {post.numComments} Comments
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-calendar-1" />
                        {post.createdAt}
                      </a>
                    </li>
                  </ul>
                </div>
                <h4 className="title">
                  <Link href={`/blog-single/${post.id}`}>{post.title}</Link>
                </h4>
                <Link href={`/blog-single/${post.id}`} className="more_listing">
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

export default BlogList;
// <div className="tag">{post.tag}</div>
