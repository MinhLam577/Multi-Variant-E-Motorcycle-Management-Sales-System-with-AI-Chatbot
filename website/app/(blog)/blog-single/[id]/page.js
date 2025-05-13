// "use client";
// import { useParams } from "next/navigation";

// export default function BlogDetail() {
//   const { id } = useParams();

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">Chi tiết Blog</h1>
//       <p>ID bài viết: {id}</p>
//     </div>
//   );
// }
"use client";
import Footer from "@/app/components/common/Footer";
import DefaultHeader from "@/app/components/common/DefaultHeader";
import HeaderSidebar from "@/app/components/common/HeaderSidebar";
import HeaderTop from "@/app/components/common/HeaderTop";
import MobileMenu from "@/app/components/common/MobileMenu";
import LoginSignupModal from "@/app/components/common/login-signup";
import Image from "next/image";
import Blog from "@/app/components/common/Blog";
import Meta from "@/app/components/blog/blog-single/Meta";
import Blockquote from "@/app/components/blog/blog-single/Blockquote";
import Features from "@/app/components/blog/blog-single/Features";
import Requirements from "@/app/components/blog/blog-single/Requirements";
import Share from "@/app/components/blog/blog-single/Share";
import Tag from "@/app/components/blog/blog-single/Tag";
import Pagination from "@/app/components/blog/blog-single/Pagination";
import Comments from "@/app/components/blog/blog-single/Comments";
import CommentForm from "@/app/components/blog/blog-single/CommentForm";
import { useParams } from "next/navigation";
import { useStore } from "@/src/stores";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { getBlogDetails } from "@/src/api/blog";

// const metadata = {
//   title: "Ô Tô Hồng Sơn || Chuyên mua bán và trao đổi xe ô tô uy tín",
// };

const BlogDynamicSingle = observer(() => {
  const { id } = useParams();
  const store = useStore();
  const storeBlog = store.blogsObservable;
  const [data, setData] = useState(null);
  useEffect(() => {
    if (id) {
      // storeBlog.getListBlogById(id); // Gọi API
      const fetchData = async () => {
        const data = await getBlogDetails(id);
        console.log(data);
        setData(data.data);
      };
      fetchData();
    }
  }, [id]);
  return (
    <div className="wrapper">
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <HeaderSidebar />
      </div>
      {/* Sidebar Panel End */}

      {/* header top */}
      <HeaderTop />
      {/* End header top */}

      {/* Main Header Nav */}
      <DefaultHeader />
      {/* End Main Header Nav */}

      {/* Main Header Nav For Mobile */}
      <MobileMenu />
      {/* End Main Header Nav For Mobile */}

      {/* Blog Single Post */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <article className="space-y-6">
            <header className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                {data?.title}
              </h1>
              <Meta />
            </header>

            {/* Optional banner image or spacing */}
            <div className="w-full h-[1px] bg-gray-200 my-6"></div>
          </article>
        </div>
      </section>

      <section className="py-16 bg-[#f3f4f6]">
        {" "}
        {/* nền tổng thể */}
        <div className="max-w-3xl mx-auto px-4">
          <article className=" md:p-10">
            {" "}
            {/* hoặc bỏ hẳn bg nếu muốn */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mô tả</h2>
            <div
              className="prose prose-lg max-w-none prose-img:rounded-xl prose-img:shadow-sm"
              dangerouslySetInnerHTML={{ __html: data?.content }}
            />
            <div className="my-10 border-t "></div>
            <Pagination />
            <div className="mt-10 border-t "></div>
          </article>
        </div>
      </section>

      {/* End Blog Single Post Description */}

      {/* Our Blog Recent Articles */}
      <section className="our-blog pb90 bgc-f9">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="main-title text-center">
                <h2>Bài viết gần đây</h2>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row">
            <Blog />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Our Blog Recent Articles */}

      {/* Our Footer */}
      <Footer />
      {/* End Our Footer */}

      {/* Modal */}
      <div
        className="sign_up_modal modal fade"
        id="logInModal"
        data-backdrop="static"
        data-keyboard="false"
        tabIndex={-1}
        aria-hidden="true"
      >
        <LoginSignupModal />
      </div>
      {/* End Modal */}
    </div>
    // End wrapper
  );
});

export default BlogDynamicSingle;
