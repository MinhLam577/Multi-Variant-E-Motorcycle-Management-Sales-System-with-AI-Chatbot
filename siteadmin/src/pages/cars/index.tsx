import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Form, message } from "antd";
import { Children, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import ProductsSearch from "src/components/products/ProductsSearch";
import ProductsTable from "src/components/products/ProductsTable";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import { paginationData } from "src/stores/base";
import {
    EnumProductStore,
    EnumProductType,
    globalFilterType,
    ProductType,
} from "src/stores/product.store";
import ProductHeader from "src/components/products/ProductHeader";
import CustomizeTab from "src/components/common/CustomizeTab";
import { reaction, set, toJS } from "mobx";
import { displayMessage } from "src/utils";
import { CategoriesType } from "src/stores/categories.store";
import { BrandType } from "src/stores/brand.store";

type product_brand_type = {
    id: string;
    name: string;
};

type product_category_type = {
    id: string;
    name: string;
};

type tableFilterDataType = {
    id: string;
    brand: product_brand_type;
    category: product_category_type;
    title: string;
    status: boolean;
    images: string[];
    totalSKU: number;
    totalStock: number;
};

const Cars = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const store = useStore();
    const productStore = store.productObservable;
    const categoriesStore = store.categoriesObservable;
    const brandStore = store.brandObservable;
    const [filterData, setFilterDaa] = useState<tableFilterDataType[]>();
    const fetchCars = async (
        query:
            | string
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType
    ) => {
        await productStore.getListProduct(query, EnumProductStore.MOTORBIKE);
        const productsData = productStore.data.motobikes.data;
        if (!productsData) return;
        const filterData: tableFilterDataType[] = productsData.map((item) => {
            const products = item.products;
            const totalSKU = item.totalSKU;
            const totalStock = item.totalStock;
            return {
                id: products.id,
                brand: {
                    id: products.brand.id,
                    name: products.brand.name,
                },
                category: {
                    id: products.category.id,
                    name: products.category.name,
                },
                title: products.title,
                status: products.status,
                images: products.images,
                totalSKU: totalSKU,
                totalStock: totalStock,
            };
        });
        setFilterDaa(filterData);
    };
    const fetchData = async () => {
        await Promise.all([
            fetchCars({
                ...productStore.pagination,
            }),
            categoriesStore.getListCategories(),
            brandStore.getListBrands({
                ...brandStore.pagination,
            }),
        ]);
    };
    const getCategoriesTreeSelect = (data: CategoriesType[]) =>
        data?.map((item) => ({
            value: item.id,
            title: item.name,
            children: item.children
                ? getCategoriesTreeSelect(item.children)
                : [],
        }));
    const getBrandSelect = (data: BrandType[]) =>
        data?.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    useEffect(() => {
        fetchData();
    }, []);

    // Bắt sự kiện khi status thay đổi để hiện thông báo
    useEffect(() => {
        const productStatusReaction = reaction(
            () => ({
                status: productStore.status,
                showSuccessMsg: productStore.showSuccessMsg,
            }),
            (current_status) => {
                if (!current_status) return;
                const { status, showSuccessMsg } = current_status;
                displayMessage(
                    messageApi,
                    status,
                    productStore,
                    showSuccessMsg,
                    5
                );
            }
        );
        return () => {
            productStatusReaction();
        };
    }, []);

    // Bắt sự kiện khi có sự thay đổi trong globalFilter
    useEffect(() => {
        const productGlobalFilterReaction = reaction(
            () => productStore.data.globalFilter,
            (current_globalFilter) => {
                if (!current_globalFilter) return;
                const filterData: globalFilterType & paginationData = {
                    ...productStore.data.globalFilter,
                    ...productStore.pagination,
                };
                fetchCars(filterData);
            }
        );
        return () => {
            productGlobalFilterReaction();
        };
    }, []);

    const [form] = Form.useForm();
    const handleCreateNewProduct = () => {};
    return (
        <section className="w-full">
            {contextHolder}
            <ProductHeader onCreateNew={handleCreateNewProduct} />
            <div className="w-full flex flex-col gap-4 bg-[var(--content-table-background-color)] rounded-md px-4 pb-4">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả sản phẩm",
                        },
                    ]}
                />
                <div className="w-full">
                    <ProductsSearch
                        form={form}
                        categorySelectData={getCategoriesTreeSelect(
                            categoriesStore.data
                        )}
                        brandSelectData={getBrandSelect(brandStore.data)}
                    />
                </div>
                <ProductsTable data={filterData} />
            </div>
        </section>
    );
};

export default observer(Cars);
