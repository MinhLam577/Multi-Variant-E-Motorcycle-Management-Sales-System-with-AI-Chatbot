import { Form } from "antd";
import { useEffect, useState } from "react";
import ProductsSearch from "@/components/products/ProductsSearch";
import ProductsTable from "@/components/products/ProductsTable";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import { paginationData } from "@/stores/base";
import {
    CreateProductDto,
    globalFilterType,
    SkusDataResponseType,
} from "@/types/product.type";
import ProductHeader from "@/components/products/ProductHeader";
import CustomizeTab from "@/components/common/CustomizeTab";
import { reaction, toJS } from "mobx";
import { generateUUIDV4, getErrorMessage } from "@/utils";
import { CategoryResponseType } from "@/types/categories.type";
import { modalCreateProductStore } from "@/components/products/detail/ModalCreateProduct/ModalCreateProduct.store";
import ModalCreateProduct from "@/components/products/detail/ModalCreateProduct/ModalCreateProduct";
import ModalUpdateProduct from "@/components/products/detail/ModalUpdateProduct/ModalUpdateProduct";
import BaseAPI from "@/api/base";
import {
    IFormListRowData,
    TreeSelectType,
} from "@/components/products/detail/ModalCreateProduct/ModalCreateProduct.type";

type product_brand_type = {
    id: string;
    name: string;
};

type product_category_type = {
    id: string;
    name: string;
};

export type productTableFilterDataType = {
    id: string;
    brand: product_brand_type;
    category: product_category_type;
    title: string;
    status: boolean;
    images: string[];
    totalSKU: number;
    totalStock: number;
    skus: Omit<SkusDataResponseType, "optionValue">[];
    [key: string]: any;
};
export const getSelectOption = <
    T extends { id: number | string; name: string },
>(
    data: T[]
) => {
    return data?.map((item) => ({
        value: String(item.id),
        label: item.name,
    }));
};

