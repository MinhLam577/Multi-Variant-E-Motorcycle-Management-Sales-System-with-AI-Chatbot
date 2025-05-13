import { Form, message, UploadFile } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ProductsSearch from "src/components/products/ProductsSearch";
import ProductsTable from "src/components/products/ProductsTable";
import { useStore } from "../../stores";
import { observer } from "mobx-react-lite";
import { paginationData } from "src/stores/base";
import {
    CreateProductDto,
    EnumProductStore,
    globalFilterType,
    SkusDataResponseType,
    SkusDetailImportDto,
    VariantCombinationDto,
} from "src/stores/product.store";
import ProductHeader from "src/components/products/ProductHeader";
import CustomizeTab from "src/components/common/CustomizeTab";
import { reaction, set, toJS } from "mobx";
import { displayMessage, generateUUIDV4, urlToBase64 } from "src/utils";
import { CategoryResponseType } from "src/stores/categories.store";
import ModalCreateProduct, {
    IFormListRowData,
    IFormSkuCustomData,
    IVariantCombination,
    modalCreateProductStore,
} from "src/components/products/detail/ModalCreateProduct/ModalCreateProduct";
import ModalUpdateProduct from "src/components/products/detail/ModalUpdateProduct/ModalUpdateProduct";

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
    const base64String = (await urlToBase64(url)) as string;
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

