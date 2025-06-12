import {
    EnumProductSortBy,
    globalFilterType,
    ProductType,
} from "@/src/stores/productStore";
import { toCurrency } from "@/utils";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
export interface ICarItemsProps {
    data: ProductType;
    queryObject: globalFilterType;
}
const CarItems: React.FC<ICarItemsProps> = ({ data, queryObject }) => {
    // Hàm tính giá thấp nhất của skus cho một sản phẩm
    const getMinPrice = (skus) => {
        if (!skus || !Array.isArray(skus)) return Infinity; // Trả về Infinity để xếp cuối nếu không có skus
        const validPrices = skus
            .map((s) => (s?.price_sold && Number(s.price_sold)) || null)
            .filter((p) => typeof p === "number" && !isNaN(p));
        return validPrices.length ? Math.min(...validPrices) : Infinity;
    };

    // Sắp xếp data theo giá thấp nhất của skus
    const sortedData = [...data].sort((a, b) => {
        const priceA = getMinPrice(a.products.skus);
        const priceB = getMinPrice(b.products.skus);
        return queryObject.sort_by === EnumProductSortBy.PRICE_ASC
            ? priceA - priceB
            : priceB - priceA;
    });

    const getDataToRender = () => {
        if (
            queryObject.sort_by === EnumProductSortBy.PRICE_ASC ||
            queryObject.sort_by === EnumProductSortBy.PRICE_DESC
        ) {
            return sortedData;
        }
        return data;
    };
    return (
        <>
            {getDataToRender().map((listing) => (
                <div
                    className="col-sm-6 col-lg-4 col-xl-3"
                    key={listing.products.id}
                >
                    {/* Kiểm tra kiểu sản phẩm và thay đổi đường dẫn */}
                    <Link
                        href={
                            listing.products.type === "car"
                                ? `/listing-single-v1/${listing.products.id}`
                                : `/listing-single-v2/${listing.products.id}`
                        }
                    >
                        <div className="car-listing">
                            <div className="thumb">
                                {listing.products?.id && (
                                    <Link
                                        href={
                                            listing.products.type === "car"
                                                ? `/listing-single-v1/${listing.products.id}`
                                                : `/listing-single-v2/${listing.products.id}`
                                        }
                                    >
                                        <Image
                                            width={284}
                                            height={183}
                                            className="w-full h-[183px] object-cover"
                                            priority
                                            src={listing.products.images[0]}
                                            alt={listing.products.title}
                                        />
                                    </Link>
                                )}
                            </div>

                            <div className="details">
                                <div className="wrapper flex flex-col justify-between space-y-3">
                                    <h5 className="price text-xl font-semibold text-green-600 flex-grow">
                                        {(() => {
                                            if (
                                                !listing?.products?.skus ||
                                                !Array.isArray(
                                                    listing.products.skus
                                                )
                                            ) {
                                                return "Liên hệ";
                                            }
                                            const validPrices =
                                                listing.products.skus
                                                    .map(
                                                        (s) =>
                                                            (s?.price_sold &&
                                                                Number(
                                                                    s.price_sold
                                                                )) ||
                                                            null
                                                    )
                                                    .filter(
                                                        (p) =>
                                                            typeof p ===
                                                                "number" &&
                                                            !isNaN(p)
                                                    );
                                            return validPrices.length
                                                ? toCurrency(
                                                      Math.min(...validPrices)
                                                  )
                                                : "Liên hệ";
                                        })()}
                                    </h5>
                                    <div className="flex flex-col justify-between">
                                        <h6 className="title text-base font-medium text-gray-800 hover:text-blue-600 transition line-clamp-2 flex-grow h-12">
                                            {listing.products?.id && (
                                                <Link
                                                    href={
                                                        listing.products
                                                            .type === "car"
                                                            ? `/listing-single-v1/${listing.products.id}`
                                                            : `/listing-single-v2/${listing.products.id}`
                                                    }
                                                >
                                                    {listing.products.title}
                                                </Link>
                                            )}
                                        </h6>
                                    </div>
                                </div>
                                {/* End wrapper */}
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </>
    );
};

export default observer(CarItems);
