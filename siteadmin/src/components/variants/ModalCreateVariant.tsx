import { Col, Form, FormInstance, Image, Input, Row, Select } from "antd";
import CustomizeModal from "../common/CustomizeModal";
import {
    FormValueCreateVariantType,
    OptionValueOfProductType,
} from "src/pages/variants";
import "./ModalCreateVariant.css";
import { useCallback, useEffect, useState } from "react";
import {
    convertBase64ToFile,
    filterEmptyFields,
    generateUUIDV4,
    getErrorMessage,
} from "src/utils";
import { useStore } from "src/stores";
import { AcceptImageTypes } from "src/constants";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { SelectType } from "../products/detail/ModalCreateProduct/ModalCreateProduct.type";
import { observer } from "mobx-react-lite";
import { reaction } from "mobx";
import {
    SkusDetailImportDto,
    VariantCombinationDto,
} from "src/types/product.type";
import { CreateSkusDto, UpdateSkusDto } from "src/types/skus.type";
import BaseAPI from "src/api/base";
interface ModalCreateVariantProps {
    defaultForm: FormInstance;
    open?: boolean;
    onClose?: () => void;
    onSubmit?: () => Promise<void>;
    warehouseOption?: SelectType[];
    [key: string]: any;
}

const ModalCreateVariant: React.FC<ModalCreateVariantProps> = ({
    defaultForm,
    open = false,
    onClose = () => {},
    onSubmit = () => {},
    warehouseOption = [],
    ...props
}) => {
    const store = useStore();
    const { skusObservable: skusStore } = store;
    const handleUploadVariantImage = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            store.setStatusMessage(
                400,
                "Kích thước ảnh không được vượt quá 2MB",
                "",
                false
            );
            return;
        }
        if (!AcceptImageTypes.includes(file.type)) {
            store.setStatusMessage(
                400,
                "Chỉ chấp nhận các định dạng hình ảnh: " +
                    AcceptImageTypes.join(", "),
                "",
                false
            );
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const imageUrl = reader.result as string;
            defaultForm.setFieldsValue({
                image: imageUrl,
            });
            defaultForm.validateFields(["image"]);
            skusStore.setImage(imageUrl);
        };
        reader.onerror = () => {
            store.setStatusMessage(
                400,
                `Có lỗi xảy ra trong quá trình tải ảnh`,
                "",
                false
            );
        };

        reader.readAsDataURL(file);
    };
    const [inputFileKey, setInputFileKey] = useState<string>(generateUUIDV4());

    const [profit, setProfit] = useState<number>(0);
    const [profitPercent, setProfitPercent] = useState<number>(0);
    const [warehouseAvailable, setWarehouseAvailable] =
        useState<SelectType[]>(warehouseOption);

    useEffect(() => {
        if (warehouseOption.length > 0) {
            setWarehouseAvailable(warehouseOption);
        }
    }, [warehouseOption]);

    useEffect(() => {
        if (props?.isUpdate && open) {
            const currentWarehousesSelected: string[] =
                defaultForm.getFieldValue("detail_import")?.warehouses;
            const currentWarehousesSelectedOption = warehouseOption.filter(
                (item) => {
                    return currentWarehousesSelected?.some((selected) => {
                        return selected === item.value;
                    });
                }
            );
            setWarehouseSelected(currentWarehousesSelectedOption);

            const imageUrl = defaultForm.getFieldValue("image");
            skusStore.setImage(imageUrl || "");
            const priceSold = Number(
                defaultForm.getFieldValue("price_sold") ?? 0
            );
            const priceImport = Number(
                defaultForm.getFieldValue("price_import") ?? 0
            );
            if (
                priceSold !== null &&
                priceSold !== undefined &&
                priceImport !== null &&
                priceImport !== undefined
            ) {
                const profit = priceSold - priceImport;
                const profitPercent =
                    priceSold !== 0 ? (profit / priceSold) * 100 : 0;
                setProfit(profit);
                setProfitPercent(profitPercent);
            } else {
                setProfit(0);
                setProfitPercent(0);
            }
        }
    }, [props?.isUpdate, open]);

    useEffect(() => {
        reaction(
            () => skusStore.image,
            (image) => {
                if (image) {
                    defaultForm.setFieldsValue({
                        image: image,
                    });
                }
            }
        );
    }, []);
    const [warehouseSelected, setWarehouseSelected] = useState<SelectType[]>(
        []
    );
    const handleFormValuesChange = (changeValues: any, allValues: any) => {
        const priceSold = Number(allValues["price_sold"] ?? 0);
        const priceImport = Number(allValues["price_import"] ?? 0);
        if (
            priceSold !== null &&
            priceSold !== undefined &&
            priceImport !== null &&
            priceImport !== undefined
        ) {
            const profit = priceSold - priceImport;
            const profitPercent =
                priceSold !== 0 ? (profit / priceSold) * 100 : 0;
            setProfit(profit);
            setProfitPercent(profitPercent);
        } else {
            setProfit(0);
            setProfitPercent(0);
        }

        const warehouse_selected: string[] =
            allValues["detail_import"]?.warehouses;

        if (warehouse_selected) {
            setWarehouseSelected(
                warehouseOption.filter((item) =>
                    warehouse_selected?.includes(item.value)
                )
            );
        }
    };

    useEffect(() => {
        if (warehouseSelected && warehouseSelected.length > 0) {
            const newWarehouse = warehouseOption.filter((item) => {
                return !warehouseSelected.some((selected) => {
                    return selected.value === item.value;
                });
            });
            setWarehouseAvailable(newWarehouse);
        } else {
            setWarehouseAvailable(warehouseOption);
        }
    }, [warehouseSelected]);
    const handleSubmit = async () => {
        try {
            store.setLoading(true);
            const formValue: FormValueCreateVariantType =
                await defaultForm.validateFields();
            const optionValue: VariantCombinationDto[] = formValue.optionValue
                ? Object.entries(formValue.optionValue).map(([key, value]) => {
                      return {
                          option_id: key,
                          value: value,
                      } as VariantCombinationDto;
                  })
                : [];
            let uploadImage: string;

            // Kiểm tra xem ảnh có phải là base64 hay không
            if (formValue.image && formValue.image.startsWith("data:image")) {
                const convertImageFile = await convertBase64ToFile(
                    formValue.image,
                    `${Date.now().toString()}.jpeg`
                );
                const uploadData = await BaseAPI.uploadImagesToServer([
                    convertImageFile,
                ]);
                if ("path" in uploadData) {
                    const { message } = uploadData;
                    const errorMessage = Array.isArray(message)
                        ? message.join(", ")
                        : message;
                    throw new Error(errorMessage);
                }
                uploadImage = uploadData.map((data) => data.url)[0];
                if (!uploadImage) {
                    throw new Error("Upload ảnh không thành công");
                }
            } else {
                uploadImage = formValue.image;
                if (!uploadImage) {
                    throw new Error("Không có ảnh được cung cấp");
                }
            }
            if (props?.isUpdate) {
                const id = props.sku_id;
                if (!id) {
                    throw new Error("Không tìm thấy id biến thể khi cật nhật");
                }
                const updateSkusData: UpdateSkusDto = filterEmptyFields({
                    barcode: formValue.barcode,
                    image: uploadImage,
                    masku: formValue.masku,
                    price_compare: Number(formValue.price_compare),
                    price_sold: Number(formValue.price_sold),
                    variant_combinations: optionValue,
                    product_id: props?.productId,
                });
                const res = await skusStore.update(id, updateSkusData);
                if (res) {
                    store.setStatusMessage(
                        200,
                        "Cập nhật biến thể thành công",
                        "",
                        true
                    );
                    onSubmit();
                    handleClose();
                }
            } else {
                const price_import = formValue.price_import;
                const detailImport = (
                    Object.entries(formValue.detail_import) as unknown as [
                        string,
                        {
                            quantity_import: string;
                            lot_name: string;
                        },
                    ][]
                )
                    .map(([key, value]) => {
                        if (key === "warehouses") {
                            return null;
                        }
                        return filterEmptyFields({
                            warehouse_id: key,
                            price_import: Number(price_import),
                            quantity_import: Number(value.quantity_import),
                            lot_name: value.lot_name,
                        }) as SkusDetailImportDto;
                    })
                    .filter(Boolean);
                const createSkusData: CreateSkusDto = filterEmptyFields({
                    product_id: props?.productId,
                    masku: formValue.masku,
                    barcode: formValue.barcode,
                    image: uploadImage,
                    price_sold: Number(formValue.price_sold),
                    price_compare: Number(formValue.price_compare),
                    variant_combinations: optionValue,
                    detail_import: detailImport,
                });
                const res = await skusStore.create(createSkusData);
                if (res) {
                    store.setStatusMessage(
                        200,
                        "Tạo biến thể thành công",
                        "",
                        true
                    );
                    onSubmit();
                    handleClose();
                }
            }
        } catch (e) {
            console.log("error", e);
            const errorMessage = getErrorMessage(
                e,
                "Lỗi trong quá trình tạo hoặc sửa biến thể, vui lòng thử lại sau"
            );
            store.setStatusMessage(500, errorMessage, "", false);
        } finally {
            store.setLoading(false);
        }
    };

    const handleClose = () => {
        defaultForm.resetFields();
        skusStore.setImage("");
        setProfit(0);
        setProfitPercent(0);
        setWarehouseAvailable(warehouseOption);
        setWarehouseSelected([]);
        setInputFileKey("");
        onClose();
    };

    const handleClearWarehouse = () => {
        defaultForm.resetFields(["detail_import", "warehouses"]);
    };

    const handleDeSelectWarehouse = useCallback(
        (value: string) => {
            const currentWarehouses =
                defaultForm.getFieldValue(["detail_import", "warehouses"]) ||
                [];
            const currentDetailImport =
                defaultForm.getFieldValue("detail_import");

            if (
                !currentWarehouses ||
                !Array.isArray(currentWarehouses) ||
                !value
            )
                return;
            const newWarehouses = currentWarehouses.filter(
                (item: any) => item.warehouses !== value
            );
            delete currentDetailImport[value];
            currentDetailImport.warehouses = newWarehouses;
            defaultForm.setFieldsValue({
                detail_import: currentDetailImport,
            });
            defaultForm
                .validateFields(["detail_import", "warehouses"])
                .catch(() => {});
        },
        [defaultForm]
    );
    const getTitleModal = () => {
        if (props?.isUpdate) {
            return `Cập nhật biến thể ${defaultForm.getFieldValue("name")}`;
        }
        return `Tạo biến thể của sản phẩm ${defaultForm.getFieldValue("title")}`;
    };

    const hasOption = useCallback(() => {
        const options = defaultForm.getFieldValue("options");
        return Array.isArray(options) && options.length > 0;
    }, [defaultForm]);

    const getOption = useCallback(() => {
        const options = defaultForm.getFieldValue("options");
        if (Array.isArray(options) && options.length > 0) {
            return options;
        }
        return [];
    }, [defaultForm]);

    return (
        <CustomizeModal
            {...props}
            title={getTitleModal()}
            width={800}
            isOpen={open}
            cancelText="Hủy bỏ"
            okText="Lưu"
            handleCloseModal={handleClose}
            handleSaveModal={handleSubmit}
            className="modal-create-variant"
            forceRender
        >
            <Form
                form={defaultForm}
                layout="vertical"
                className="w-full flex flex-col gap-4"
                onFinish={handleSubmit}
                onValuesChange={handleFormValuesChange}
                autoComplete="off"
            >
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4 bg-white rounded-md p-4 mt-2">
                        <h2
                            className="text-base text-gray-900 font-semibold shadow-sm !m-0 pb-2"
                            style={{
                                borderBottom: "1px solid #eaeaea",
                            }}
                        >
                            <span>Các thuộc tính</span>
                        </h2>
                        <Row gutter={16} align={"top"}>
                            {hasOption() && (
                                <Col xl={18} lg={18} md={18} xs={24}>
                                    {getOption()?.map(
                                        (option: OptionValueOfProductType) => {
                                            return (
                                                <Form.Item
                                                    key={option.id}
                                                    label={option.name}
                                                    name={[
                                                        "optionValue",
                                                        option.id,
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng nhập giá trị",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder={`Nhập ${option.name}`}
                                                        className="w-full"
                                                    />
                                                </Form.Item>
                                            );
                                        }
                                    )}
                                </Col>
                            )}
                            <Col
                                xl={hasOption() ? 6 : 24}
                                lg={hasOption() ? 6 : 24}
                                md={hasOption() ? 6 : 24}
                                xs={24}
                            >
                                <Form.Item
                                    label="Ảnh biến thể"
                                    name="image"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Vui lòng chọn ảnh",
                                        },
                                    ]}
                                >
                                    <div>
                                        {skusStore.image &&
                                        skusStore.image !== "" ? (
                                            <div className="flex justify-center items-center relative">
                                                <Image
                                                    src={skusStore.image}
                                                    alt="Variant"
                                                    width={"100%"}
                                                    style={{
                                                        objectFit: "cover",
                                                    }}
                                                    className="!rounded-md !h-32"
                                                    fallback="/images/default_product_image.jpg"
                                                />
                                                <label
                                                    className="absolute -top-10 right-0 w-8 h-8 flex justify-center items-center hover:bg-red-100 rounded-md cursor-pointer"
                                                    onClick={(e) => {
                                                        {
                                                            skusStore.setImage(
                                                                ""
                                                            );
                                                            defaultForm.setFieldsValue(
                                                                {
                                                                    image: "",
                                                                }
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <DeleteOutlined className="text-red-600 cursor-pointer text-base" />
                                                </label>
                                            </div>
                                        ) : (
                                            <label
                                                htmlFor="imageUpload"
                                                className="cursor-pointer h-32 rounded-md text-sm flex justify-center items-center"
                                                style={{
                                                    border: "1px solid #d9d9d9",
                                                }}
                                            >
                                                <span className="flex items-center justify-center">
                                                    <UploadOutlined className="mr-1" />
                                                    Tải ảnh lên
                                                </span>
                                                <input
                                                    type="file"
                                                    id="imageUpload"
                                                    accept="image/*"
                                                    key={inputFileKey}
                                                    multiple={false}
                                                    onChange={
                                                        handleUploadVariantImage
                                                    }
                                                    className="!hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>

                    <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                        <h2
                            className="text-base text-gray-900 font-semibold shadow-sm !m-0 pb-2"
                            style={{
                                borderBottom: "1px solid #eaeaea",
                            }}
                        >
                            <span>Thông tin giá</span>
                        </h2>
                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="Giá bán"
                                    name={"price_sold"}
                                    tooltip="Số tiền khách hàng cần thanh toán"
                                    required
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                const convertNumber =
                                                    Number(value);
                                                if (
                                                    isNaN(convertNumber) ||
                                                    convertNumber < 0
                                                ) {
                                                    return Promise.reject(
                                                        new Error(
                                                            "Vui lòng nhập giá bán hợp lệ"
                                                        )
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Nhập giá bán"
                                        className="w-full h-10"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                <Form.Item
                                    label="Giá so sánh"
                                    name={"price_compare"}
                                    required
                                    tooltip="Số tiền chưa giảm giá, thể hiện giá trị giảm giá, ưu đãi cho khách hàng"
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                const convertNumber =
                                                    Number(value);
                                                if (
                                                    isNaN(convertNumber) ||
                                                    convertNumber < 0
                                                ) {
                                                    return Promise.reject(
                                                        new Error(
                                                            "Vui lòng nhập giá so sánh hợp lệ"
                                                        )
                                                    );
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder="Nhập giá so sánh"
                                        type="number"
                                        className="w-full h-10"
                                        autoComplete="off"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <>
                        <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                            <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                                Quản lý tồn kho
                            </h2>
                            {!props?.isUpdate && (
                                <Row gutter={24} align={"middle"}>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <Form.Item
                                            label="Giá vốn"
                                            name={"price_import"}
                                            required
                                            tooltip={{
                                                title: "Giá vốn - Giá nhập vào của sản phẩm",
                                            }}
                                            rules={[
                                                {
                                                    validator: (_, value) => {
                                                        const convertNumber =
                                                            Number(value);
                                                        if (
                                                            isNaN(
                                                                convertNumber
                                                            ) ||
                                                            convertNumber < 0
                                                        ) {
                                                            return Promise.reject(
                                                                new Error(
                                                                    "Vui lòng nhập giá nhập hợp lệ"
                                                                )
                                                            );
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder="Nhập giá vốn"
                                                className="w-full h-10"
                                                autoComplete="off"
                                                type="number"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={12}
                                        lg={12}
                                        xl={12}
                                    >
                                        <div className="flex gap-6 justify-start items-center w-full">
                                            <div className="flex flex-col gap-2">
                                                <span>Biên lợi nhuận</span>
                                                <span className="text-[#8c7f7f] text-base">
                                                    {profitPercent.toFixed(2)}%
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span>Lợi nhuận</span>
                                                <span className="text-[#808080] text-base">
                                                    {profit.toLocaleString(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            )}

                            <Row gutter={24}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="SKU"
                                        name={"masku"}
                                        required
                                        tooltip={
                                            "SKU - Mã sản phẩm cho mỗi sản phẩm nên là duy nhất, và bao gồm cả chữ và số"
                                        }
                                        rules={[
                                            {
                                                validator: (_, value) => {
                                                    if (!value) {
                                                        return Promise.reject(
                                                            new Error(
                                                                "Vui lòng nhập mã sku"
                                                            )
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập mã sku"
                                            className="w-full h-10"
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Form.Item
                                        label="Barcode"
                                        name={"barcode"}
                                        required
                                        tooltip="Barcode - Mã vạch thường được Nhà sản xuất tạo ra"
                                        rules={[
                                            {
                                                validator: (_, value) => {
                                                    if (!value) {
                                                        return Promise.reject(
                                                            new Error(
                                                                "Vui lòng nhập mã barcode"
                                                            )
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập mã barcode"
                                            className="w-full h-10"
                                            autoComplete="off"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {!props?.isUpdate && (
                                <>
                                    <Row>
                                        <Col flex={"100%"}>
                                            <Form.Item
                                                label="Tồn kho khả dụng"
                                                required
                                                name={[
                                                    "detail_import",
                                                    "warehouses",
                                                ]}
                                                className="w-full"
                                                tooltip={
                                                    "Các kho hàng có sẵn và đang trong quá trình hoạt động"
                                                }
                                                rules={[
                                                    {
                                                        validator: (
                                                            _,
                                                            value
                                                        ) => {
                                                            if (
                                                                !value ||
                                                                value.length ===
                                                                    0
                                                            ) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        "Vui lòng chọn kho hàng"
                                                                    )
                                                                );
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Chọn kho lưu trữ hàng"
                                                    showSearch
                                                    mode="multiple"
                                                    allowClear
                                                    options={
                                                        warehouseAvailable || []
                                                    }
                                                    onClear={
                                                        handleClearWarehouse
                                                    }
                                                    onDeselect={
                                                        handleDeSelectWarehouse
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {warehouseSelected.length > 0 && (
                                        <>
                                            <div
                                                style={{
                                                    borderBottom:
                                                        "1px solid #d9d9d9",
                                                    paddingBottom: "1rem",
                                                }}
                                            >
                                                <Row gutter={24} align={"top"}>
                                                    <Col
                                                        sm={24}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <span>Kho hàng</span>
                                                    </Col>
                                                    <Col
                                                        sm={24}
                                                        md={12}
                                                        lg={12}
                                                        xl={12}
                                                    >
                                                        <span>
                                                            Tồn đầu kì & Tên lô
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </div>
                                            {warehouseSelected.map(
                                                (item: SelectType, index) => {
                                                    return (
                                                        <Row
                                                            gutter={24}
                                                            key={index}
                                                            align={"top"}
                                                        >
                                                            <Col
                                                                sm={24}
                                                                md={12}
                                                                lg={12}
                                                                xl={12}
                                                            >
                                                                <span>
                                                                    {item.label}
                                                                </span>
                                                            </Col>
                                                            <Col
                                                                sm={24}
                                                                md={12}
                                                                lg={12}
                                                                xl={12}
                                                            >
                                                                <div className="flex flex-col gap-2">
                                                                    <Form.Item
                                                                        name={[
                                                                            "detail_import",
                                                                            item.value,
                                                                            "quantity_import",
                                                                        ]}
                                                                        rules={[
                                                                            {
                                                                                validator:
                                                                                    (
                                                                                        _,
                                                                                        value
                                                                                    ) => {
                                                                                        if (
                                                                                            !value
                                                                                        ) {
                                                                                            return Promise.reject(
                                                                                                new Error(
                                                                                                    `Vui lòng nhập số lượng hàng`
                                                                                                )
                                                                                            );
                                                                                        }
                                                                                        return Promise.resolve();
                                                                                    },
                                                                            },
                                                                        ]}
                                                                    >
                                                                        <Input
                                                                            placeholder="Nhập số lượng"
                                                                            className="w-full h-10"
                                                                            autoComplete="off"
                                                                            type="number"
                                                                        />
                                                                    </Form.Item>
                                                                    <Form.Item
                                                                        name={[
                                                                            "detail_import",
                                                                            item.value,
                                                                            "lot_name",
                                                                        ]}
                                                                    >
                                                                        <Input
                                                                            placeholder="Nhập tên lô"
                                                                            className="w-full h-10"
                                                                            autoComplete="off"
                                                                        />
                                                                    </Form.Item>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    );
                                                }
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                </div>
            </Form>
        </CustomizeModal>
    );
};

export default observer(ModalCreateVariant);
