"use client";
import { getAllCategory } from "@/src/api/categories";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/stores";
const categories = [
  {
    imgSrc: "/images/category-item/1.png",
    title: "Xe tải",
    delay: 100,
  },
  {
    imgSrc: "/images/category-item/2.png",
    title: "Xe khách",
    delay: 200,
  },
  {
    imgSrc: "/images/category-item/3.png",
    title: "Xe ben",
    delay: 300,
  },
  {
    imgSrc: "/images/category-item/4.png",
    title: "Xe chuyên dụng",
    delay: 400,
  },
];

const Category = observer(() => {
  // const [categories, setCategories] = useState([]);
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     const data = await getAllCategory();
  //     console.log(data.data);
  //     setCategories(data.data);
  //   };
  //   fetchCategories();
  // }, []);
  const { categoryObservable } = useStore();
  return (
    <>
      {categoryObservable?.data?.categories?.map((category, index) => (
        <div
          key={index}
          className={`col-6 col-sm-6 col-md-4 col-lg col-xl`}
          data-aos="fade-up"
          data-aos-delay={category.delay}
        >
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
            <div className="flex justify-center items-center h-24 mb-3">
              <Image
                width={180}
                height={80}
                style={{ objectFit: "contain" }}
                src={"/images/category-item/1.png"}
                alt={`${index + 1}.png`}
              />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                <Link
                  href={`/listing-v1/?categoryID=${category.id}`}
                  className="hover:text-blue-500 transition"
                >
                  {category.name}
                </Link>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});

export default Category;
