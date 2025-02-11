import Image from "next/image";
import Link from "next/link";

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

const Category = () => {
  return (
    <>
      {categories.map((category, index) => (
        <div
          key={index}
          className={`col-6 col-sm-6 col-md-4 col-lg col-xl`}
          data-aos="fade-up"
          data-aos-delay={category.delay}
        >
          <div className="category_item">
            <div className="thumb">
              <Image
                width={180}
                height={80}
                style={{ objectFit: "contain" }}
                src={category.imgSrc}
                alt={`${index + 1}.png`}
              />
            </div>
            <div className="details">
              <p className="title">
                <Link href="/listing-v1">{category.title}</Link>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Category;
