import { Button, Form, Select } from "antd";
import { toJS } from "mobx";
import { useEffect, useState } from "react";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import CustomizeTab from "src/components/common/CustomizeTab";
import VariantSearch from "src/components/variants/VariantSearch";
import { getBreadcrumbItems } from "src/containers/layout";
import { useStore } from "src/stores";
import { globalFiltersDataSkus, SkusResponseType } from "src/stores/skus.store";
import { getSelectOption } from "../products";
import { observer } from "mobx-react-lite";
import VariantTable from "src/components/variants/VariantTable";
import ModalCreateVariant from "src/components/variants/ModalCreateVariant";
import CustomizeModal from "src/components/common/CustomizeModal";
import { ProductDataResponseType } from "src/stores/product.store";
import { getErrorMessage, urlToBase64 } from "src/utils";
import { useLocation } from "react-router";
import { ALL_PERMISSIONS } from "src/constants/permissions";
import Access from "src/access/access";

export type OptionValueOfProductType = {
    id: string;
    name: string;
};

export type FormValueCreateVariantType = {
    id?: string;
    image: string;
    name: string;
    price_sold: string;
    price_compare: string;
    optionValue: {
        [key: string]: string;
    };

    options: OptionValueOfProductType[];
    price_import?: string;
    masku?: string;
    barcode?: string;
    detail_import?: {
        warehouses: string[];
        [key: string]:
            | {
                  quantity_import: string;
                  lot_name: string;
              }
            | string[];
    };
};

