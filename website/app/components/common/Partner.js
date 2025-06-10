"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllBrand } from "@/src/api/brand";
import Link from "next/link";
const Partner = () => {
    const [partners, setPartners] = useState([]);
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const { data } = await getAllBrand(1, 10);
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
                                src={
                                    partner.thumbnailUrl ||
                                    "/images/placeholder.png"
                                }
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