export const getCategoriesTreeSelect = (data: CategoryResponseType[]) =>
    data?.map((item) => ({
        value: item.id,
        title: item.name,
        children: item.children ? getCategoriesTreeSelect(item.children) : [],
    }));

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
            const errorMessage =
                e instanceof Error ? e.message : "Có lỗi xảy ra";
            store.setStatusMessage(400, errorMessage, "");
        }
    };
    const handleCloseCreateProductModal = () => {
        setIsOpenCreateProductModal(false);
    };

    const fetchDetailData = async (id: string): Promise<any> => {
        const warehouseSelectData = getSelectOption(warehouseStore.data);
        await productStore.detailProduct(id);
        const productData = toJS(productStore.data.products.detailProductData);
        const warehouseMap = new Map<string, number>();
        const warehouseData = productData.skus
            .filter((item) => item.detail_import?.length > 0)
            .flatMap((item) =>
                item.detail_import.map((detail) => ({
                    warehouse_id: detail.warehouse.id,
                    quantity_import: detail.quantity_import,
                    lot_name: detail.lot_name,
                }))
            )
            .filter(({ warehouse_id }) => {
                if (warehouseMap.has(warehouse_id)) return false;
                warehouseMap.set(warehouse_id, 0);
                return true;
            });

        // Dữ liệu detail_import của sản phẩm
        const detailImport = Array.from({ length: 1 }).map(() => {
            const warehouseId = warehouseData.map((item) => item.warehouse_id);
            const detailObject = Object.fromEntries(
                warehouseData.map((item) => [
                    item.warehouse_id,
                    {
                        quantity_import: item.quantity_import.toString(),
                        warehouse_id: item.warehouse_id,
                        lot_name: item.lot_name,
                    },
                ])
            );
            return Object.assign({ warehouse_id: warehouseId }, detailObject);
        })[0];

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

        // Dữ liệu biến thể của sản phẩm
        const convertOptionDataResponseToFormListRowData = (
            skus: SkusDataResponseType[]
        ): IFormListRowData[] => {
            const attributeMap = new Map<string, Set<string>>();
            for (const sku of skus) {
                for (const optionValue of sku.optionValue || []) {
                    const optionID = optionValue.option.id;
                    if (!attributeMap.has(optionID)) {
                        attributeMap.set(optionID, new Set());
                    }
                    attributeMap.get(optionID)?.add(optionValue.value);
                }
            }
            const result: IFormListRowData[] = [];
            for (const [id, valuesSet] of attributeMap.entries()) {
                result.push({
                    name: id,
                    values: Array.from(valuesSet).map((value) => ({ value })),
                });
            }
            return result;
        };
        const optionValue: IFormListRowData[] =
            convertOptionDataResponseToFormListRowData(productData.skus);
        // Dữ liệu biến thể của sản phẩm
        const variantsData = optionValue;

        modalCreateProductStore.setWarehouseSelected(
            detailImport.warehouse_id.map((id) => ({
                value: id,
                label: warehouseSelectData.find((item) => item.value === id)
                    ?.label,
            }))
        );
        modalCreateProductStore.setFormVariantValue({
            variants: variantsData,
        });

        // SKU data
        const imagesConvertToBase64 = await Promise.all(
            productData.skus.map((item) => {
                const fileName = `${generateUUIDV4() + Date.now()}.jpg`;
                return generateImageFilesFromUrl(item.image, fileName);
            })
        );
        const skusResponseData = productData.skus.map((item, index) => ({
            name: item.name,
            masku: item.masku,
            barcode: item.barcode,
            image: imagesConvertToBase64[index].url,
            price_sold: item.price_sold,
            price_compare: item.price_compare,
            price_import: item.detail_import?.[0]?.price_import || 0,
            detail_import: item.detail_import.map((d) => ({
                warehouse_id: d.warehouse.id,
                quantity_import: d.quantity_import,
                lot_name: d.lot_name,
            })),
            variant_combination: item.optionValue.map((option) => {
                const optionId = option.option.id;
                return {
                    option_id: optionId,
                    value: option.value,
                } as VariantCombinationDto;
            }),
        }));
        const skusData: Record<string, Omit<IFormSkuCustomData, "name">> = {};
        skusResponseData.forEach((item) => {
            const name = item.name;
            const masku = item.masku;
            const barcode = item.barcode;
            const image = item.image as string;
            const price_sold = item.price_sold;
            const price_compare = item.price_compare;
            const price_import = item.price_import;
            const detail_import = detailImport.warehouse_id.map((id) => ({
                warehouse_id: id,
                quantity_import:
                    item.detail_import.find((d) => d.warehouse_id === id)
                        ?.quantity_import || 0,
                lot_name:
                    item.detail_import.find((d) => d.warehouse_id === id)
                        ?.lot_name || "",
            }));
            const variant_combination = item.variant_combination;
            skusData[name] = {
                masku,
                barcode,
                image,
                price_sold: Number(price_sold),
                price_compare: Number(price_compare),
                price_import: Number(price_import),
                detail_import,
                variant_combinations: variant_combination,
            };
        });

        // Lưu sku vào store
        modalCreateProductStore.setFullCustomData(skusData);
        // Lưu sku vào subForm (form của biến thể)
        subUpdateProductForm.setFieldsValue({
            skus: skusData,
        });

        // Chuyển đổi sku data thành định dạng form sản phẩm
        const convertSkusDataToSkuFormData: IFormSkuCustomData[] =
            Object.entries(skusData).map(([name, value]) => ({
                name,
                ...value,
            }));
        // Lưu sku định dạng mới vào form chính (form của sản phẩm)
        updateProductForm.setFieldsValue({
            skus: convertSkusDataToSkuFormData,
        });

        if (specData.length > 0) {
            modalCreateProductStore.setShowSpecForm(true);
        } else {
            modalCreateProductStore.setShowSpecForm(false);
        }

        if (modalCreateProductStore.VariantCombination.length > 0) {
            modalCreateProductStore.setShowVariantForm(true);
        } else {
            modalCreateProductStore.setShowVariantForm(false);
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
        detailImport.warehouse_id.forEach((id) => {
            const quantity_import = detailImport[id].quantity_import;
            modalCreateProductStore.setWarehouse_selected_quantities(
                quantity_import,
                id
            );
        });

        // Tạo đối tượng sản phẩm
        const product: any = {
            title: productData.title || "",
            description: productData.description || "",
            slug_product: productData.slug_product || "",
            variants: variantsData,
            image: productImages,
            specifications: specData,
            barcode,
            masku,
            price_compare,
            price_sold,
            price_import,
            detail_import: detailImport,
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
            const errorMsg =
                e instanceof Error
                    ? e.message
                    : "Có lỗi xảy ra trong quá trình view hoặc update sản phẩm";
            store.setStatusMessage(500, errorMsg, "", false);
        }
    };
    const handleSaveUpdateProductModal = async () => {
        try {
            updateProductForm.submit();
        } catch (e) {
            const errorMessage =
                e instanceof Error ? e.message : "Có lỗi xảy ra";
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
            const errorMsg =
                e instanceof Error
                    ? e.message
                    : "Có lỗi xảy ra trong quá trình xóa sản phẩm";
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
            const errorMsg =
                e instanceof Error
                    ? e.message
                    : "Có lỗi xảy ra trong quá trình lưu sản phẩm";
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
                                        categorySelectData={getCategoriesTreeSelect(
                                            categoriesStore.data
                                        )}
                                        brandSelectData={getSelectOption(
                                            brandStore.data
                                        )}
                                        warehouseSelectData={getSelectOption(
                                            warehouseStore.data
                                        )}
                                        optionSelectData={getSelectOption(
                                            optionStore.data
                                        )}
                                        formInitialValues={{
                                            price_import: 0,
                                            price_sold: 0,
                                            price_compare: 0,
                                        }}
                                        messageWhenSave="Tạo mới sản phẩm thành công"
                                    />

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
                                        categorySelectData={getCategoriesTreeSelect(
                                            categoriesStore.data
                                        )}
                                        brandSelectData={getSelectOption(
                                            brandStore.data
                                        )}
                                        warehouseSelectData={getSelectOption(
                                            warehouseStore.data
                                        )}
                                        optionSelectData={getSelectOption(
                                            optionStore.data
                                        )}
                                        productId={productId}
                                        initialData={initialData}
                                        messageWhenSave="Cập nhật sản phẩm thành công"
                                    />

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
                                    />
                                </>
                            ),
                        },
                    ]}
                />
            </div>
        </section>
    );
};

export default observer(Products);
