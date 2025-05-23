import {
    Button,
    Col,
    Form,
    Image,
    Input,
    Row,
    Select,
    Space,
    Table,
    Tooltip,
} from "antd";
import { Add } from "iconsax-react";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import AdminBreadCrumb from "src/components/common/AdminBreadCrumb";
import CustomizeModal from "src/components/common/CustomizeModal";
import CustomizeTab from "src/components/common/CustomizeTab";
import ImportSearch from "src/components/imports/ImportSearch";
import ImportTable from "src/components/imports/ImportTable";
import { AntdTableLocale } from "src/constants";
import { getBreadcrumbItems } from "src/containers/layout";
import { useStore } from "src/stores";
import {
    CreateDetailImportDto,
    CreateImportDto,
    globalFiltersImportDataType,
    ImportResponseType,
} from "src/stores/imports.store";
import { paginationData } from "src/stores/voucher";
import { productTableFilterDataType } from "../products";
import {
    globalFilterType,
    SkusDataResponseType,
    SkusDetailImportDtoV2,
    UpdateDetailImportDto,
    UpdateImportDto,
} from "src/stores/product.store";
import { ColumnsType } from "antd/es/table";
import {
    DeleteOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import { toJS } from "mobx";
import { filterEmptyFields, generateUUIDV4 } from "src/utils";
import { FormInstance } from "antd/lib";
import TextArea from "antd/es/input/TextArea";
import { SelectType } from "src/components/products/detail/ModalCreateProduct/ModalCreateProduct";

interface ImportPageProps {}

const ImportPage: React.FC<ImportPageProps> = () => {
    const [globalFilterImportData, setGlobalFilterImportData] =
        useState<globalFiltersImportDataType>({
            search: undefined,
            warehouse_id: undefined,
            start_date: undefined,
            end_date: undefined,
            product_id: undefined,
            skus_id: undefined,
        });
    const store = useStore();
    const importStore = store.importObservable;
    const warehouseStore = store.warehouseObservable;
    const productStore = store.productObservable;
    const [filterProductData, setFilterProductData] =
        useState<productTableFilterDataType[]>();
    const [skusDataSelect, setSkusDataSelect] = useState<SelectType[]>([]);
    const fetchImportData = async (
        query: globalFiltersImportDataType & paginationData
    ) => {
        await importStore.getListImports(query);
    };
    const fetchProducts = async (
        query:
            | string
            | (paginationData & globalFilterType)
            | paginationData
            | globalFilterType
    ) => {
        await productStore.getListProduct(query);
        const productsData = toJS(productStore.data.products.data);
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
        setFilterProductData(filterData);
    };
    const fetchData = async () => {
        await Promise.all([
            fetchImportData({
                ...importStore.pagination,
            }),
            warehouseStore.getListWarehouse(),
            fetchProducts({
                ...productStore.pagination,
            }),
        ]);
        getSkuSelectByProduct();
    };
    const getProductSelect = () => {
        const products = productStore.data;
        if (!products) return [];
        const selectProducts = products.products.data?.map((item) => ({
            label: item.products.title,
            value: item.products.id,
        }));
        return selectProducts;
    };

    const getWarehouseSelect = () => {
        const warehouses = warehouseStore.data;
        if (!warehouses) return [];
        const selectWarehouses = warehouses?.map((item) => ({
            label: item.name as string,
            value: item.id as string,
        }));
        return selectWarehouses;
    };

    const getSkuSelectByProduct = () => {
        const products = productStore.data;
        if (!products) return [];
        const skus = products.products.data?.flatMap((item) => {
            const sku = item.products.skus.map((item) => ({
                label: item.name,
                value: item.id,
            }));
            return sku;
        });
        setSkusDataSelect(skus);
    };
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        const products = productStore.data;
        if (products) {
            const productId = globalFilterImportData.product_id;
            let skus = [];
            if (productId) {
                skus = products.products.data
                    ?.filter((p) => p.products.id === productId)
                    .flatMap((item) => {
                        const sku = item.products.skus.map((item) => ({
                            label: item.name,
                            value: item.id,
                        }));
                        return sku;
                    });
            } else {
                skus = products.products.data?.flatMap((item) => {
                    const sku = item.products.skus.map((item) => ({
                        label: item.name,
                        value: item.id,
                    }));
                    return sku;
                });
            }
            setSkusDataSelect(skus);
            if (!productId) {
                setGlobalFilterImportData((prev) => ({
                    ...prev,
                    skus_id: undefined,
                }));
            }
        }
    }, [globalFilterImportData.product_id]);
    useEffect(() => {
        fetchImportData({
            ...importStore.pagination,
            ...globalFilterImportData,
        });
    }, [globalFilterImportData]);

    const [openModal, setOpenModal] = useState(false);
    const [createImportForm] = Form.useForm();
    const [importData, setImportData] = useState<
        {
            [skus_id: string]: SkusDetailImportDtoV2[] & { skus_name: string };
        }[]
    >([]);
    const [selectedImport, setSelectedImport] = useState<any[]>([]);
    const handleCloseCreateImportModal = () => {
        setOpenModal(false);
        setImportData([]);
        setSelectedImport([]);
        setSelectedProducts([]);
        setSelectedSkus([]);
    };

    const handleSaveCreateImportModal = async () => {
        try {
            const values = await createImportForm.validateFields();
            const { note, skus } = values;
            if (!skus || Object.keys(skus).length === 0) {
                store.setStatusMessage(
                    500,
                    "Vui lòng nhập đầy đủ thông tin",
                    "",
                    false
                );
                return;
            }

            const detail_import: CreateDetailImportDto[] = (
                Object.entries(skus) as [
                    string,
                    SkusDetailImportDtoV2 & { skus_name: string },
                ][]
            ).flatMap(([skus_id, value]) => {
                const warehouses = value.warehouses || [];
                if (warehouses.length === 0) {
                    throw new Error(
                        `Vui lòng nhập thông tin chi tiết nhập kho cho biến thể ${value.skus_name}`
                    );
                }
                return warehouses.map((wh) => {
                    return filterEmptyFields({
                        skus_id: skus_id,
                        price_import: Number(value.price_import),
                        quantity_import: Number(wh.quantity_import),
                        warehouse_id: wh.warehouse_id,
                        lot_name: wh.lot_name,
                    });
                });
            });
            if (detail_import.length === 0) {
                throw new Error("Vui lòng đầy đủ thông tin nhập kho");
            }
            const data: CreateImportDto = filterEmptyFields({
                note: note || "",
                detail_import: detail_import,
            });
            const result = await importStore.createImport(data);
            if (result) {
                fetchImportData({
                    ...importStore.pagination,
                });
                handleCloseCreateImportModal();
            }
        } catch (e: any) {
            console.error("Lỗi khi tạo phiếu nhập hàng", e);
            const errorMessage = e?.message || "Vui lòng nhập đầy đủ thông tin";
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const getColumnsImportConfig = ({
        defaultForm,
        isUpdate = false,
    }: {
        defaultForm: FormInstance;
        isUpdate: boolean;
    }) => {
        return [
            {
                title: "Biến thể",
                dataIndex: "skus_name",
                key: "skus_name",
                render: (_, record) => {
                    const skusId = Object.keys(record)?.[0];
                    const name = record[skusId]?.skus_name;

                    return (
                        <div className="w-full">
                            <Form.Item
                                name={["skus", skusId, "skus_name"]}
                                initialValue={name}
                                noStyle
                                hidden={true}
                            >
                                <Input
                                    type="text"
                                    className="w-full"
                                    disabled={true}
                                />
                            </Form.Item>
                            <Form.Item
                                name={["skus", skusId, "skus_id"]}
                                initialValue={skusId}
                                noStyle
                                hidden={true}
                            >
                                <Input
                                    type="text"
                                    className="w-full"
                                    disabled={true}
                                />
                            </Form.Item>

                            <Tooltip
                                title={<span>{name}</span>}
                                placement="topLeft"
                                trigger={["hover"]}
                                className="w-full"
                            >
                                <span className="text-sm overflow-hidden text-ellipsis max-w-full">
                                    {name}
                                </span>
                            </Tooltip>
                        </div>
                    );
                },
                width: "20%",
            },
            {
                title: "Giá nhập",
                dataIndex: "price_import",
                key: "price_import",
                render: (text, record, index) => (
                    <Form.Item
                        name={[
                            "skus",
                            Object.keys(record)?.[0],
                            "price_import",
                        ]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập giá nhập",
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập giá nhập"
                            min={0}
                        />
                    </Form.Item>
                ),
                width: "20%",
            },
            {
                title: "Thông tin chi tiết nhập kho (kho, số lượng, tên lô)",
                key: "warehouses",
                render: (text, record) => {
                    const skusId = Object.keys(record)[0];
                    return (
                        <Form.List name={["skus", skusId, "warehouses"]}>
                            {(fields, { add, remove }) => (
                                <div>
                                    {fields.map(
                                        ({ key, name, ...restField }) => {
                                            const currentWarehouses =
                                                defaultForm.getFieldValue([
                                                    "skus",
                                                    skusId,
                                                    "warehouses",
                                                ]) || [];
                                            const selectedWarehouseIds =
                                                currentWarehouses
                                                    .filter(
                                                        (wh, idx) =>
                                                            idx !== name &&
                                                            wh?.warehouse_id
                                                    )
                                                    .map(
                                                        (wh) => wh.warehouse_id
                                                    );

                                            // Lọc các kho chưa được chọn
                                            const availableWarehouses =
                                                warehouseStore.data.filter(
                                                    (item) =>
                                                        !selectedWarehouseIds.includes(
                                                            item.id
                                                        )
                                                );

                                            const detailImportId =
                                                currentWarehouses?.[name]
                                                    ?.detail_import_id;

                                            return (
                                                <div
                                                    key={key}
                                                    className="flex gap-2 mb-2 items-center"
                                                >
                                                    <div className="flex flex-col gap-2 w-full">
                                                        <div className="flex gap-2 w-full">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[
                                                                    name,
                                                                    "warehouse_id",
                                                                ]}
                                                                rules={[
                                                                    {
                                                                        required:
                                                                            true,
                                                                        message:
                                                                            "Vui lòng chọn kho",
                                                                    },
                                                                ]}
                                                                className="w-1/2"
                                                            >
                                                                <Select
                                                                    placeholder="Chọn kho"
                                                                    options={
                                                                        availableWarehouses?.map(
                                                                            (
                                                                                item
                                                                            ) => ({
                                                                                label: item.name,
                                                                                value: item.id,
                                                                            })
                                                                        ) || []
                                                                    }
                                                                    className="w-full"
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[
                                                                    name,
                                                                    "quantity_import",
                                                                ]}
                                                                rules={[
                                                                    {
                                                                        required:
                                                                            true,
                                                                        message:
                                                                            "Vui lòng nhập số lượng nhập",
                                                                    },
                                                                ]}
                                                                className="w-1/2"
                                                            >
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Nhập số lượng nhập"
                                                                    min={0}
                                                                    className="w-full"
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[
                                                                name,
                                                                "lot_name",
                                                            ]}
                                                            className="w-full"
                                                        >
                                                            <TextArea
                                                                placeholder="Nhập tên lô hàng"
                                                                className="w-full"
                                                                autoSize={{
                                                                    minRows: 1,
                                                                    maxRows: 3,
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </div>
                                                    <Button
                                                        type="link"
                                                        onClick={() =>
                                                            remove(name)
                                                        }
                                                        size="large"
                                                        icon={
                                                            <MinusCircleOutlined className="!text-xl" />
                                                        }
                                                    />

                                                    <Form.Item
                                                        name={[
                                                            name,
                                                            "detail_import_id",
                                                        ]}
                                                        noStyle
                                                        hidden={true}
                                                        initialValue={
                                                            detailImportId
                                                        }
                                                    >
                                                        <Input
                                                            type="text"
                                                            className="w-full"
                                                            disabled={true}
                                                        />
                                                    </Form.Item>
                                                </div>
                                            );
                                        }
                                    )}
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={
                                            <PlusCircleOutlined className="!text-xl" />
                                        }
                                    ></Button>
                                </div>
                            )}
                        </Form.List>
                    );
                },
                width: "60%",
            },
        ];
    };

    const [openVariantValueModal, setOpenVariantValueModal] = useState(false);
    const [variantValueForm] = Form.useForm();
    const handleCloseVariantValueModal = () => {
        setOpenVariantValueModal(false);
        setSelectedProducts([]);
        setSelectedSkus([]);
    };
    const handleSaveVariantValueModal = () => {
        setImportData((prev: any) => {
            const newData = selectedSkusData.map((item) => {
                return {
                    [item.id]: {
                        skus_name: item.name,
                        warehouse_id: "",
                        quantity_import: 0,
                        price_import: 0,
                        lot_name: "",
                    },
                };
            });
            return [...prev, ...newData];
        });
        setGlobalFilterImportData((prev) => ({
            ...prev,
            search: "",
        }));

        handleCloseVariantValueModal();
    };
    const getColumnProductShowConfig =
        (): ColumnsType<productTableFilterDataType> => {
            return [
                {
                    title: "Sản phẩm",
                    dataIndex: "title",
                    key: "title",
                    onFilter: (value, item) => {
                        return item.title
                            .toString()
                            .toLowerCase()
                            .includes(value.toString().toLowerCase());
                    },
                    filterDropdown: ({
                        setSelectedKeys,
                        selectedKeys,
                        confirm,
                        clearFilters,
                    }) => {
                        return (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={selectedKeys[0]}
                                    onChange={(e) => {
                                        setSelectedKeys(
                                            e.target.value
                                                ? [e.target.value]
                                                : []
                                        );
                                        confirm({ closeDropdown: false });
                                    }}
                                    style={{
                                        marginBottom: 8,
                                        display: "block",
                                    }}
                                />
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => confirm()}
                                        icon={<SearchOutlined />}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        Tìm
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (clearFilters) {
                                                setSelectedKeys([]);
                                                clearFilters();
                                                confirm({
                                                    closeDropdown: false,
                                                });
                                            }
                                        }}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        Xóa
                                    </Button>
                                </Space>
                            </div>
                        );
                    },
                    filterIcon: (filtered) => (
                        <SearchOutlined
                            style={{ color: filtered ? "#1890ff" : undefined }}
                        />
                    ),
                    filterSearch: true,
                    render: (
                        value: string,
                        item: productTableFilterDataType
                    ) => {
                        return (
                            <Tooltip
                                title={
                                    <div
                                        className={`flex items-center gap-4 justify-start`}
                                    >
                                        <div
                                            className={`w-14 h-14 shrink-0 flex justify-center items-center`}
                                        >
                                            <Image
                                                className="w-full h-full object-cover rounded-md"
                                                src={
                                                    item.images &&
                                                    item.images.length > 0
                                                        ? item.images[0]
                                                        : ""
                                                }
                                                fallback="/images/default_product_image.jpg"
                                            />
                                        </div>
                                        <div className="items-center justify-start p-0">
                                            {value}
                                        </div>
                                    </div>
                                }
                                placement="topLeft"
                                trigger={["hover"]}
                            >
                                <div
                                    className={`flex items-center gap-2 justify-start`}
                                >
                                    <div
                                        className={`w-14 h-14 shrink-0 flex justify-center items-center`}
                                    >
                                        <Image
                                            className="w-full h-full object-cover rounded-md"
                                            src={
                                                item.images &&
                                                item.images.length > 0
                                                    ? item.images[0]
                                                    : ""
                                            }
                                            fallback="/images/default_product_image.jpg"
                                        />
                                    </div>
                                    <div className="items-center justify-start p-0">
                                        {value}
                                    </div>
                                </div>
                            </Tooltip>
                        );
                    },
                    ellipsis: true,
                    width: "20%",
                },
                // Car Brand
                {
                    title: "Nhãn hàng",
                    dataIndex: "brand",
                    key: "brand",
                    render: (value) => {
                        return <span className="text-sm">{value?.name}</span>;
                    },
                    ellipsis: false,
                },
                // Car category
                {
                    title: "Loại xe",
                    dataIndex: "category",
                    key: "category",
                    render: (value) => {
                        return <span className="text-sm">{value?.name}</span>;
                    },
                    ellipsis: false,
                },
                {
                    title: "Tồn kho",
                    dataIndex: "totalStock",
                    key: "stock",
                    render: (value, item) => (
                        <span className="text-sm">{`${value} trong ${item?.totalSKU} biến thể`}</span>
                    ),
                    ellipsis: true,
                },
            ];
        };

    const getColumnVariantValueConfig =
        (): ColumnsType<SkusDataResponseType> => {
            return [
                {
                    title: "Biến thể",
                    dataIndex: "name",
                    key: "name",
                    onFilter: (value, item) => {
                        return item.name
                            .toString()
                            .toLowerCase()
                            .includes(value.toString().toLowerCase());
                    },
                    filterDropdown: ({
                        setSelectedKeys,
                        selectedKeys,
                        confirm,
                        clearFilters,
                    }) => {
                        return (
                            <div style={{ padding: 8 }}>
                                <Input
                                    placeholder="Tìm kiếm  biến thể"
                                    value={selectedKeys[0]}
                                    onChange={(e) => {
                                        setSelectedKeys(
                                            e.target.value
                                                ? [e.target.value]
                                                : []
                                        );
                                        confirm({ closeDropdown: false });
                                    }}
                                    style={{
                                        marginBottom: 8,
                                        display: "block",
                                    }}
                                />
                                <Space>
                                    <Button
                                        type="primary"
                                        onClick={() => confirm()}
                                        icon={<SearchOutlined />}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        Tìm
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (clearFilters) {
                                                setSelectedKeys([]);
                                                clearFilters();
                                                confirm({
                                                    closeDropdown: false,
                                                });
                                            }
                                        }}
                                        size="small"
                                        style={{ width: 90 }}
                                    >
                                        Xóa
                                    </Button>
                                </Space>
                            </div>
                        );
                    },
                    filterIcon: (filtered) => (
                        <SearchOutlined
                            style={{ color: filtered ? "#1890ff" : undefined }}
                        />
                    ),
                    filterSearch: true,
                    render: (value, item) => {
                        return (
                            <Tooltip
                                title={
                                    <div
                                        className={`flex items-center gap-4 justify-start`}
                                    >
                                        <div
                                            className={`w-14 h-14 shrink-0 flex justify-center items-center`}
                                        >
                                            <Image
                                                className="w-full h-full object-cover rounded-md"
                                                src={item?.image}
                                                fallback="/images/default_product_image.jpg"
                                            />
                                        </div>
                                        <div className="items-center justify-start p-0">
                                            {value}
                                        </div>
                                    </div>
                                }
                                placement="topLeft"
                                trigger={["hover"]}
                            >
                                <div
                                    className={`flex items-center gap-2 justify-start`}
                                >
                                    <div
                                        className={`w-14 h-14 shrink-0 flex justify-center items-center`}
                                    >
                                        <Image
                                            className="w-full h-full object-cover rounded-md"
                                            src={item?.image}
                                            fallback="/images/default_product_image.jpg"
                                        />
                                    </div>
                                    <div className="items-center justify-start p-0">
                                        {value}
                                    </div>
                                </div>
                            </Tooltip>
                        );
                    },
                    ellipsis: true,
                    width: "60%",
                },
                {
                    title: "Số lượng còn lại",
                    dataIndex: ["detail_import"],
                    key: "detail_import",
                    render: (value) => {
                        const quantity = value?.reduce(
                            (acc: number, item) =>
                                acc + item.quantity_remaining,
                            0
                        );
                        return <span className="text-sm">{quantity}</span>;
                    },
                },
            ];
        };
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [skusData, setSkusData] = useState<any[]>([]);
    const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
    const [availableSkus, setAvailableSkus] = useState<any[]>([]);
    const [selectedSkusData, setSelectedSkusData] = useState<any[]>([]);
    useEffect(() => {
        const selectedProductsData = filterProductData?.filter((item) =>
            selectedProducts.includes(item.id)
        );
        if (selectedProductsData) {
            const allSkus = selectedProductsData.flatMap((item) =>
                item.skus.map((sku) => ({
                    ...sku,
                }))
            );
            setSkusData(allSkus);

            // Lấy danh sách skus_id từ importData
            const selectedSkusIds = importData.map(
                (item) => Object.keys(item)[0]
            );

            // Lọc chỉ các skus chưa được chọn
            const availableSkus = allSkus.filter(
                (sku) => !selectedSkusIds.includes(sku.id)
            );
            setAvailableSkus(availableSkus);
        }
    }, [selectedProducts, importData]);

    const handleDeleteSelectedImport = () => {
        if (!selectedImport || selectedImport.length === 0) return;
        const newImportData = importData.filter(
            (item) => !selectedImport.includes(Object.keys(item)[0])
        );
        setImportData(newImportData);
        setSelectedImport([]);
    };

    const convertItemImportToTableImport = (data: ImportResponseType) => {
        const mapRes = new Map();
        for (const item of data.detail_imports) {
            const skus = item.skus;
            const warehouse = item.warehouse;
            const key = skus.id;
            if (!mapRes.has(key)) {
                mapRes.set(key, {
                    [key]: {
                        skus_id: skus.id,
                        skus_name: skus.name,
                        price_import: item.price_import,
                        quantity_import: item.quantity_import,
                        warehouses: [
                            {
                                warehouse_id: warehouse.id,
                                quantity_import: item.quantity_import,
                                detail_import_id: item.id,
                                lot_name: item.lot_name,
                            },
                        ],
                    },
                });
            } else {
                const existingItem = mapRes.get(key);
                existingItem[key].warehouses.push({
                    warehouse_id: warehouse.id,
                    quantity_import: item.quantity_import,
                    detail_import_id: item.id,
                    lot_name: item.lot_name,
                });
            }
        }

        return Array.from(mapRes.values());
    };

    const [importDetails, setImportDetails] = useState<
        {
            [skus_id: string]: SkusDetailImportDtoV2 & { skus_name: string };
        }[]
    >([]);
    const handleUpdateImportRecord = async (item: ImportResponseType) => {
        const { note } = item;
        const importDetails = convertItemImportToTableImport(toJS(item));
        setImportDetails(importDetails);
        updateImportForm.setFields([
            {
                name: "note",
                value: note,
            },
            {
                name: "skus",
                value: importDetails.reduce((acc, item) => {
                    const skusId = Object.keys(item)[0]; // Lấy skus_id từ key của object
                    acc[skusId] = item[skusId]; // Gán giá trị tương ứng vào object tích lũy
                    return acc;
                }, {}),
            },
        ]);
        setImportId(item.id);
        setOpenUpdateImportModal(true);
    };

    const handleDeleteImportRecord = async (id: string) => {
        try {
            const res = await importStore.deleteImport(id);
            if (res) {
                fetchImportData({
                    ...importStore.pagination,
                });
            }
        } catch (e: any) {
            const errorMessage =
                e?.message ||
                "Có lỗi xảy ra trong quá trình xóa phiếu nhập hàng, vui lòng thử lại sau";
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    const [openUpdateImportModal, setOpenUpdateImportModal] = useState(false);
    const [importId, setImportId] = useState<string | null>(null);
    const [updateImportForm] = Form.useForm();
    const handleCloseUpdateImportModal = () => {
        setOpenUpdateImportModal(false);
        setImportDetails([]);
        setImportId(null);
        setSelectedImport([]);
    };
    const handleSaveUpdateImportModal = async () => {
        try {
            if (!importId) {
                store.setStatusMessage(
                    400,
                    "Vui lòng chọn phiếu nhập hàng",
                    "",
                    false
                );
                return;
            }
            const values = await updateImportForm.validateFields();
            const { note, skus } = values;
            if (!skus || Object.keys(skus).length === 0) {
                store.setStatusMessage(
                    500,
                    "Vui lòng nhập đầy đủ thông tin",
                    "",
                    false
                );
                return;
            }
            const detail_imports: UpdateDetailImportDto[] = (
                Object.entries(skus) as [
                    string,
                    SkusDetailImportDtoV2 & {
                        skus_name: string;
                        detail_import_id: string;
                    },
                ][]
            ).flatMap(([skus_id, item]) => {
                return item.warehouses.map((wh) => ({
                    price_import: Number(item.price_import),
                    quantity_import: Number(wh.quantity_import),
                    warehouse_id: wh.warehouse_id,
                    lot_name: wh.lot_name,
                    detail_import_id: wh.detail_import_id,
                    skus_id: skus_id,
                }));
            });
            const data: UpdateImportDto = {
                note,
                detail_import: detail_imports,
            };
            const res = await importStore.updateImport(importId, data);
            if (res) {
                handleCloseUpdateImportModal();
                fetchImportData({
                    ...importStore.pagination,
                });
            }
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message || "Lỗi không xác định";
            store.setStatusMessage(500, errorMessage, "", false);
        }
    };

    return (
        <section className="w-full flex flex-col">
            <div className="w-full flex flex-col animate-slideDown">
                <div className="flex justify-between items-center">
                    <AdminBreadCrumb
                        description="Thông tin chi tiết về danh sách các đợt nhập hàng"
                        items={[...getBreadcrumbItems(location.pathname)]}
                    />
                    <Button
                        type="primary"
                        size="large"
                        className="!rounded-none"
                        onClick={() => {
                            setOpenModal(true);
                        }}
                    >
                        Tạo phiếu nhập hàng
                    </Button>
                </div>
            </div>
            <div className="w-full mt-4 mb-6 flex flex-col gap-4 px-4 pb-4 border border-gray-200 rounded-lg bg-white shadow-sm animate-slideUp">
                <CustomizeTab
                    items={[
                        {
                            key: "1",
                            label: "Tất cả phiếu nhập",
                            children: (
                                <div className="w-full mt-2">
                                    <ImportSearch
                                        setFilters={setGlobalFilterImportData}
                                        productsSelect={getProductSelect()}
                                        warehouseSelect={getWarehouseSelect()}
                                        skusSelect={skusDataSelect}
                                        globalFiltersImportDataType={
                                            globalFilterImportData
                                        }
                                    />
                                    <ImportTable
                                        data={importStore.data}
                                        handleUpdateImport={
                                            handleUpdateImportRecord
                                        }
                                        handleDeleteImport={
                                            handleDeleteImportRecord
                                        }
                                    />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            <CustomizeModal
                okText="Lưu"
                cancelText="Hủy"
                handleCloseModal={handleCloseCreateImportModal}
                handleSaveModal={handleSaveCreateImportModal}
                isOpen={openModal}
                key={"add"}
                width={1000}
                title="Tạo phiếu nhập hàng"
                forceRender
            >
                <Form
                    form={createImportForm}
                    layout="vertical"
                    labelWrap
                    className="w-full mt-2"
                    preserve={false}
                >
                    <Row gutter={[16, 0]}>
                        <Col span={24}>
                            <Form.Item label="Ghi chú" name="note">
                                <Input.TextArea
                                    placeholder="Nhập ghi chú"
                                    autoSize={{ minRows: 6, maxRows: 6 }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <span className="text-[red]">* </span>
                                        <span>Biến thể nhập</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="px-2 py-2 bg-[#F0483E] text-[#FFFFFF] text-xs flex font-bold items-center focus:outline-none focus:opacity-80 hover:opacity-80 rounded-full animate-bounce border-none cursor-pointer"
                                            onClick={handleDeleteSelectedImport}
                                        >
                                            <DeleteOutlined className="text-xl" />
                                        </button>
                                        <button
                                            type="button"
                                            className="px-2 py-2 bg-[#F0483E] text-[#FFFFFF] text-xs flex font-bold items-center focus:outline-none focus:opacity-80 hover:opacity-80 rounded-full animate-bounce border-none cursor-pointer"
                                            onClick={() => {
                                                setOpenVariantValueModal(true);
                                            }}
                                        >
                                            <Add size="20" />
                                        </button>
                                    </div>
                                </div>
                                <Table
                                    locale={{
                                        ...AntdTableLocale,
                                    }}
                                    columns={getColumnsImportConfig({
                                        isUpdate: false,
                                        defaultForm: createImportForm,
                                    })}
                                    dataSource={importData}
                                    rowKey={(item) => Object.keys(item)[0]}
                                    pagination={false}
                                    style={{
                                        border: "none",
                                    }}
                                    size="small"
                                    className="py-2"
                                    rowSelection={{
                                        onChange: (selectedRowKeys) => {
                                            setSelectedImport(
                                                selectedRowKeys as string[]
                                            );
                                        },
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                </Form>
            </CustomizeModal>

            <CustomizeModal
                okText="Thêm"
                cancelText="Hủy"
                handleCloseModal={handleCloseVariantValueModal}
                handleSaveModal={handleSaveVariantValueModal}
                isOpen={openVariantValueModal}
                key={"variantValue"}
                width={700}
                title="Thêm biến thể nhập hàng"
                forceRender
            >
                <Form
                    form={variantValueForm}
                    layout="vertical"
                    labelWrap
                    className="w-full mt-2 flex flex-col gap-4"
                >
                    <Table
                        locale={{
                            ...AntdTableLocale,
                        }}
                        columns={getColumnProductShowConfig()}
                        rowSelection={{
                            onChange: (selectedRowKeys) => {
                                setSelectedProducts(
                                    selectedRowKeys as string[]
                                );
                            },
                        }}
                        dataSource={filterProductData}
                        rowKey={(item: productTableFilterDataType) => item.id}
                        scroll={{ y: "200px" }}
                        pagination={false}
                        size="middle"
                    />

                    {skusData?.length > 0 && (
                        <Table
                            locale={{
                                ...AntdTableLocale,
                            }}
                            columns={getColumnVariantValueConfig()}
                            dataSource={availableSkus || []}
                            rowKey={(item: any) => item.id}
                            scroll={{ y: "200px" }}
                            pagination={false}
                            rowSelection={{
                                onChange: (selectedRowKeys) => {
                                    setSelectedSkus(
                                        selectedRowKeys as string[]
                                    );
                                    const selectedSkusData = skusData?.filter(
                                        (item) =>
                                            selectedRowKeys.includes(item.id)
                                    );
                                    setSelectedSkusData(selectedSkusData || []);
                                },
                            }}
                            size="middle"
                        />
                    )}
                </Form>
            </CustomizeModal>

            <CustomizeModal
                okText="Lưu"
                cancelText="Hủy"
                handleCloseModal={handleCloseUpdateImportModal}
                handleSaveModal={handleSaveUpdateImportModal}
                isOpen={openUpdateImportModal}
                key={"update"}
                width={1000}
                title="Cật nhật phiếu nhập hàng"
                forceRender
            >
                <Form
                    form={updateImportForm}
                    layout="vertical"
                    labelWrap
                    className="w-full mt-2"
                    preserve={true}
                >
                    <Row gutter={[16, 0]}>
                        <Col span={24}>
                            <Form.Item label="Ghi chú" name="note">
                                <Input.TextArea
                                    placeholder="Nhập ghi chú"
                                    autoSize={{ minRows: 6, maxRows: 6 }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between w-full">
                                    <div>
                                        <span className="text-[red]">* </span>
                                        <span>Biến thể nhập</span>
                                    </div>
                                </div>
                                <Table
                                    locale={{
                                        ...AntdTableLocale,
                                    }}
                                    columns={getColumnsImportConfig({
                                        isUpdate: true,
                                        defaultForm: updateImportForm,
                                    })}
                                    dataSource={importDetails || []}
                                    rowKey={(item) => {
                                        if (
                                            !item ||
                                            typeof item !== "object" ||
                                            Object.keys(item).length === 0
                                        ) {
                                            return (
                                                "invalid-key-" +
                                                generateUUIDV4()
                                            );
                                        }
                                        return Object.keys(item)[0];
                                    }}
                                    pagination={false}
                                    style={{
                                        border: "none",
                                    }}
                                    size="small"
                                    className="py-2"
                                />
                            </div>
                        </Col>
                    </Row>
                </Form>
            </CustomizeModal>
        </section>
    );
};

export default observer(ImportPage);
