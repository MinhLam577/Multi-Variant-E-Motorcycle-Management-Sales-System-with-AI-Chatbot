"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllBrand } from "@/src/api/brand";
import Link from "next/link";
// const partners = [
//   { imgPath: "/images/partners/1.png", delay: 100 },
//   { imgPath: "/images/partners/2.png", delay: 300 },
//   { imgPath: "/images/partners/3.png", delay: 500 },
//   { imgPath: "/images/partners/4.png", delay: 700 },
//   { imgPath: "/images/partners/5.png", delay: 900 },
//   { imgPath: "/images/partners/6.png", delay: 1100 },
// ];
const Partner = () => {
  const [partners, setPartners] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await getAllBrand(1, 10);
    console.log(data);
    setPartners(data.result);
  };
  return (
    <>
      {partners?.map((partner, index) => (
        <div
          key={index}
          className="col-6 col-xs-6 col-sm-4 col-xl-2 cursor-pointer"
          data-aos="fade-up"
          data-aos-delay={partner.delay}
        >
          <Link href={`/listing-v1?brandID=${partner.id}`}>
            <div className="partner_item w-[180px] h-[180px] flex items-center justify-center">
              <Image
                width={200}
                height={80}
                style={{ objectFit: "contain" }}
                src={partner.thumbnailUrl || "/images/placeholder.png"}
                alt={`partner-${index}`}
              />
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default Partner;