const VariantsPage = () => {
    const store = useStore();
    const location = useLocation();

    const [globalFilterDataSkus, setGlobalFilterDataSkus] =
        useState<globalFiltersDataSkus>({
            search: "",
            product_id: undefined,
            brand_id: undefined,
            warehouse_id: undefined,
        });
    const {
        productObservable: productStore,
        brandObservable: brandStore,
        warehouseObservable: warehouseStore,
        skusObservable: skusStore,
    } = store;

    const fetchListSkus = async (query: string | object) => {
        await skusStore.getList(query);
    };

    const fetchData = async (query?: globalFiltersDataSkus) => {
        await Promise.all([
            productStore.getListProduct({
                ...productStore.pagination,
            }),
            brandStore.getListBrands({
                ...brandStore.pagination,
            }),
            warehouseStore.getListWarehouse(),
            fetchListSkus({
                ...skusStore.pagination,
                ...(query ? query : {}),
            }),
        ]);
    };

    const getProductSelect = () => {
        return toJS(
            productStore.data.products.data?.map((item) => ({
                label: item.products.title,
                value: item.products.id,
            }))
        );
    };

    const [searchForm] = Form.useForm<globalFiltersDataSkus>();

    useEffect(() => {
        fetchListSkus({
            ...globalFilterDataSkus,
            ...skusStore.pagination,
        });
    }, [globalFilterDataSkus]);

    useEffect(() => {
        if (location && location?.state && location?.state?.productId) {
            const productId = location.state.productId;
            searchForm.setFieldsValue({
                product_id: productId,
            });
            setGlobalFilterDataSkus((prev) => ({
                ...prev,
                product_id: productId,
            }));
            fetchListSkus({
                ...globalFilterDataSkus,
                ...skusStore.pagination,
                product_id: productId,
            });
        } else {
            fetchData();
        }
    }, [location]);

    const [openModalSelectProduct, setOpenModalSelectProduct] = useState(false);
    const [productSelect, setProductSelect] = useState<string>(null);
    const [productData, setProductData] =
        useState<ProductDataResponseType>(null);
    const handleCloseModalSelectProduct = () => {
        setOpenModalSelectProduct(false);
    };
    const handleSaveModalSelectProduct = () => {
        handleCloseModalSelectProduct();
        setOpenModalCreate(true);
    };

    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [createForm] = Form.useForm();
    const handleSubmitCreate = async () => {
        createForm.submit();
    };
    const handleCloseModalCreate = () => {
        setOpenModalCreate(false);
        createForm.resetFields();
    };

    const getOptionOfProductData = () => {
        if (!productData) return [];
        const optionMap = new Map<string, OptionValueOfProductType>();
        productData.skus.forEach((sku) => {
            sku.optionValue.forEach((item) => {
                if (!optionMap.has(item.option.id)) {
                    optionMap.set(item.option.id, {
                        id: item.option.id,
                        name: item.option.name,
                    });
                }
            });
        });
        return Array.from(optionMap.values());
    };

    useEffect(() => {
        if (productSelect && openModalSelectProduct) {
            const selectedProduct = toJS(
                productStore.data.products.data.find(
                    (item) => item.products.id === productSelect
                )
            );
            if (selectedProduct) {
                setProductData(selectedProduct.products);
            }
        }
    }, [productSelect, openModalSelectProduct]);

    useEffect(() => {
        if (productData) {
            const optionData = getOptionOfProductData();
            createForm.setFieldsValue({
                options: optionData,
                title: productData.title,
            });
        }
    }, [productData]);

    const [updateForm] = Form.useForm();
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [skuSelected, setSkuSelected] = useState<string>(null);
    const handleUpdateForm = async () => {
        setGlobalFilterDataSkus((prev) => ({
            ...prev,
            search: "",
        }));
    };
    const handleCloseModalUpdate = () => {
        setOpenModalUpdate(false);
        setSkuSelected(null);
        updateForm.resetFields();
    };
    const convertSkusResponseToForm = (
        skus: SkusResponseType
    ): FormValueCreateVariantType => {
        const optionValue = Object.fromEntries(
            skus.optionValue.map((item) => [item.option.id, item.value])
        );

        const options = skus.optionValue.map((item) => ({
            id: item.option.id,
            name: item.option.name,
        }));
        return {
            name: skus.name,
            image: skus.image,
            price_sold: skus.price_sold,
            price_compare: skus.price_compare,
            barcode: skus.barcode || "",
            masku: skus.masku || "",
            options: options,
            optionValue: optionValue,
        };
    };

    const handleUpdateSkus = async (item: SkusResponseType) => {
        try {
            setSkuSelected(item.id);
            const formDataValue = convertSkusResponseToForm(toJS(item));
            updateForm.setFieldsValue({
                ...formDataValue,
            });
            setOpenModalUpdate(true);
        } catch (e) {
            console.log(e);
            const errorMessage = getErrorMessage(
                e,
                "Đã có lỗi xảy ra trong quá trình cập nhật biến thể"
            );
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const handleDeleteSkus = async (id: string) => {
        try {
            await skusStore.remove(id);
            setGlobalFilterDataSkus((prev) => ({
                ...prev,
                search: "",
            }));
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col animate-slideDown">
                <div className="flex justify-between items-center">
                    <AdminBreadCrumb
                        description="Thông tin chi tiết về danh sách các biến thể sản phẩm"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                    <Access
                        permission={ALL_PERMISSIONS.SKUS.CREATE}
                        hideChildren
                    >
                        <Button
                            type="primary"
                            size="large"
                            className="!rounded-none"
                            onClick={() => {
                                setOpenModalSelectProduct(true);
                            }}
                        >
                            Tạo biến thể
                        </Button>
                    </Access>
                </div>
            </div>
            <div className="w-full mt-4 mb-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả biến thể",
                            children: (
                                <div className="w-full mt-2">
                                    <VariantSearch
                                        setFilters={setGlobalFilterDataSkus}
                                        productsSelect={getProductSelect()}
                                        warehouseSelect={getSelectOption(
                                            warehouseStore.data
                                        )}
                                        brandSelect={getSelectOption(
                                            brandStore.data
                                        )}
                                        searchForm={searchForm}
                                    />

                                    <VariantTable
                                        data={skusStore.data.skus}
                                        handleUpdateSkus={handleUpdateSkus}
                                        handleDeleteSkus={handleDeleteSkus}
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <CustomizeModal
                isOpen={openModalSelectProduct}
                title="Chọn sản phẩm cần thêm biến thể"
                cancelText="Hủy bỏ"
                okText="Chọn sản phẩm"
                handleCloseModal={handleCloseModalSelectProduct}
                handleSaveModal={handleSaveModalSelectProduct}
                width={800}
            >
                <Select
                    className="w-full"
                    placeholder="Chọn sản phẩm"
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    onChange={(value) => {
                        setProductSelect(value);
                    }}
                    options={getProductSelect() || []}
                />
            </CustomizeModal>

            <ModalCreateVariant
                defaultForm={createForm}
                open={openModalCreate}
                onClose={handleCloseModalCreate}
                onSubmit={handleSubmitCreate}
                warehouseOption={getSelectOption(toJS(warehouseStore.data))}
                key={"modal-create-variant"}
                isUpdate={false}
            />

            {skuSelected && (
                <ModalCreateVariant
                    defaultForm={updateForm}
                    open={openModalUpdate}
                    onClose={handleCloseModalUpdate}
                    onSubmit={handleUpdateForm}
                    warehouseOption={getSelectOption(toJS(warehouseStore.data))}
                    key={"modal-update-variant"}
                    isUpdate={true}
                    sku_id={skuSelected}
                />
            )}
        </section>
    );
};

export default observer(VariantsPage);