export const generateImageFilesFromUrl = async (
    url: string,
    fileName: string
) => {
    const base64String = await BaseAPI.convertUrlToBase64(url);
    return {
        uid: `-${generateUUIDV4() + Date.now()}`,
        name: fileName,
        status: "done",
        url: base64String || url,
        originFileObj: base64String
            ? await fetch(base64String as string)
                  .then((res) => res.blob())
                  .then(
                      (blob) =>
                          new File([blob], fileName, {
                              type: "image/jpeg",
                          })
                  )
            : null,
    };
};
export const generateRandomString = (length: number): string => {
    const chars: string =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result: string = "";
    for (let i: number = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const getCategoriesTreeSelect = (
    data: CategoryResponseType[],
    excludeId?: string,
    maxLevel: number = 3
): TreeSelectType[] => {
    const buildTree = (
        nodes: CategoryResponseType[],
        level: number
    ): TreeSelectType[] =>
        nodes
            ?.filter((item) => item.id !== excludeId)
            .map((item) => ({
                value: item.id,
                title: item.name,
                children:
                    level < maxLevel && item.children
                        ? buildTree(item.children, level + 1)
                        : [],
            }));

    return buildTree(data, 1);
};

const Products = () => {
    const store = useStore();
    const productStore = store.productObservable;
    const categoriesStore = store.categoriesObservable;
    const brandStore = store.brandObservable;
    const warehouseStore = store.warehouseObservable;
    const optionStore = store.optionObservable;
    const [filterData, setFilterData] =
        useState<productTableFilterDataType[]>();
    const fetchProducts = async (
        query:
            | string
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType
    ) => {
        await productStore.getListProduct(query);
        const productsData = productStore.data.products.data;
        if (!productsData) return;
        const filterData: productTableFilterDataType[] = productsData.map(
            (item) => {
                const products = item.products;
                const totalSKU = item.totalSKU;
                const totalStock = item.totalStock;
                const deletedAt = item.products.deletedAt;
                const isDeleted = deletedAt !== null;
                return {
                    ...item,
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
                    status: !isDeleted,
                    images: products.images,
                    totalSKU: totalSKU,
                    totalStock: totalStock,
                    skus: products?.skus,
                };
            }
        );
        setFilterData(filterData);
    };
    const fetchData = async () => {
        await Promise.all([
            fetchProducts({
                ...productStore.pagination,
            }),
            categoriesStore.getListCategories(),
            brandStore.getListBrands({
                ...brandStore.pagination,
            }),
            warehouseStore.getListWarehouse(),
            optionStore.getListOptions(),
        ]);
    };
    const fetchOnlyProducts = async () => {
        await fetchProducts({
            ...productStore.pagination,
            ...productStore.data.globalFilter,
        });
    };
    useEffect(() => {
        fetchData();
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
                fetchProducts(filterData);
            }
        );
        return () => {
            productGlobalFilterReaction();
        };
    }, []);

    const [productSearchForm] = Form.useForm();
    const handleCreateNewProduct = () => {
        setIsOpenCreateProductModal(true);
    };

    // Create new product
    const [createProductForm] = Form.useForm<CreateProductDto>();
    const [subCreateProductForm] = Form.useForm();
    const [isOpenCreateProductModal, setIsOpenCreateProductModal] =
        useState(false);
    const handleSaveCreateProductModal = async () => {
        try {
            createProductForm.submit();
        } catch (e) {
            console.error("Error when submitting create product form:", e);
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi tạo sản phẩm"
            );
            store.setStatusMessage(400, errorMessage, "");
        }
    };
    const handleCloseCreateProductModal = () => {
        setIsOpenCreateProductModal(false);
    };

    const fetchDetailData = async (id: string): Promise<any> => {
        await productStore.detailProduct(id);
        const productData = toJS(productStore.data.products.detailProductData);
        // Dữ liệu thông số kỹ thuật của sản phẩm
        const specifications: IFormListRowData[] =
            productData.specifications.map((item) => ({
                name: item.name,
                values: [
                    {
                        value: item.value,
                    },
                ],
            }));
        const specData = specifications;

        if (specData.length > 0) {
            modalCreateProductStore.setShowSpecForm(true);
        } else {
            modalCreateProductStore.setShowSpecForm(false);
        }
        // Tạo các giá trị ngẫu nhiên cho các thuộc tính khác của sản phẩm
        const productImages =
            (await Promise.all(
                productData.images.map((item) => {
                    const fileName = `${generateUUIDV4() + Date.now()}.jpg`;
                    return generateImageFilesFromUrl(item, fileName);
                })
            )) || [];
        const price_sold = 0;
        const price_compare = 0;
        const price_import = 0;
        const masku = "";
        const barcode = "";

        // Lưu thông tin sản phẩm vào store
        modalCreateProductStore.setBarcode(barcode);
        modalCreateProductStore.setMasku(masku);
        modalCreateProductStore.setPrice(String(price_sold), "price_sold");
        modalCreateProductStore.setPrice(
            String(price_compare),
            "price_compare"
        );
        modalCreateProductStore.setPrice(String(price_import), "price_import");

        // Tạo đối tượng sản phẩm
        const product: any = {
            title: productData.title || "",
            description: productData.description || "",
            slug_product: productData.slug_product || "",
            image: productImages,
            specifications: specData,
            brand_id: productData.brand.id,
            category_id: productData.category.id,
            type: productData.type,
        };
        return product;
    };

    // Update product
    const [updateProductForm] = Form.useForm<CreateProductDto>();
    const [subUpdateProductForm] = Form.useForm();
    const [isOpenUpdateProductModal, setIsOpenUpdateProductModal] =
        useState(false);

    const [initialData, setInitialData] = useState<CreateProductDto>();
    const [productId, setProductId] = useState<string>("");
    const handleViewOrUpdateProduct = async (
        item: productTableFilterDataType
    ) => {
        try {
            const product = await fetchDetailData(item.id);
            setProductId(item.id);
            setIsOpenUpdateProductModal(true);
            setInitialData(product);
        } catch (e) {
            console.error("Error fetching product details:", e);
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra khi lấy thông tin sản phẩm"
            );
            store.setStatusMessage(500, errorMsg, "", false);
        }
    };
    const handleSaveUpdateProductModal = async () => {
        try {
            updateProductForm.submit();
        } catch (e) {
            console.error("Error when submitting update product form:", e);
            const errorMessage = getErrorMessage(
                e,
                "Có lỗi xảy ra khi cập nhật sản phẩm"
            );
            store.setStatusMessage(400, errorMessage, "");
        }
    };
    const handleCloseUpdateProductModal = () => {
        setIsOpenUpdateProductModal(false);
        setProductId("");
        setInitialData(undefined);
    };

    const handleDeleteProducts = async (id: string) => {
        try {
            const result = await productStore.softDeleteProduct(id);
            if (result) {
                store.setStatusMessage(
                    200,
                    "",
                    "Xóa sản phẩm thành công",
                    true
                );
                fetchOnlyProducts();
            }
        } catch (e) {
            console.error("Error deleting product:", e);
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra khi xóa sản phẩm"
            );
            store.setStatusMessage(500, errorMsg, "");
        }
    };

    const handleRestoreProducts = async (id: string) => {
        try {
            const result = await productStore.restoreDeleteProduct(id);
            if (result) {
                store.setStatusMessage(
                    200,
                    "",
                    "Phục hồi sản phẩm thành công",
                    true
                );
                fetchOnlyProducts();
            }
        } catch (e) {
            console.error("Error storing product:", e);
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra khi phục hồi sản phẩm"
            );
            store.setStatusMessage(500, errorMsg, "");
        }
    };

    const handleHardDeleteProducts = async (id: string) => {
        try {
            const result = await productStore.hardDeleteProduct(id);
            if (result) {
                store.setStatusMessage(
                    200,
                    "",
                    "Xóa vĩnh viễn sản phẩm thành công",
                    true
                );
                fetchOnlyProducts();
            }
        } catch (e) {
            console.error("Error hard deleting product:", e);
            const errorMsg = getErrorMessage(
                e,
                "Có lỗi xảy ra khi xóa vĩnh viễn sản phẩm"
            );
            store.setStatusMessage(500, errorMsg, "");
        }
    };
    return (
        <section className="w-full">
            <ProductHeader
                onCreateNew={handleCreateNewProduct}
                className="animate-slideDown"
            />
            <div className="w-full flex flex-col gap-4 bg-[var(--content-table-background-color)] rounded-md px-4 pb-4 my-6 animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả sản phẩm",
                            children: (
                                <>
                                    <div className="w-full mt-2">
                                        <ProductsSearch
                                            form={productSearchForm}
                                            categorySelectData={getCategoriesTreeSelect(
                                                categoriesStore.data
                                            )}
                                            brandSelectData={getSelectOption(
                                                brandStore.data
                                            )}
                                        />
                                    </div>

                                    <ProductsTable
                                        data={filterData}
                                        handleDeleteProducts={
                                            handleDeleteProducts
                                        }
                                        handleRestoreProducts={
                                            handleRestoreProducts
                                        }
                                        handleViewOrUpdateProduct={
                                            handleViewOrUpdateProduct
                                        }
                                        handleHardDeleteProducts={
                                            handleHardDeleteProducts
                                        }
                                    />
                                </>
                            ),
                        },
                    ]}
                />
            </div>
            {productId ? (
                <ModalUpdateProduct
                    key={`modal-update-product-${productId}`}
                    isOpen={isOpenUpdateProductModal}
                    onClose={handleCloseUpdateProductModal}
                    onSave={handleSaveUpdateProductModal}
                    loadingData={fetchOnlyProducts}
                    okText="Cập nhật"
                    cancelText="Hủy"
                    form={updateProductForm}
                    subForm={subUpdateProductForm}
                    categorySelectData={categoriesStore.data}
                    brandSelectData={getSelectOption(brandStore.data)}
                    warehouseSelectData={getSelectOption(warehouseStore.data)}
                    optionSelectData={getSelectOption(optionStore.data)}
                    productId={productId}
                    initialData={initialData}
                    messageWhenSave="Cập nhật sản phẩm thành công"
                />
            ) : (
                <ModalCreateProduct
                    key={"modal-create-product"}
                    isOpen={isOpenCreateProductModal}
                    onClose={handleCloseCreateProductModal}
                    onSave={handleSaveCreateProductModal}
                    loadingData={fetchOnlyProducts}
                    okText="Tạo mới"
                    cancelText="Hủy"
                    form={createProductForm}
                    subForm={subCreateProductForm}
                    categorySelectData={categoriesStore.data}
                    brandSelectData={getSelectOption(brandStore.data)}
                    warehouseSelectData={getSelectOption(warehouseStore.data)}
                    optionSelectData={getSelectOption(optionStore.data)}
                    formInitialValues={{
                        price_import: 0,
                        price_sold: 0,
                        price_compare: 0,
                    }}
                    messageWhenSave="Tạo mới sản phẩm thành công"
                />
            )}
        </section>
    );
};

export default observer(Products);
