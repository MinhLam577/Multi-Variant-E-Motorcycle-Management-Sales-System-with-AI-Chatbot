"use client";
import listingsData from "@/data/listingCar";
import { getAllCategory } from "@/src/api/categories";
import { useStore } from "@/src/stores";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// const filterOptions = [
//   { value: "*", name: "Tất cả" },
//   { value: "new", name: "Xe van" },
//   { value: "car", name: "Xe khách" },
//   { value: "car", name: "Xe ben" },
//   { value: "car-specialized", name: "Xe chuyên dụng" },
// ];

const VehicleTypeList = () => {
  const store = useStore();
  const ProductStore = store.productObservable;
  const [filter, setFilter] = useState("*");
  const [dataDataCategory, setDataCategory] = useState([]);
  const [filteredItems, setFilteredData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filter === "*" || !filter) {
      fetchDataProduct();
    } else {
      fetchDataProduct(filter);
      console.log(filter);
    }
  }, [filter, dataDataCategory]);

  const fetchData = async () => {
    const data = await getAllCategory();
    console.log(data);
    setDataCategory(data.data);
  };
  const fetchDataProduct = async (categoryID = undefined) => {
    const query = {
      current: 1,
      pageSize: 4,
    };

    if (categoryID) {
      query.categoryID = categoryID;
    }
    await ProductStore.getListProductHome(query);
    setFilteredData(ProductStore?.data?.cars_motobikes?.data);
  };

  return (
    <div className="popular_listing_sliders">
      {/* Nav tabs */}
      <div className="nav nav-tabs justify-content-center">
        <button
          key={""}
          className={filter === "*" ? "active nav-link" : "nav-link"}
          onClick={() => setFilter("*")}
        >
          {"ALL"}
        </button>

        {dataDataCategory?.map((type) => (
          <button
            key={type}
            className={filter === type.id ? "active nav-link" : "nav-link"}
            onClick={() => setFilter(type.id)}
          >
            {type.name}
          </button>
        ))}
      </div>
      {/* Tab panes */}
      <div className="row">
        {filteredItems.map((listing) => (
          <div className="col-sm-6 col-xl-3" key={listing.id}>
            <div className="car-listing">
              <div className="thumb">
                {listing.featured ? (
                  <>
                    <div className="tag">Đã qua sử dụng</div>
                  </>
                ) : undefined}
                {!listing.featured ? (
                  <>
                    <div className="tag blue">Mới</div>
                  </>
                ) : undefined}

                <Image
                  width={284}
                  height={183}
                  style={{
                    width: "100%",
                    objectFit: "cover",
                  }}
                  priority
                  src={listing?.products?.images[0]}
                  alt={listing.products.title}
                />
                <div className="thmb_cntnt2">
                  <ul className="mb0">
                    <li className="list-inline-item">
                      <a className="text-white" href="#">
                        <span className="flaticon-photo-camera mr3" />{" "}
                        {listing.photosCount}
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a className="text-white" href="#">
                        <span className="flaticon-play-button mr3" />{" "}
                        {listing.videosCount}
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="thmb_cntnt3">
                  <ul className="mb0">
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-shuffle-arrows" />
                      </a>
                    </li>
                    <li className="list-inline-item">
                      <a href="#">
                        <span className="flaticon-heart" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="details">
                <div className="wrapper">
                  <h5 className="price">Liên hệ</h5>
                  <h6 className="title">
                    <Link href={`/listing-single-v1/${listing.products.id}`}>
                      {listing.products.title}
                    </Link>
                  </h6>
                </div>{" "}
                <div className="listing_footer">
                  <ul className="mb0">
                    <li className="list-inline-item">
                      <span className="flaticon-road-perspective me-2" />
                      {listing.mileage}
                    </li>
                    <li className="list-inline-item">
                      <span className="flaticon-gas-station me-2" />
                      {listing.fuelType}
                    </li>
                    <li className="list-inline-item">
                      <span className="flaticon-gear me-2" />
                      {listing.transmission}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleTypeList;
