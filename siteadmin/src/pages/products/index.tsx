import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductsSearch from "../../components/products/ProductsSearch";
import ProductsTable from "../../components/products/ProductsTable";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import { paginationData } from "src/stores/base";
import { EnumProductType, globalFilterType } from "src/stores/productStore";
import { getBreadcrumbItems } from "src/containers/layout";

const Products = () => {
    const navigate = useNavigate();
    const store = useStore();
    const productStore = store.productObservable;
    const fetchCars = () => {
        const pagination: paginationData & globalFilterType = {
            ...productStore.pagination,
        };
        productStore.getListProduct(pagination, EnumProductType.MOTOBIKES);
    };
    useEffect(() => {
        fetchCars();
    }, []);
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <Breadcrumb
                    style={{
                        margin: "0.25rem 0 1rem 0",
                    }}
                    items={[...getBreadcrumbItems(location.pathname)]}
                />
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {}}
                        size="large"
                    >
                        Tạo mới
                    </Button>
                </div>
            </div>
            <div className="w-full">
                <ProductsSearch />
            </div>

            <ProductsTable data={productStore.data.motobikes.data} />
        </>
    );
};

export default observer(Products);
