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
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <span className="flaticon-chat" />
                  {post.numComments} Comments
                </span>
                <span className="flex items-center gap-1">
                  <span className="flaticon-calendar-1" />
                  {post.createdAt}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                <Link href={`/blog-single/${post.id}`}>{post.title}</Link>
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
// <div className="tag">{post.tag}</div>
