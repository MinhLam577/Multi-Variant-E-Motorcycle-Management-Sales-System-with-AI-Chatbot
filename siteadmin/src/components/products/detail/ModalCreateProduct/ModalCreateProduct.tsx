import {
    Button,
    Col,
    Form,
    FormInstance,
    Image,
    Input,
    Row,
    Select,
    Table,
    TreeSelect,
    Upload,
    UploadFile,
} from "antd";
import CustomizeModal from "../../../common/CustomizeModal";
import "./ModalCreateProduct.css";
import { useStore } from "src/stores";
import ReactQuill from "react-quill";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomizeEditor from "../../../common/CustomizeEditor";
import { observer } from "mobx-react-lite";
import {
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { action, makeAutoObservable, observable, reaction, toJS } from "mobx";
import { ColumnsType } from "antd/es/table";
import {
    convertBase64ToFile,
    filterEmptyFields,
    generateUUIDV4,
    getBase64,
} from "src/utils";
import debounce from "lodash.debounce";
import { AcceptImageTypes } from "src/constants";
import BaseAPI from "src/api/base";
import {
    CreateProductDto,
    CreateProductSpecificationDto,
    CreateSkusDto,
    EnumProductStore,
    EnumProductType,
    SkusDetailImportDto,
    UpdateProductDto,
    VariantCombinationDto,
} from "src/stores/product.store";
import { ResponseImage } from "src/api";
import FormListSelectOrInput from "../FormListSelectOrInput";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

export type TreeSelectType = {
    title: string;
    value: string;
    children?: TreeSelectType[];
};

export type SelectType = {
    label: string;
    value: string;
};

export const DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT = 5;

export interface IModalCreateProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    loadingData?: () => Promise<void>;
    okText?: string;
    cancelText?: string;
    title?: string;
    formInitialValues?: Record<string, any>;
    form: FormInstance;
    subForm: FormInstance;
    categorySelectData: TreeSelectType[];
    brandSelectData: SelectType[];
    warehouseSelectData: SelectType[];
    optionSelectData: SelectType[];
    productId?: string;
    messageWhenSave?: string;
}

export interface IVariantCombination {
    name: string;
    details: { option_id: string; value: string }[];
}

export interface IFormListRowData {
    name: string;
    values: {
        value: string;
    }[];
}

export interface IFormSkuCustomData {
    name: string;
    price_sold?: number;
    price_compare?: number;
    price_import?: number;
    barcode?: string;
    masku?: string;
    image?: string;
    variant_combinations?: VariantCombinationDto[];
    detail_import?: Array<{
        warehouse_id: string;
        quantity_import: number;
        lot_name: string;
    }>;
}

export interface ISkuCustomInputData {
    price_sold?: string;
    price_compare?: string;
    price_import?: string;
    barcode?: string;
    masku?: string;
    image?: string;
    variant_combinations?: VariantCombinationDto[];
    detail_import?: Array<{
        warehouse_id: string;
        quantity_import: string;
        lot_name: string;
    }>;
}

export class ModalCreateProductStore {
    price_import: number = 0;
    price_compare: number = 0;
    price_sold: number = 0;
    barcode: string = "";
    masku: string = "";
    initialWareHouseOptions: SelectType[] = [];
    warehouse_selected: SelectType[] = [];
    warehouse_selected_quantities: {
        warehouse_id: string;
        quantity_import: number;
    }[] = [];
    form_variant_value: { variants?: IFormListRowData[] } = {};
    skuCustomData: Map<string, Omit<IFormSkuCustomData, "name">> = new Map();
    skusNameSelected: string;
    showSpecForm: boolean = false;
    showVariantForm: boolean = false;
    constructor() {
        makeAutoObservable(
            this,
            {
                skuCustomData: observable,
                setSkuCustomData: action,
            },
            {
                autoBind: true,
            }
        );
        reaction(
            () => [
                this.barcode,
                this.masku,
                this.price_import,
                this.price_compare,
                this.price_sold,
            ],
            (
                [
                    newBarcode,
                    newMasku,
                    newPriceImport,
                    newPriceCompare,
                    newPriceSold,
                ],
                [
                    oldBarcode,
                    oldMasku,
                    oldPriceImport,
                    oldPriceCompare,
                    oldPriceSold,
                ]
            ) => {
                if (newBarcode !== oldBarcode)
                    this.syncSkusWithField("barcode", newBarcode);
                if (newMasku !== oldMasku)
                    this.syncSkusWithField("masku", newMasku);
                if (newPriceImport !== oldPriceImport)
                    this.syncSkusWithField("price_import", newPriceImport);
                if (newPriceCompare !== oldPriceCompare)
                    this.syncSkusWithField("price_compare", newPriceCompare);
                if (newPriceSold !== oldPriceSold)
                    this.syncSkusWithField("price_sold", newPriceSold);
            }
        );
    }

    setWarehouseSelected(value: SelectType[]) {
        if (!Array.isArray(value)) {
            return;
        }
        this.warehouse_selected = value;
    }
    setShowSpecForm(value: boolean) {
        if (typeof value === "boolean") this.showSpecForm = value;
    }
    setShowVariantForm(value: boolean) {
        if (typeof value === "boolean") {
            this.showVariantForm = value;
        }
    }
    setWarehouse_selected_quantities(
        quantity_import: string = "0",
        warehouse_id: string
    ) {
        let convertQuantity: number = 0;
        try {
            convertQuantity = Number(quantity_import);
            if (isNaN(convertQuantity)) throw new Error("");
        } catch (e) {
            convertQuantity = 0;
        }
        if (warehouse_id) {
            const existingWarehouse = this.warehouse_selected_quantities.find(
                (wh) => wh.warehouse_id === warehouse_id
            );

            if (!existingWarehouse)
                this.warehouse_selected_quantities.push({
                    warehouse_id: warehouse_id,
                    quantity_import: convertQuantity,
                });
            else {
                existingWarehouse.quantity_import = convertQuantity;
            }

            Array.from(this.skuCustomData.keys()).forEach((name) => {
                const currentCustomData = toJS(this.skuCustomData.get(name));
                if (!currentCustomData) {
                    return;
                }
                const currentDetailImport = currentCustomData.detail_import;
                // Tạo detail_import mới, giữ nguyên dữ liệu hiện có
                const updatedDetailImport =
                    this.warehouse_selected_quantities.map((wh) => {
                        // Tìm mục hiện có trong detail_import cho warehouse_id
                        const existingDetail = currentDetailImport.find(
                            (d) => d.warehouse_id === wh.warehouse_id
                        );

                        if (existingDetail) {
                            // Giữ nguyên quantity_import và price_import hiện có
                            return {
                                warehouse_id: wh.warehouse_id,
                                quantity_import: existingDetail.quantity_import,
                                lot_name: existingDetail.lot_name,
                            };
                        }

                        // Thêm mục mới cho kho chưa có
                        return {
                            warehouse_id: wh.warehouse_id,
                            quantity_import: wh.quantity_import || 0,
                            lot_name:
                                currentDetailImport.find(
                                    (d) => d.warehouse_id === wh.warehouse_id
                                )?.lot_name || "",
                        };
                    });
                // Cập nhật skuCustomData với detail_import mới
                this.setSkuCustomData(name, {
                    detail_import: updatedDetailImport.map((d) => ({
                        warehouse_id: d.warehouse_id,
                        quantity_import: String(d.quantity_import),
                        lot_name: d.lot_name,
                    })),
                });
            });
        }
    }

    syncSkusWithField(
        field:
            | "price_import"
            | "price_compare"
            | "price_sold"
            | "barcode"
            | "masku",
        value: number | string
    ) {
        Array.from(this.skuCustomData.keys()).forEach((name, index) => {
            const currentCustomData = toJS(this.skuCustomData.get(name));
            if (!currentCustomData) return;

            if (field === "barcode" || field === "masku") {
                const currentValue = currentCustomData?.[field];
                this.setSkuCustomData(name, {
                    [field]: currentValue
                        ? currentValue
                        : `${value}-${index + 1}`,
                });
            } else {
                const currentValue = currentCustomData?.[field];
                this.setSkuCustomData(name, {
                    [field]: currentValue ? currentValue : String(value),
                });
            }
        });
    }

    setSkuCustomData(name: string, data: Partial<ISkuCustomInputData>) {
        const validData: Partial<Omit<IFormSkuCustomData, "name">> = {};
        if (data.price_sold !== undefined) {
            const numberValue = Number(data.price_sold);
            if (!isNaN(numberValue) && numberValue >= 0) {
                validData.price_sold = numberValue;
            }
        }
        if (data.variant_combinations) {
            validData.variant_combinations = data.variant_combinations.map(
                (d) => ({
                    option_id: d.option_id,
                    value: d.value,
                })
            );
        }
        if (data.price_compare !== undefined) {
            const numberValue = Number(data.price_compare);
            if (!isNaN(numberValue) && numberValue >= 0) {
                validData.price_compare = numberValue;
            }
        }
        if (data.price_import !== undefined) {
            const numberValue = Number(data.price_import);
            if (!isNaN(numberValue) && numberValue >= 0) {
                validData.price_import = numberValue;
            }
        }

        if (data.barcode !== undefined) {
            validData.barcode = data.barcode;
        }

        if (data.masku !== undefined) {
            validData.masku = data.masku;
        }
        if (data.image !== undefined) {
            validData.image = data.image;
        }
        // Validate detail_import
        if (data.detail_import) {
            validData.detail_import = data.detail_import
                .map((d) => {
                    const quantity = Number(d.quantity_import);
                    if (!isNaN(quantity) && quantity >= 0) {
                        return {
                            warehouse_id: d.warehouse_id,
                            quantity_import: quantity,
                            lot_name: d.lot_name,
                        };
                    }
                    return null;
                })
                .filter((d) => d !== null);
        }
        const existing = this.skuCustomData.get(name);
        if (Object.keys(validData).length > 0) {
            this.skuCustomData.set(name, { ...existing, ...validData });
        }
    }
    setPrice(
        value: string,
        type: "price_import" | "price_compare" | "price_sold"
    ) {
        let numberValue = null;
        try {
            numberValue = Number(value);
            if (isNaN(numberValue)) throw new Error("");
        } catch (e) {
            numberValue = 0;
        }
        this[type] = numberValue;
    }

    setBarcode(value: string) {
        this.barcode = value;
    }

    setMasku(value: string) {
        this.masku = value;
    }

    setWarehouseOptions(value: SelectType[]) {
        this.initialWareHouseOptions = value;
    }

    setFullCustomData(data: Record<string, Omit<IFormSkuCustomData, "name">>) {
        this.skuCustomData.clear();
        Object.entries(data).forEach(([name, value]) => {
            this.skuCustomData.set(name, value);
        });
    }

    syncSkusCustomData() {
        const combinations = this.VariantCombination || [];
        // Lưu dữ liệu hiện có để tái sử dụng
        const existingData = new Map(this.skuCustomData);

        // Xóa toàn bộ skuCustomData để gán index tuần tự
        this.skuCustomData.clear();
        // Tạo lại skuCustomData với index tuần tự
        combinations.forEach((item, index) => {
            const existing = existingData.get(item.name);
            this.setSkuCustomData(item.name, {
                variant_combinations: item.details.map((d) => ({
                    option_id: d.option_id,
                    value: d.value,
                })),
                price_compare:
                    existing?.price_compare?.toString() ||
                    this.price_compare.toString(),
                price_sold:
                    existing?.price_sold?.toString() ||
                    this.price_sold.toString(),
                price_import:
                    existing?.price_import?.toString() ||
                    this.price_import.toString(),
                barcode: existing?.barcode
                    ? existing.barcode
                    : this.barcode
                      ? `${this.barcode}-${index + 1}`
                      : "",
                masku: existing?.masku
                    ? existing.masku
                    : this.masku
                      ? `${this.masku}-${index + 1}`
                      : "",
                image: existing?.image || undefined,
                detail_import: this.warehouse_selected.map((wh) => ({
                    warehouse_id: wh.value,
                    quantity_import: String(
                        existing?.detail_import?.find(
                            (d) => d.warehouse_id === wh.value
                        )?.quantity_import ||
                            this.warehouse_selected_quantities.find(
                                (q) => q.warehouse_id === wh.value
                            )?.quantity_import ||
                            0
                    ),
                    lot_name:
                        existing?.detail_import?.find(
                            (d) => d.warehouse_id === wh.value
                        )?.lot_name || "",
                })),
            });
        });
    }
    setFormVariantValue(value: any) {
        this.form_variant_value = value;
        this.syncSkusCustomData();
    }

    clearWarehouseSelectedAndQuantity(warehouse_id?: string) {
        // Kiểm tra dữ liệu đầu vào
        if (
            !Array.isArray(this.warehouse_selected) ||
            !Array.isArray(this.warehouse_selected_quantities)
        ) {
            console.warn(
                "warehouse_selected or warehouse_selected_quantities is not an array"
            );
            return;
        }

        if (!warehouse_id) {
            this.warehouse_selected = [];
            this.warehouse_selected_quantities = [];
            return;
        }
        this.warehouse_selected = this.warehouse_selected.filter(
            (wh) => wh.value !== warehouse_id
        );
        this.warehouse_selected_quantities =
            this.warehouse_selected_quantities.filter(
                (wh) => wh.warehouse_id !== warehouse_id
            );
    }

    clearSkusCustomData() {
        this.skuCustomData.clear();
    }

    clearVariantCombination() {
        this.form_variant_value.variants = undefined;
    }

    private getDefaultDetailImport(warehouse_id: string): {
        warehouse_id: string;
        quantity_import: number;
        lot_name: string;
    } {
        return {
            warehouse_id,
            quantity_import:
                this.warehouse_selected_quantities.find(
                    (q) => q.warehouse_id === warehouse_id
                )?.quantity_import || 0,
            lot_name: "",
        };
    }

    setSkusNameSelected(name: string) {
        this.skusNameSelected = name;
    }

    updateSkusImage(value: string) {
        if (!this.skusNameSelected) return;
        this.setSkuCustomData(this.skusNameSelected, { image: value });
    }

    updateSkusPriceSold(value: string) {
        if (!this.skusNameSelected) return;
        this.setSkuCustomData(this.skusNameSelected, { price_sold: value });
    }

    updateSkusPriceCompare(value: string) {
        if (!this.skusNameSelected) return;
        this.setSkuCustomData(this.skusNameSelected, {
            price_compare: value,
        });
    }

    updateSkusPriceImport(value: string) {
        if (!this.skusNameSelected) return;

        this.setSkuCustomData(this.skusNameSelected, {
            price_import: value,
        });
    }

    updateSkusQuantityImport(value: string, warehouse_id: string) {
        if (!this.skusNameSelected) return;

        const currentCustomData = this.skuCustomData.get(this.skusNameSelected);
        if (!currentCustomData) return;
        const numberValue = Number(value);

        const updatedDetailImport = this.warehouse_selected.map((wh) => {
            const currentDetailImport = currentCustomData.detail_import?.find(
                (d) => d.warehouse_id === wh.value
            );
            const quantity_import =
                !isNaN(numberValue) && numberValue >= 0 ? numberValue : 0;

            if (wh.value === warehouse_id) {
                return {
                    warehouse_id: wh.value,
                    quantity_import,
                    lot_name: currentDetailImport?.lot_name || "",
                };
            }
            return currentDetailImport
                ? currentDetailImport
                : this.getDefaultDetailImport(wh.value);
        });

        this.setSkuCustomData(this.skusNameSelected, {
            detail_import: updatedDetailImport.map((d) => ({
                warehouse_id: d.warehouse_id,
                quantity_import: String(d.quantity_import),
                lot_name: d.lot_name,
            })),
        });
    }

    updateSkusLotName(value: string, warehouse_id: string) {
        if (!this.skusNameSelected) return;
        const currentCustomData = this.skuCustomData.get(this.skusNameSelected);
        if (!currentCustomData) return;

        const updatedDetailImport = this.warehouse_selected.map((wh) => {
            const currentDetailImport = currentCustomData.detail_import?.find(
                (d) => d.warehouse_id === wh.value
            );

            if (wh.value === warehouse_id) {
                return {
                    warehouse_id: wh.value,
                    quantity_import: currentDetailImport?.quantity_import || 0,
                    lot_name: value,
                };
            }
            return currentDetailImport
                ? currentDetailImport
                : this.getDefaultDetailImport(wh.value);
        });

        this.setSkuCustomData(this.skusNameSelected, {
            detail_import: updatedDetailImport.map((d) => ({
                warehouse_id: d.warehouse_id,
                quantity_import: String(d.quantity_import),
                lot_name: d.lot_name,
            })),
        });
    }

    updateSkusBarcode(value: string) {
        if (!this.skusNameSelected) return;
        this.setSkuCustomData(this.skusNameSelected, {
            barcode: value || "",
        });
    }

    updateSkusMasku(value: string) {
        if (!this.skusNameSelected) return;
        this.setSkuCustomData(this.skusNameSelected, {
            masku: value || "",
        });
    }

    get Profit() {
        return this.price_sold - this.price_import > 0
            ? this.price_sold - this.price_import
            : 0;
    }

    get ProfitPercent() {
        return this.price_sold && this.price_sold
            ? ((this.price_sold - this.price_import) / this.price_sold) * 100 >
              0
                ? ((this.price_sold - this.price_import) / this.price_sold) *
                  100
                : 0
            : 0;
    }

    get WarehouseOptions() {
        return (
            this.initialWareHouseOptions?.filter(
                (option) =>
                    !this.warehouse_selected ||
                    !this.warehouse_selected
                        .map((item) => item.value)
                        .includes(option.value)
            ) || []
        );
    }

    get VariantCombination() {
        const variantCombinations = this.form_variant_value?.variants || [];

        // Nếu không có variants, trả về mảng rỗng
        if (!variantCombinations.length) {
            return [];
        }

        // Lấy danh sách các mảng giá trị, loại bỏ giá trị rỗng và xử lý null/undefined
        const variantArrays = variantCombinations
            .map((variant) => ({
                name: variant.name,
                values: variant.values
                    .map((v) => v.value)
                    .filter(
                        (value) =>
                            typeof value === "string" && value.trim() !== ""
                    ),
            }))
            .filter((variant) => variant.values.length > 0); // Loại bỏ thuộc tính không có giá trị hợp lệ

        // Nếu không có giá trị hợp lệ, trả về mảng rỗng
        if (!variantArrays.length) {
            return [];
        }

        // Hàm tạo tất cả tổ hợp
        const generateCombinations = (
            arrays: { name: string; values: string[] }[],
            index: number = 0,
            current: { option_id: string; value: string }[] = []
        ): IVariantCombination[] => {
            // Điều kiện dừng: khi đã xử lý hết tất cả thuộc tính
            if (index >= arrays.length) {
                const name = current.map((item) => item.value).join(" / ");
                return [{ name, details: current }];
            }

            const result: IVariantCombination[] = [];
            const currentVariant = arrays[index];

            // Tạo tổ hợp cho mỗi giá trị của thuộc tính hiện tại
            for (const value of currentVariant.values) {
                const newCurrent = [
                    ...current,
                    { option_id: currentVariant.name, value },
                ];
                // Gọi đệ quy cho thuộc tính tiếp theo
                const subCombinations = generateCombinations(
                    arrays,
                    index + 1,
                    newCurrent
                );
                result.push(...subCombinations);
            }

            return result;
        };
        return generateCombinations(variantArrays);
    }

    get hasSkus() {
        return this.skuCustomData.size > 0;
    }
}

export const modalCreateProductStore = new ModalCreateProductStore();
const ModalCreateProduct: React.FC<IModalCreateProductProps> = ({
    isOpen,
    onClose,
    onSave,
    okText,
    cancelText,
    title,
    form,
    subForm,
    formInitialValues,
    categorySelectData,
    brandSelectData,
    warehouseSelectData,
    optionSelectData,
    loadingData,
    productId,
    messageWhenSave,
}) => {
    const store = useStore();
    const quillRef = useRef<ReactQuill>(null);
    const productStore = store.productObservable;
    const skusStore = store.skusObservable;
    const handleQuillChange = (content: string, delta, source, editor) => {
        try {
            form.setFieldValue("description", content);
        } catch (e) {}
    };

    const initialOptionsBrand: SelectType[] = brandSelectData?.length
        ? brandSelectData
        : [
              { label: "Nhãn hàng A", value: "BA" },
              { label: "Nhãn hàng B", value: "BB" },
              { label: "Nhãn hàng C", value: "BC" },
          ];
    const initialOptionsCategory: TreeSelectType[] = categorySelectData?.length
        ? categorySelectData
        : [
              {
                  title: "Điện tử",
                  value: "electronics",
                  children: [
                      {
                          title: "Điện thoại",
                          value: "mobile-phones",
                          children: [
                              {
                                  title: "iPhone",
                                  value: "iphone",
                                  children: [],
                              },
                              {
                                  title: "Samsung",
                                  value: "samsung",
                                  children: [],
                              },
                              {
                                  title: "Xiaomi",
                                  value: "xiaomi",
                                  children: [],
                              },
                          ],
                      },
                  ],
              },
          ];
    const initialOptionsInventory: SelectType[] = warehouseSelectData?.length
        ? warehouseSelectData
        : [
              { label: "Kho chính", value: "main" },
              { label: "Kho phụ", value: "sub" },
              { label: "Kho tạm", value: "temp" },
              { label: "Kho 1", value: "warehouse1" },
              { label: "Kho 2", value: "warehouse2" },
              { label: "Kho 3", value: "warehouse3" },
          ];
    const initialOptionsVariant: SelectType[] = optionSelectData?.length
        ? optionSelectData
        : [
              { label: "Thuộc tính 1", value: "color" },
              { label: "Thuộc tính 2", value: "size" },
              { label: "Thuộc tính 4", value: "material" },
          ];

    // Hàm thêm selectable cho node cấp 3
    const addSelectable = (nodes, level = 1) => {
        return nodes.map((node) => ({
            ...node,
            selectable: level === 3,
            children: node.children
                ? addSelectable(node.children, level + 1)
                : undefined,
        }));
    };
    const getFirstLevel3Node = (treeData) => {
        let firstLevel3Node = null;

        const traverse = (nodes, level = 1) => {
            for (const node of nodes) {
                if (
                    level === 3 &&
                    (!node.children || node.children.length === 0)
                ) {
                    firstLevel3Node = node.value;
                    return true;
                }
                if (node.children && node.children.length > 0) {
                    if (traverse(node.children, level + 1)) {
                        return true;
                    }
                }
            }
            return false;
        };

        traverse(treeData);
        return firstLevel3Node;
    };
    const selectableTreeData = addSelectable(initialOptionsCategory);

    // Hàm render thông tin chung của sản phẩm
    const GeneralInformation = observer(() => {
        const [formImageList, setFormImageList] = useState<UploadFile[]>([]);
        const [previewVisible, setPreviewVisible] = useState<boolean>(false);
        const [previewImage, setPreviewImage] = useState<string>("");
        const handlePreview = useCallback(
            async (file: UploadFile) => {
                if (file.url) {
                    setPreviewVisible(true);
                    setPreviewImage(file.url);
                } else if (file.originFileObj) {
                    const base64Url = await getBase64(file.originFileObj);
                    setPreviewImage(base64Url);
                }
                setPreviewVisible(true);
            },
            [form]
        );
        useEffect(() => {
            const initialImages = form.getFieldValue("image") || [];
            if (initialImages.length > 0 && formImageList.length === 0) {
                setFormImageList(initialImages);
            }
        }, [form]);

        useEffect(() => {
            const initialImages = form.getFieldValue("image") || [];
            if (
                JSON.stringify(initialImages) !== JSON.stringify(formImageList)
            ) {
                form.setFieldValue("image", formImageList);
            }
        }, [form, formImageList]);
        const productTypeOption: SelectType[] = Object.keys(
            EnumProductType
        ).map((key) => ({
            label: EnumProductType[key as keyof typeof EnumProductType],
            value: EnumProductStore[key as keyof typeof EnumProductStore],
        }));

        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                    <span>Thông tin chung</span>
                </h2>
                <div className="flex flex-col">
                    <Form.Item
                        label="Tên sản phẩm"
                        name={"title"}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên sản phẩm",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Nhập tên sản phẩm"
                            className="w-full p-[0.625rem] h-10 rounded border border-solid border-gray-200"
                            autoComplete="off"
                        />
                    </Form.Item>
                    <Row gutter={24}>
                        <Col sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Loại xe"
                                name={"type"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn loại xe",
                                    },
                                ]}
                                initialValue={
                                    !productId
                                        ? productTypeOption
                                            ? productTypeOption[0].value
                                            : undefined
                                        : undefined
                                }
                            >
                                <Select
                                    placeholder="Chọn loại xe"
                                    showSearch
                                    className="h-10"
                                    options={productTypeOption}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Slug sản phẩm"
                                name={"slug_product"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập slug sản phẩm",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Nhập slug sản phẩm"
                                    className="w-full p-[0.625rem] h-10 rounded border border-solid border-gray-200"
                                    autoComplete="off"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Nhãn hàng"
                                name={"brand_id"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn nhãn hàng",
                                    },
                                ]}
                                initialValue={
                                    !productId
                                        ? initialOptionsBrand
                                            ? initialOptionsBrand[0]?.value
                                            : undefined
                                        : undefined
                                }
                            >
                                <Select
                                    placeholder="Chọn nhãn hàng"
                                    showSearch
                                    className="h-10"
                                    options={initialOptionsBrand}
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={12} lg={12} xl={12}>
                            <Form.Item
                                label="Danh mục"
                                name={"category_id"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn danh mục",
                                    },
                                ]}
                                initialValue={
                                    !productId
                                        ? getFirstLevel3Node(selectableTreeData)
                                            ? getFirstLevel3Node(
                                                  selectableTreeData
                                              )
                                            : undefined
                                        : undefined
                                }
                            >
                                <TreeSelect
                                    placeholder="Chọn danh mục"
                                    showSearch
                                    treeData={selectableTreeData}
                                    className="h-10"
                                    treeDefaultExpandAll
                                    treeNodeFilterProp="title"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Mô tả">
                        <div className="w-full h-[25rem] overflow-hidden border border-solid border-[var(--border-gray)] rounded-md editor-container">
                            <CustomizeEditor
                                onChange={handleQuillChange}
                                folder="Cars"
                                theme="snow"
                                value={form.getFieldValue("description")}
                                ref={quillRef}
                                store={productStore}
                                className="w-full h-full"
                                defaultForm={form}
                                fieldFormName="description"
                            />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh sản phẩm"
                        name={"image"}
                        tooltip={`Ảnh nhận định dạng ${AcceptImageTypes.map((image) => "." + image.split("/")[1]).join(", ")}, có tỷ lệ 1:1 (Ảnh vuông) và được chọn tối đa 5 hình ảnh`}
                        getValueFromEvent={(info) => info.fileList}
                        rules={[
                            {
                                validator: (_, value) => {
                                    if (!modalCreateProductStore.hasSkus) {
                                        return value && value.length > 0
                                            ? Promise.resolve()
                                            : Promise.reject(
                                                  new Error(
                                                      "Vui lòng tải lên ít nhất một hình ảnh"
                                                  )
                                              );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <div className="w-full h-32">
                            <label
                                htmlFor="uploadImageFile"
                                className={`flex flex-col items-center justify-center w-full border border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-all duration-500 ease-in-out h-full
                                ${formImageList.length === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-32"} origin-top`}
                            >
                                <UploadOutlined className={`text-2xl`} />
                                <span className={`text-sm text-gray-500`}>
                                    Tải lên hình ảnh
                                </span>
                            </label>
                            <div className="flex items-center justify-start w-full h-full gap-2">
                                <Upload
                                    name="uploadImageFile"
                                    id="uploadImageFile"
                                    accept={AcceptImageTypes.join(",")}
                                    listType="picture-card"
                                    showUploadList={{
                                        showPreviewIcon: true,
                                        showRemoveIcon: true,
                                    }}
                                    maxCount={DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT}
                                    multiple
                                    beforeUpload={(file, fileList) => {
                                        const isValidType =
                                            AcceptImageTypes.some(
                                                (type) => file.type === type
                                            );
                                        if (!isValidType) {
                                            store.setStatusMessage(
                                                400,
                                                `Vui lòng chọn ảnh có định dạng ${AcceptImageTypes.join(
                                                    ", "
                                                )}`,
                                                "",
                                                false
                                            );
                                            return false;
                                        }
                                        if (
                                            formImageList.length +
                                                fileList.length >
                                                DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT ||
                                            fileList.length >
                                                DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT
                                        ) {
                                            store.setStatusMessage(
                                                400,
                                                `Chỉ được upload tối đa ${DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT} ảnh!`,
                                                ""
                                            );
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={(info) => {
                                        setFormImageList([...info.fileList]);
                                    }}
                                    fileList={
                                        formImageList.length
                                            ? formImageList
                                            : undefined
                                    }
                                    customRequest={async ({
                                        file,
                                        onSuccess,
                                        onError,
                                    }) => {
                                        try {
                                            onSuccess?.("Thành công", file);
                                        } catch (error) {
                                            onError?.(error as Error);
                                        }
                                    }}
                                    onPreview={handlePreview}
                                    onRemove={(file) => {
                                        setFormImageList((prev) =>
                                            prev.filter(
                                                (item) => item.uid !== file.uid
                                            )
                                        );
                                    }}
                                    className={`product_image_upload w-full transition-opacity duration-1000 ease-in-out ${
                                        formImageList.length !== 0
                                            ? "opacity-100 scale-100 -translate-y-32"
                                            : "opacity-0 scale-0 translate-y-0"
                                    } origin-top-left`}
                                >
                                    <div
                                        className={`flex flex-col items-center justify-center w-full h-full`}
                                    >
                                        <UploadOutlined className="text-2xl" />
                                    </div>
                                </Upload>
                                {previewImage && (
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        width={100}
                                        height={100}
                                        className="object-cover rounded-md !hidden"
                                        preview={{
                                            visible: previewVisible,
                                            onVisibleChange: (visible) =>
                                                setPreviewVisible(visible),
                                            afterOpenChange: (visible) =>
                                                !visible && setPreviewImage(""),
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </Form.Item>
                </div>
            </div>
        );
    });

    const handleCheckSpec = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                form.setFieldsValue({
                    specifications: [{ name: "", values: [{ value: "" }] }],
                });
                modalCreateProductStore.setShowSpecForm(true);
            } else {
                modalCreateProductStore.setShowSpecForm(false);
                form.resetFields(["specifications"]);
            }
        },
        []
    );
    const SpecificationsInformation = observer(() => {
        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2
                    className="text-base text-gray-900 font-semibold pb-2 m-0 "
                    style={{
                        borderBottom: "1px solid #d9d9d9",
                    }}
                >
                    Thông số kỹ thuật
                </h2>
                <div
                    className="flex justify-start items-center gap-2 w-full"
                    style={{
                        borderBottom: modalCreateProductStore.showSpecForm
                            ? "1px solid #d9d9d9"
                            : "none",
                        paddingBottom: modalCreateProductStore.showSpecForm
                            ? "1rem"
                            : "0",
                    }}
                >
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            handleCheckSpec(e);
                        }}
                        checked={modalCreateProductStore.showSpecForm}
                        id="specCheck"
                    />
                    <label htmlFor="specCheck" className="text-sm">
                        Chọn để nhập các thông số kỹ thuật của sản phẩm
                    </label>
                </div>
                <div className="flex flex-col gap-4">
                    {modalCreateProductStore.showSpecForm && (
                        <FormListSelectOrInput
                            formListName="specifications"
                            fieldValue="specifications"
                            formItemLabel="Thông số kỹ thuật"
                            placeholderSelect="Chọn thông số kỹ thuật"
                            renderComponent={({ onClick }) => (
                                <button
                                    onClick={onClick}
                                    className="w-full h-10 border-none outline-none cursor-pointer bg-transparent text-base pt-4"
                                    type="button"
                                >
                                    <div className={"text-gray-700 text-base"}>
                                        <PlusOutlined className="mr-1" />
                                        <span>Thêm thông số kỹ thuật</span>
                                    </div>
                                </button>
                            )}
                            showAddValue={false}
                            isSelect={false}
                            form={form}
                        />
                    )}
                </div>
            </div>
        );
    });

    type UpdateProductType =
        | "quantity_import"
        | "price_sold"
        | "price_import"
        | "price_compare"
        | "barcode"
        | "masku";
    const debounceHandleUpdateProductValue = useCallback<
        (field: UpdateProductType, value: string, warehouseId?: string) => void
    >(
        debounce(
            (field: UpdateProductType, value: string, warehouseId?: string) => {
                // Cập nhật MobX
                if (field === "quantity_import" && warehouseId) {
                    modalCreateProductStore.setWarehouse_selected_quantities(
                        value || "0",
                        warehouseId
                    );
                } else if (
                    field === "price_import" ||
                    field === "price_sold" ||
                    field === "price_compare"
                ) {
                    modalCreateProductStore.setPrice(value, field);
                } else if (field === "barcode") {
                    modalCreateProductStore.setBarcode(value);
                } else if (field === "masku") {
                    modalCreateProductStore.setMasku(value);
                }
            },
            300
        ),
        [modalCreateProductStore]
    );

    // Hàm render giá sản phẩm
    const PriceInformation = () => {
        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                    Thông tin giá
                </h2>
                <Row gutter={24}>
                    <Col sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="Giá bán"
                            name={"price_sold"}
                            tooltip="Số tiền khách hàng cần thanh toán"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!modalCreateProductStore.hasSkus) {
                                            const convertNumber = Number(value);
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
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập giá bán"
                                className="w-full h-10"
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                    form.setFieldValue("price_sold", value);
                                    debounceHandleUpdateProductValue(
                                        "price_sold",
                                        value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="Giá so sánh"
                            name={"price_compare"}
                            tooltip="Số tiền chưa giảm giá, thể hiện giá trị giảm giá, ưu đãi cho khách hàng"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!modalCreateProductStore.hasSkus) {
                                            const convertNumber = Number(value);
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
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <Input
                                placeholder="Nhập giá so sánh"
                                className="w-full h-10"
                                autoComplete="off"
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                    form.setFieldValue("price_compare", value);
                                    debounceHandleUpdateProductValue(
                                        "price_compare",
                                        value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        );
    };

    //#region Hàm render quản lí tồn kho
    const InventoryInformation = observer(() => {
        const [availableInventoryOptions, setAvailableInventoryOptions] =
            useState<SelectType[]>(initialOptionsInventory);
        const handleWarehouseSelect = useCallback(
            (value: any, option: SelectType | SelectType[]) => {
                const newValue = Array.isArray(option) ? option : [option];
                modalCreateProductStore.setWarehouseSelected(newValue);
            },
            [form]
        );

        const handleDeSelectWarehouse = useCallback(
            (value: string) => {
                const currentWarehouses =
                    form.getFieldValue(["detail_import", "warehouse_id"]) || [];
                if (
                    !currentWarehouses ||
                    !Array.isArray(currentWarehouses) ||
                    !value
                )
                    return;
                const newWarehouses = currentWarehouses.filter(
                    (item: any) => item.warehouse_id !== value
                );
                form.setFieldsValue({
                    detail_import: {
                        warehouse_id: newWarehouses,
                    },
                });

                form.setFieldsValue({
                    detail_import: {
                        [value]: {
                            quantity_import: undefined,
                        },
                    },
                });

                modalCreateProductStore.clearWarehouseSelectedAndQuantity(
                    value
                );
            },
            [form]
        );

        const handleClearWarehouse = useCallback(() => {
            form.resetFields(["detail_import", "warehouse_id"]);
            modalCreateProductStore.clearWarehouseSelectedAndQuantity();
        }, [form]);
        useEffect(() => {
            modalCreateProductStore.setWarehouseOptions(
                initialOptionsInventory
            );
        }, [form, initialOptionsInventory]);
        useEffect(() => {
            const newOptions = modalCreateProductStore.WarehouseOptions;
            setAvailableInventoryOptions((prevOptions) =>
                JSON.stringify(prevOptions) !== JSON.stringify(newOptions)
                    ? newOptions
                    : prevOptions
            );
        }, [modalCreateProductStore.warehouse_selected]);
        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                    Quản lý tồn kho
                </h2>
                <Row gutter={24} align={"middle"}>
                    <Col sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="Giá vốn"
                            name={"price_import"}
                            tooltip={{
                                title: "Giá vốn - Giá nhập vào của sản phẩm",
                            }}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!modalCreateProductStore.hasSkus) {
                                            const convertNumber = Number(value);
                                            if (
                                                isNaN(convertNumber) ||
                                                convertNumber < 0
                                            ) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập giá nhập hợp lệ"
                                                    )
                                                );
                                            }
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
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                    form.setFieldValue("price_import", value);
                                    debounceHandleUpdateProductValue(
                                        "price_import",
                                        value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12}>
                        <div className="flex gap-6 justify-start items-center w-full">
                            <div className="flex flex-col gap-2">
                                <span>Biên lợi nhuận</span>
                                <span className="text-[#808080] text-base">
                                    {modalCreateProductStore.ProfitPercent.toFixed(
                                        2
                                    )}
                                    %
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span>Lợi nhuận</span>
                                <span className="text-[#808080] text-base">
                                    {modalCreateProductStore.Profit.toLocaleString(
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
                <Row gutter={24}>
                    <Col sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="SKU"
                            name={"masku"}
                            tooltip={
                                "SKU - Mã sản phẩm cho mỗi sản phẩm nên là duy nhất, và bao gồm cả chữ và số"
                            }
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            !modalCreateProductStore.hasSkus &&
                                            !productId
                                        ) {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập mã sku"
                                                    )
                                                );
                                            }
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
                                onChange={(e) => {
                                    debounceHandleUpdateProductValue(
                                        "masku",
                                        e.target.value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col sm={24} md={12} lg={12} xl={12}>
                        <Form.Item
                            label="Barcode"
                            name={"barcode"}
                            tooltip="Barcode - Mã vạch thường được Nhà sản xuất tạo ra"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            !modalCreateProductStore.hasSkus &&
                                            !productId
                                        ) {
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập mã barcode"
                                                    )
                                                );
                                            }
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
                                onChange={(e) => {
                                    debounceHandleUpdateProductValue(
                                        "barcode",
                                        e.target.value
                                    );
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col flex={"100%"}>
                        <Form.Item
                            label="Tồn kho khả dụng"
                            name={["detail_import", "warehouse_id"]}
                            className="w-full"
                            tooltip={
                                "Các kho hàng có sẵn và đang trong quá trình hoạt động"
                            }
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (
                                            !modalCreateProductStore.hasSkus &&
                                            !productId
                                        ) {
                                            if (!value || value.length === 0) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng chọn kho hàng"
                                                    )
                                                );
                                            }
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
                                options={availableInventoryOptions || []}
                                optionLabelProp="label"
                                onChange={handleWarehouseSelect}
                                onClear={handleClearWarehouse}
                                onDeselect={handleDeSelectWarehouse}
                                disabled={
                                    modalCreateProductStore.hasSkus && productId
                                        ? true
                                        : false
                                }
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {modalCreateProductStore.warehouse_selected.length > 0 && (
                    <>
                        <div
                            style={{
                                borderBottom: "1px solid #d9d9d9",
                                paddingBottom: "1rem",
                            }}
                        >
                            <Row gutter={24} align={"top"}>
                                <Col sm={24} md={12} lg={12} xl={12}>
                                    <span>Kho hàng</span>
                                </Col>
                                <Col sm={24} md={12} lg={12} xl={12}>
                                    <span>Tồn đầu kì</span>
                                </Col>
                            </Row>
                        </div>

                        {modalCreateProductStore.warehouse_selected.map(
                            (item: SelectType, index) => {
                                return (
                                    <Row
                                        gutter={24}
                                        key={index}
                                        align={"middle"}
                                    >
                                        <Col sm={24} md={12} lg={12} xl={12}>
                                            <span>{item.label}</span>
                                        </Col>
                                        <Col sm={24} md={12} lg={12} xl={12}>
                                            <Form.Item
                                                name={[
                                                    "detail_import",
                                                    item.value,
                                                    "quantity_import",
                                                ]}
                                                rules={[
                                                    {
                                                        validator: (
                                                            _,
                                                            value
                                                        ) => {
                                                            if (
                                                                !modalCreateProductStore.hasSkus
                                                            ) {
                                                                if (!value) {
                                                                    return Promise.reject(
                                                                        new Error(
                                                                            `Vui lòng nhập số lượng hàng`
                                                                        )
                                                                    );
                                                                }
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
                                                    disabled={
                                                        modalCreateProductStore.hasSkus &&
                                                        productId
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value.replace(
                                                                /[^0-9]/g,
                                                                ""
                                                            );

                                                        form.setFields([
                                                            {
                                                                name: [
                                                                    "detail_import",
                                                                    item.value,
                                                                    "quantity_import",
                                                                ],
                                                                value,
                                                            },
                                                        ]);
                                                        debounceHandleUpdateProductValue(
                                                            "quantity_import",
                                                            value,
                                                            item.value
                                                        );
                                                    }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                );
                            }
                        )}
                    </>
                )}
            </div>
        );
    });
    //#endregion

    // #region Hàm render quản lí biến thể

    // const [subForm] = Form.useForm();
    const handleCheckVariant = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const defaultVariant = initialOptionsVariant[0].value || "";
            const variants = [
                { name: defaultVariant, values: [{ value: "" }] },
            ];
            form.setFieldsValue({
                variants: variants,
            });
            modalCreateProductStore.setShowVariantForm(true);
        } else {
            modalCreateProductStore.setShowVariantForm(false);
            form.resetFields(["variants"]);
            modalCreateProductStore.clearSkusCustomData();
            modalCreateProductStore.clearVariantCombination();
        }
    };

    const VariantInformation: React.FC<{ defaultForm: FormInstance }> =
        observer(({ defaultForm }) => {
            const [isOpenUpdateVariantModal, setIsOpenUpdateVariantModal] =
                useState<boolean>(false);
            const [inputFileKey, setInputFileKey] =
                useState<string>(generateUUIDV4());

            // Đồng bộ subForm khi skusNameSelected thay đổi
            useEffect(() => {
                if (
                    isOpenUpdateVariantModal &&
                    modalCreateProductStore.skusNameSelected
                ) {
                    const name = modalCreateProductStore.skusNameSelected;
                    const currentSku =
                        modalCreateProductStore.skuCustomData.get(name);
                    const initialSubFormValues = {
                        skus: {
                            [name]: {
                                price_sold:
                                    currentSku?.price_sold ||
                                    modalCreateProductStore.price_sold ||
                                    0,
                                price_compare:
                                    currentSku?.price_compare ||
                                    modalCreateProductStore.price_compare ||
                                    0,
                                price_import:
                                    currentSku?.price_import ||
                                    modalCreateProductStore.price_import ||
                                    0,
                                masku:
                                    currentSku?.masku ||
                                    modalCreateProductStore.masku ||
                                    "",
                                image: currentSku?.image || null,
                                barcode:
                                    currentSku?.barcode ||
                                    modalCreateProductStore.barcode ||
                                    "",
                                detail_import: currentSku?.detail_import?.length
                                    ? Object.entries(
                                          currentSku?.detail_import?.reduce(
                                              (acc: any, item: any) => ({
                                                  ...acc,
                                                  [item.warehouse_id]: {
                                                      quantity_import:
                                                          item.quantity_import ||
                                                          0,
                                                      lot_name:
                                                          item.lot_name || "",
                                                  },
                                              }),
                                              {}
                                          )
                                      ).map(([key, value]) => ({
                                          warehouse_id: key,
                                          quantity_import:
                                              (
                                                  value as {
                                                      quantity_import: number;
                                                      lot_name: string;
                                                  }
                                              ).quantity_import || 0,
                                          lot_name:
                                              (
                                                  value as {
                                                      quantity_import: number;
                                                      lot_name: string;
                                                  }
                                              )?.lot_name || "",
                                      }))
                                    : [],
                            },
                        },
                    };
                    subForm.setFieldsValue(initialSubFormValues);
                }
            }, [
                isOpenUpdateVariantModal,
                modalCreateProductStore.skusNameSelected,
                modalCreateProductStore.skuCustomData,
            ]);
            const handleUpdateVariantValue = useCallback(
                debounce(
                    (field: string, value: string, warehouseId?: string) => {
                        const name = modalCreateProductStore.skusNameSelected;
                        if (!name) return;

                        // Cập nhật MobX
                        if (field === "quantity_import") {
                            modalCreateProductStore.updateSkusQuantityImport(
                                value,
                                warehouseId
                            );
                        } else if (field === "price_import") {
                            modalCreateProductStore.updateSkusPriceImport(
                                value
                            );
                        } else if (field === "price_sold") {
                            modalCreateProductStore.updateSkusPriceSold(value);
                        } else if (field === "price_compare") {
                            modalCreateProductStore.updateSkusPriceCompare(
                                value
                            );
                        } else if (field === "barcode") {
                            modalCreateProductStore.updateSkusBarcode(value);
                        } else if (field === "masku") {
                            modalCreateProductStore.updateSkusMasku(value);
                        } else if (field === "lot_name") {
                            modalCreateProductStore.updateSkusLotName(
                                value,
                                warehouseId
                            );
                        }
                    },
                    0
                ),
                [modalCreateProductStore]
            );
            const columns: ColumnsType<{
                key: string;
                name: string;
            }> = [
                {
                    dataIndex: "name",
                    key: "name",
                    render: (name: string) => {
                        const sku =
                            modalCreateProductStore.skuCustomData.get(name);
                        return (
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-sm">
                                    {name}
                                </span>
                                <span className="text-sm text-gray-500">
                                    SKU: {sku?.masku || "N/A"}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Barcode: {sku?.barcode || "N/A"}
                                </span>
                            </div>
                        );
                    },
                },
                {
                    dataIndex: "price_sold",
                    key: "price_sold",
                    align: "right",
                    render: (_, record: any) => {
                        const sku = modalCreateProductStore.skuCustomData.get(
                            record.name
                        );
                        const price_sold = sku?.price_sold || 0;
                        const totalWarehouse = sku?.detail_import?.length || 0;
                        const totalStockInWarehouse =
                            sku?.detail_import?.reduce(
                                (acc: number, item: any) =>
                                    acc + item.quantity_import,
                                0
                            ) || 0;
                        return (
                            <div className="flex flex-col gap-2">
                                <span className="font-medium text-base">
                                    {price_sold.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {totalStockInWarehouse} khả dụng /{" "}
                                    {totalWarehouse} kho hàng
                                </span>
                            </div>
                        );
                    },
                },
            ];
            const handleRowVariantClick = (record: {
                key: string;
                name: string;
            }) => {
                setIsOpenUpdateVariantModal(true);
                modalCreateProductStore.setSkusNameSelected(record.name);
            };

            const handleCloseUpdateVariantModal = () => {
                setIsOpenUpdateVariantModal(false);
                modalCreateProductStore.setSkusNameSelected(null);
            };
            const handleSaveUpdateVariantModal = () => {
                defaultForm.submit();
            };

            const handleSubformFinish = (values: any) => {
                const allValues = defaultForm.getFieldsValue(true);
                const validName = [
                    ...modalCreateProductStore.skuCustomData.keys(),
                ];
                const validKeyValues = Object.keys(allValues.skus).filter(
                    (name) => validName.includes(name)
                );
                const validValues = (
                    Object.entries(allValues.skus) as [
                        string,
                        Omit<IFormSkuCustomData, "name">,
                    ][]
                )
                    .filter(([name, value]) => validKeyValues.includes(name))
                    .map(([name, value]) => {
                        return {
                            name,
                            ...value,
                        };
                    });
                updateFormVariantValue(validValues);
                setIsOpenUpdateVariantModal(false);
            };

            const handleSubformFinishFailed = (errorInfo: any) => {
                const errorMessage =
                    errorInfo &&
                    typeof errorInfo === "object" &&
                    "errorFields" in errorInfo &&
                    Array.isArray(errorInfo.errorFields)
                        ? `Vui lòng nhập đầy đủ thông tin của biến thể ${modalCreateProductStore.skusNameSelected}`
                        : errorInfo instanceof Error
                          ? errorInfo.message
                          : `Có lỗi xảy ra trong quá trình cật nhật giá trị biến thể ${modalCreateProductStore.skusNameSelected}`;

                store.setStatusMessage(400, errorMessage, "", false);
            };

            const getDefaultNamePathVariantFormItem = (
                formItemName: string,
                isDetailImport: boolean = false
            ) => {
                const defaultName = [
                    "skus",
                    modalCreateProductStore.skusNameSelected,
                    ...(isDetailImport ? ["detail_import"] : []),
                    formItemName,
                ];
                return defaultName;
            };

            const handleUploadVariantImage = async (
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
                    modalCreateProductStore.updateSkusImage(imageUrl);
                    defaultForm.setFields([
                        {
                            name: getDefaultNamePathVariantFormItem("image"),
                            value: imageUrl,
                            errors: [],
                        },
                    ]);
                    defaultForm
                        .validateFields([
                            getDefaultNamePathVariantFormItem("image").join(
                                "."
                            ),
                        ])
                        .catch(() => {});
                    setInputFileKey(generateUUIDV4());
                };
                reader.onerror = () => {
                    store.setStatusMessage(
                        400,
                        `Có lỗi xảy ra trong quá trình tải ảnh của biến thể ${modalCreateProductStore.skusNameSelected}`,
                        "",
                        false
                    );
                };
                reader.readAsDataURL(file);
            };

            const getSkusImage = () => {
                const imageUrl = modalCreateProductStore.skuCustomData.get(
                    modalCreateProductStore.skusNameSelected
                )?.image;
                return imageUrl || null;
            };

            return (
                <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                    <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                        Quản lý biến thể
                    </h2>
                    <div
                        className="flex justify-start items-center gap-2 w-full"
                        style={{
                            borderBottom: modalCreateProductStore.showSpecForm
                                ? "1px solid #d9d9d9"
                                : "none",
                            paddingBottom: modalCreateProductStore.showSpecForm
                                ? "1rem"
                                : "0",
                        }}
                    >
                        <input
                            type="checkbox"
                            onChange={(e) => {
                                handleCheckVariant(e);
                            }}
                            id="variantCheck"
                            disabled={productId ? true : false}
                            checked={modalCreateProductStore.showVariantForm}
                        />
                        <label htmlFor="variantCheck" className="text-sm">
                            Chọn để nhập các biến thể của sản phẩm
                        </label>
                    </div>
                    {modalCreateProductStore.showVariantForm && (
                        <div className="flex flex-col gap-4">
                            <FormListSelectOrInput
                                isUpdate={productId ? true : false}
                                formListName="variants"
                                fieldValue="variants"
                                initialOptions={initialOptionsVariant}
                                formItemLabel="Thuộc tính của biến thể"
                                placeholderSelect="Chọn thuộc tính"
                                renderComponent={({ onClick }) =>
                                    !productId && (
                                        <button
                                            onClick={onClick}
                                            className="w-full h-10 border-none outline-none cursor-pointer bg-transparent text-base pt-4"
                                            type="button"
                                        >
                                            <div
                                                className={
                                                    "text-gray-700 text-base"
                                                }
                                            >
                                                <PlusOutlined className="mr-1" />
                                                <span>
                                                    Thêm thuộc tính biến thể
                                                </span>
                                            </div>
                                        </button>
                                    )
                                }
                                maxFormListInputValue={5}
                                form={form}
                                setFormValue={() => {
                                    modalCreateProductStore.setFormVariantValue(
                                        {
                                            variants:
                                                form.getFieldValue("variants"),
                                        }
                                    );
                                }}
                            />
                            {modalCreateProductStore.VariantCombination.length >
                                0 && (
                                <div className="flex flex-col gap-4">
                                    <Table
                                        columns={columns}
                                        showHeader={false}
                                        dataSource={modalCreateProductStore.VariantCombination.map(
                                            (combo: IVariantCombination) => ({
                                                key:
                                                    combo.name +
                                                    generateUUIDV4(),
                                                name: combo.name,
                                            })
                                        )}
                                        pagination={false}
                                        onRow={(record) => ({
                                            onClick: () =>
                                                handleRowVariantClick(record),
                                        })}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <CustomizeModal
                        isOpen={isOpenUpdateVariantModal}
                        handleCloseModal={handleCloseUpdateVariantModal}
                        handleSaveModal={
                            productId ? undefined : handleSaveUpdateVariantModal
                        }
                        okText="Lưu"
                        cancelText="Hủy"
                        title={`Cật nhật biến thể ${modalCreateProductStore.skusNameSelected}`}
                        width={800}
                    >
                        <Form
                            form={defaultForm}
                            layout="vertical"
                            className="mt-4"
                            autoComplete="off"
                            onFinish={handleSubformFinish}
                            onFinishFailed={handleSubformFinishFailed}
                        >
                            <Row gutter={24} align={"middle"}>
                                <Col flex={"50%"}>
                                    <Form.Item
                                        label="Giá nhập"
                                        name={getDefaultNamePathVariantFormItem(
                                            "price_import"
                                        )}
                                        className="w-full"
                                        rules={[
                                            {
                                                required: true,
                                                message: `Vui lòng nhập giá nhập`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="w-full h-10"
                                            autoComplete="off"
                                            placeholder="Nhập giá nhập"
                                            disabled={productId ? true : false}
                                            onChange={(e) => {
                                                const namePath =
                                                    getDefaultNamePathVariantFormItem(
                                                        "price_import"
                                                    );
                                                const value =
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                    );
                                                defaultForm.setFieldValue(
                                                    namePath,
                                                    value
                                                );
                                                handleUpdateVariantValue(
                                                    "price_import",
                                                    String(value || "0")
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} align={"middle"}>
                                <Col flex={"50%"}>
                                    <Form.Item
                                        label="Giá bán"
                                        name={getDefaultNamePathVariantFormItem(
                                            "price_sold"
                                        )}
                                        className="w-full"
                                        rules={[
                                            {
                                                required: true,
                                                message: `Vui lòng nhập giá bán`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập giá bán"
                                            className="w-full h-10"
                                            autoComplete="off"
                                            disabled={productId ? true : false}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                    );
                                                defaultForm.setFieldValue(
                                                    getDefaultNamePathVariantFormItem(
                                                        "price_sold"
                                                    ),
                                                    value
                                                );
                                                handleUpdateVariantValue(
                                                    "price_sold",
                                                    String(value || "0")
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col flex={"50%"}>
                                    <Form.Item
                                        label="Giá so sánh"
                                        name={getDefaultNamePathVariantFormItem(
                                            "price_compare"
                                        )}
                                        className="w-full"
                                        rules={[
                                            {
                                                required: true,
                                                message: `Vui lòng nhập giá so sánh`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="w-full h-10"
                                            autoComplete="off"
                                            placeholder="Nhập giá so sánh"
                                            disabled={productId ? true : false}
                                            onChange={(e) => {
                                                const value =
                                                    e.target.value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                    );
                                                defaultForm.setFieldValue(
                                                    getDefaultNamePathVariantFormItem(
                                                        "price_compare"
                                                    ),
                                                    value
                                                );
                                                handleUpdateVariantValue(
                                                    "price_compare",
                                                    String(value || "0")
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} align={"middle"}>
                                <Col flex={"50%"}>
                                    <Form.Item
                                        label="SKU"
                                        name={getDefaultNamePathVariantFormItem(
                                            "masku"
                                        )}
                                        className="w-full"
                                        rules={[
                                            {
                                                required: productId
                                                    ? false
                                                    : true,
                                                message: `Vui lòng nhập SKU`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập SKU"
                                            className="w-full h-10"
                                            autoComplete="off"
                                            onChange={(e) => {
                                                handleUpdateVariantValue(
                                                    "masku",
                                                    String(e.target.value || "")
                                                );
                                            }}
                                            disabled={productId ? true : false}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col flex={"50%"}>
                                    <Form.Item
                                        label="Barcode"
                                        name={getDefaultNamePathVariantFormItem(
                                            "barcode"
                                        )}
                                        className="w-full"
                                        rules={[
                                            {
                                                required: productId
                                                    ? false
                                                    : true,
                                                message: `Vui lòng nhập Barcode`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="w-full h-10"
                                            autoComplete="off"
                                            placeholder="Nhập barcode"
                                            onChange={(e) => {
                                                handleUpdateVariantValue(
                                                    "barcode",
                                                    String(e.target.value || "")
                                                );
                                            }}
                                            disabled={productId ? true : false}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} align={"middle"} justify={"end"}>
                                <Col flex={"100%"}>
                                    <Form.Item
                                        label="Ảnh"
                                        name={getDefaultNamePathVariantFormItem(
                                            "image"
                                        )}
                                        className="w-full"
                                        rules={[
                                            {
                                                required: true,
                                                message: `Vui lòng nhập ảnh`,
                                            },
                                        ]}
                                    >
                                        <div>
                                            {getSkusImage() ? (
                                                <div className="flex justify-center items-center relative">
                                                    {getSkusImage() && (
                                                        <Image
                                                            src={getSkusImage()}
                                                            alt="Variant"
                                                            width={"100%"}
                                                            height={160}
                                                            style={{
                                                                objectFit:
                                                                    "cover",
                                                            }}
                                                            className="!rounded-md"
                                                            fallback="/images/default_product_image.jpg"
                                                        />
                                                    )}
                                                    {!productId && (
                                                        <label
                                                            className="absolute -top-10 right-0 w-8 h-8 flex justify-center items-center hover:bg-red-100 rounded-md cursor-pointer"
                                                            onClick={(e) => {
                                                                {
                                                                    modalCreateProductStore.updateSkusImage(
                                                                        null
                                                                    );
                                                                    defaultForm.setFields(
                                                                        [
                                                                            {
                                                                                name: getDefaultNamePathVariantFormItem(
                                                                                    "image"
                                                                                ),
                                                                                value: null,
                                                                                errors: [],
                                                                            },
                                                                        ]
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <DeleteOutlined className="text-red-600 cursor-pointer text-base" />
                                                        </label>
                                                    )}
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor="imageUpload"
                                                    className="cursor-pointer h-40 rounded-md text-sm flex justify-center items-center"
                                                    style={{
                                                        border: "1px solid #d9d9d9",
                                                    }}
                                                >
                                                    <span className="flex items-center justify-center">
                                                        <UploadOutlined className="mr-1" />
                                                        Tải ảnh lên
                                                    </span>
                                                </label>
                                            )}
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
                                                disabled={
                                                    productId ? true : false
                                                }
                                            />
                                        </div>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <div className="mt-4">
                                {modalCreateProductStore.warehouse_selected
                                    .length > 0 && (
                                    <>
                                        <div
                                            style={{
                                                borderBottom:
                                                    "1px solid #d9d9d9",
                                                paddingBottom: "1rem",
                                                marginBottom: "1rem",
                                            }}
                                        >
                                            <Row gutter={24} align={"top"}>
                                                <Col flex={"50%"}>
                                                    <span>Kho hàng</span>
                                                </Col>
                                                <Col flex={"50%"}>
                                                    <span>Tồn đầu kì</span>
                                                </Col>
                                            </Row>
                                        </div>

                                        {modalCreateProductStore.warehouse_selected && (
                                            <Form.List
                                                name={[
                                                    "skus",
                                                    modalCreateProductStore.skusNameSelected,
                                                    "detail_import",
                                                ]}
                                            >
                                                {(fields) => (
                                                    <>
                                                        {fields.map(
                                                            (
                                                                // item: SelectType,
                                                                // index: number
                                                                rowField
                                                            ) => (
                                                                <Row
                                                                    gutter={24}
                                                                    key={
                                                                        rowField.key
                                                                    }
                                                                    align="top"
                                                                >
                                                                    <Col
                                                                        flex={`50%`}
                                                                    >
                                                                        <span>
                                                                            {
                                                                                modalCreateProductStore
                                                                                    .warehouse_selected[
                                                                                    rowField
                                                                                        .name
                                                                                ]
                                                                                    ?.label
                                                                            }
                                                                        </span>
                                                                    </Col>
                                                                    <Col
                                                                        flex={`50%`}
                                                                    >
                                                                        <Form.Item
                                                                            name={[
                                                                                rowField.name,
                                                                                "quantity_import",
                                                                            ]}
                                                                            rules={[
                                                                                {
                                                                                    required:
                                                                                        true,
                                                                                    message: `Vui lòng nhập số lượng kho biến thể`,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Input
                                                                                placeholder="Nhập số lượng"
                                                                                className="w-full h-10"
                                                                                autoComplete="off"
                                                                                disabled={
                                                                                    productId
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    const value =
                                                                                        e.target.value.replace(
                                                                                            /[^0-9]/g,
                                                                                            ""
                                                                                        );
                                                                                    defaultForm.setFields(
                                                                                        [
                                                                                            {
                                                                                                name: [
                                                                                                    "skus",
                                                                                                    modalCreateProductStore.skusNameSelected,
                                                                                                    "detail_import",
                                                                                                    rowField.name,
                                                                                                    "warehouse_id",
                                                                                                ],
                                                                                                value: modalCreateProductStore
                                                                                                    .warehouse_selected[
                                                                                                    rowField
                                                                                                        .name
                                                                                                ]
                                                                                                    ?.value,
                                                                                            },
                                                                                            {
                                                                                                name: [
                                                                                                    "skus",
                                                                                                    modalCreateProductStore.skusNameSelected,
                                                                                                    "detail_import",
                                                                                                    rowField.name,
                                                                                                    "quantity_import",
                                                                                                ],
                                                                                                value: value,
                                                                                            },
                                                                                        ]
                                                                                    );
                                                                                    handleUpdateVariantValue(
                                                                                        "quantity_import",
                                                                                        String(
                                                                                            e
                                                                                                .target
                                                                                                .value ??
                                                                                                ""
                                                                                        ),
                                                                                        modalCreateProductStore
                                                                                            .warehouse_selected[
                                                                                            rowField
                                                                                                .name
                                                                                        ]
                                                                                            ?.value
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                    <Col
                                                                        flex={`50%`}
                                                                        push={
                                                                            12
                                                                        }
                                                                        className="flex justify-end"
                                                                    >
                                                                        <Form.Item
                                                                            label="Tên lô"
                                                                            name={[
                                                                                rowField.name,
                                                                                "lot_name",
                                                                            ]}
                                                                            className="w-full"
                                                                        >
                                                                            <Input
                                                                                className="w-full h-10"
                                                                                autoComplete="off"
                                                                                placeholder="Nhập tên lô"
                                                                                disabled={
                                                                                    productId
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    defaultForm.setFields(
                                                                                        [
                                                                                            {
                                                                                                name: [
                                                                                                    "skus",
                                                                                                    modalCreateProductStore.skusNameSelected,
                                                                                                    "detail_import",
                                                                                                    rowField.name,
                                                                                                    "lot_name",
                                                                                                ],
                                                                                                value: e
                                                                                                    .target
                                                                                                    .value,
                                                                                            },
                                                                                        ]
                                                                                    );
                                                                                    handleUpdateVariantValue(
                                                                                        "lot_name",
                                                                                        String(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        ),
                                                                                        modalCreateProductStore
                                                                                            .warehouse_selected[
                                                                                            rowField
                                                                                                .name
                                                                                        ]
                                                                                            ?.value
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </Form.Item>
                                                                    </Col>
                                                                </Row>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </Form.List>
                                        )}
                                    </>
                                )}
                            </div>
                        </Form>
                    </CustomizeModal>
                </div>
            );
        });
    // #endregion

    const updateFormVariantValue = useCallback(
        (skusData: IFormSkuCustomData[]) => {
            form.setFields([
                {
                    name: "skus",
                    value: skusData,
                },
            ]);
        },
        [form]
    );

    const validateSkusData = async (imageUrl?: string[]) => {
        const variants: VariantCombinationDto[] = (
            form.getFieldValue("variants") || []
        ).flatMap((item: { name: string; values: { value: string }[] }) =>
            item.values.map((value) => ({
                option_id: item.name,
                value: value.value,
            }))
        );
        if (!variants.length) {
            const defaultDetailImport: SkusDetailImportDto[] =
                modalCreateProductStore.warehouse_selected_quantities.map(
                    (item) => ({
                        warehouse_id: item.warehouse_id,
                        quantity_import: Number(item.quantity_import) || 0,
                        price_import:
                            Number(form.getFieldValue("price_import")) || 0,
                    })
                );
            const defaultSkus: CreateSkusDto = filterEmptyFields({
                price_sold: Number(form.getFieldValue("price_sold")),
                price_compare: Number(form.getFieldValue("price_compare")),
                detail_import: defaultDetailImport,
                name: `${form.getFieldValue("title")} - mặc định`,
                barcode: form.getFieldValue("barcode"),
                masku: form.getFieldValue("masku"),
                image: imageUrl?.length ? imageUrl[0] : "",
            });
            return [defaultSkus];
        } else {
            const skusDetailImport = [
                ...toJS(modalCreateProductStore.skuCustomData).entries(),
            ]
                .map(([name, item]) => ({
                    name,
                    ...item,
                }))
                .flatMap((item) => ({
                    name: item?.name,
                    detail_import: item?.detail_import,
                }));
            if (!skusDetailImport?.length) {
                throw new Error(
                    "Tồn tại chi tiết nhập kho của biến thể không hợp lệ"
                );
            }
            const detailImport: SkusDetailImportDto[] =
                skusDetailImport
                    ?.flatMap(
                        (item: {
                            name: string;
                            detail_import: {
                                warehouse_id: string;
                                quantity_import: number;
                                lot_name: string;
                            }[];
                        }) =>
                            item.detail_import.map(
                                (detail: {
                                    warehouse_id: string;
                                    quantity_import: number;
                                    lot_name: string;
                                }) => ({
                                    name: item.name,
                                    price_import: Number(
                                        form.getFieldValue("price_import")
                                    ),
                                    warehouse_id: detail.warehouse_id,
                                    quantity_import: detail.quantity_import,
                                    lot_name: detail.lot_name,
                                })
                            )
                    )
                    .flat() || [];
            const filePromises = Array.from(
                modalCreateProductStore.skuCustomData.entries()
            ).map(async ([name, item]) => {
                if (!item.image || !item.image.startsWith("data:image/")) {
                    throw new Error(
                        `Chuỗi base64 không hợp lệ cho biến thể ${name}`
                    );
                }
                const file = await convertBase64ToFile(
                    item.image,
                    `${name}.png`
                );
                return { name, file, item };
            });
            // Chờ tất cả file được chuyển đổi
            const fileResults = await Promise.all(filePromises);
            const imageFiles = fileResults.map(({ file }) => file);
            const uploadData = await BaseAPI.uploadImagesToServer(imageFiles);
            if ("path" in uploadData) {
                const { message } = uploadData;
                const errorMessage = Array.isArray(message)
                    ? message.join(", ")
                    : message;
                throw new Error(errorMessage);
            }
            const uploadImage = uploadData.map((data) => data.url);
            if (uploadImage.length !== imageFiles.length) {
                throw new Error(
                    "Số ảnh trả về không khớp với số lượng ảnh tải lên"
                );
            }
            const detail_import_per_sku = detailImport.reduce(
                (acc: Record<string, SkusDetailImportDto[]>, item) => {
                    if (!acc[item.name]) {
                        acc[item.name] = [];
                    }
                    acc[item.name].push({
                        warehouse_id: item.warehouse_id,
                        quantity_import: item.quantity_import,
                        price_import: item.price_import,
                        lot_name: item.lot_name,
                    });
                    return acc;
                },
                {}
            );
            // kiểm tra sku có detail_import rỗng ko
            Object.entries(detail_import_per_sku).forEach(
                ([name, detail_import]) => {
                    if (!detail_import?.length || detail_import.length === 0) {
                        throw new Error(
                            `Chi tiết nhập kho của biến thể ${name} không hợp lệ`
                        );
                    }
                }
            );
            const skusData: CreateSkusDto[] = fileResults.map(
                ({ name, item }, index) => {
                    return filterEmptyFields({
                        name: `${name}`,
                        barcode: item.barcode,
                        masku: item.masku,
                        price_sold: Number(item.price_sold),
                        price_compare: Number(item.price_compare),
                        detail_import: detail_import_per_sku[name],
                        image: uploadImage[index],
                        variant_combinations:
                            modalCreateProductStore.skuCustomData.get(name)
                                .variant_combinations,
                    });
                }
            );
            return skusData;
        }
    };

    const validateProductData = async () => {
        const uploadUrl = await handleUploadProductImage();
        const specifications: CreateProductSpecificationDto[] = form
            .getFieldValue("specifications")
            ?.map((item: { name: string; values: { value: string }[] }) => {
                const values = item.values.map(
                    (value: { value: string }) => value.value
                );
                return values.map((value: string) => ({
                    name: item.name,
                    value: value,
                }));
            })
            .flat();
        if (!productId) {
            const productData: CreateProductDto = filterEmptyFields({
                type: form.getFieldValue("type"),
                slug_product: form.getFieldValue("slug_product"),
                title: form.getFieldValue("title"),
                brand_id: form.getFieldValue("brand_id"),
                category_id: form.getFieldValue("category_id"),
                description: form.getFieldValue("description"),
                specifications: specifications,
                images: uploadUrl,
                skus: (await validateSkusData(uploadUrl)) as CreateSkusDto[],
            });
            return productData;
        } else {
            const productData: UpdateProductDto = filterEmptyFields({
                type: form.getFieldValue("type"),
                slug_product: form.getFieldValue("slug_product"),
                title: form.getFieldValue("title"),
                brand_id: form.getFieldValue("brand_id"),
                category_id: form.getFieldValue("category_id"),
                description: form.getFieldValue("description"),
                specifications: specifications,
                images: uploadUrl,
            });
            return productData;
        }
    };

    const handleUploadProductImage = async () => {
        const productImage = Array.isArray(form.getFieldValue("image"))
            ? form.getFieldValue("image")
            : [];
        if (!productImage?.length) {
            return [];
        }
        const productImagesOriginFile = productImage
            .map((item: UploadFile) =>
                item.originFileObj ? item.originFileObj : item
            )
            .filter((item: any) => item !== undefined && item !== null);
        if (!productImagesOriginFile?.length) {
            return [];
        }
        const uploadedFiles = await BaseAPI.uploadImagesToServer(
            productImagesOriginFile
        );
        if ("path" in uploadedFiles) {
            const { message } = uploadedFiles;
            const errorMessage = Array.isArray(message)
                ? message.join(", ")
                : message;
            throw new Error(errorMessage);
        }
        return uploadedFiles.map((file: ResponseImage) => file.url);
    };

    const handleSubmit = async () => {
        try {
            store.setLoading(true);
            const skusFormValue = form.getFieldValue("skus");
            const validName = [...modalCreateProductStore.skuCustomData.keys()];

            if (!skusFormValue && validName.length > 0) {
                store.setStatusMessage(
                    400,
                    `Dữ liệu biến thể ${validName.join(", ")} chưa điền hoặc không hợp lệ`,
                    "",
                    false
                );
                return;
            }
            if (skusFormValue) {
                const missingValidName = validName.filter((item: string) =>
                    skusFormValue.every(
                        (skus: IFormSkuCustomData) => skus.name !== item
                    )
                );
                if (missingValidName.length > 0) {
                    store.setStatusMessage(
                        400,
                        `Dữ liệu biến thể ${missingValidName.join(", ")} chưa điền hoặc không hợp lệ`,
                        "",
                        false
                    );
                    return;
                }
            }
            const productData = await validateProductData();
            let res = null;
            if (!productId) {
                res = await productStore.createProduct(
                    productData as CreateProductDto
                );
            } else {
                res = await productStore.updateProduct(
                    productId,
                    productData as UpdateProductDto
                );
            }
            if (res) {
                store.setStatusMessage(
                    200,
                    "",
                    messageWhenSave || "Tạo mới sản phẩm thành công",
                    true
                );
                if (loadingData) {
                    loadingData();
                }
                handleCloseCreateProductModal();
            }
        } catch (e) {
            const errorMessage =
                e instanceof Error
                    ? e.message
                    : "Có lỗi xảy ra trong quá trình lưu tạo sản phẩm";
            store.setStatusMessage(500, errorMessage, "", false);
        } finally {
            store.setLoading(false);
        }
    };

    const handleCloseCreateProductModal = () => {
        modalCreateProductStore.clearSkusCustomData();
        modalCreateProductStore.clearVariantCombination();
        modalCreateProductStore.clearWarehouseSelectedAndQuantity();
        form.setFieldsValue({});
        subForm.setFieldsValue({});
        form.resetFields();
        subForm.resetFields();
        onClose();
    };

    const handleSubmitFailed = (errorInfo: any) => {
        const errorMessage =
            errorInfo &&
            typeof errorInfo === "object" &&
            "errorFields" in errorInfo &&
            Array.isArray(errorInfo.errorFields)
                ? "Vui lòng nhập đầy đủ thông tin của sản phẩm"
                : errorInfo instanceof Error
                  ? errorInfo.message
                  : "Có lỗi xảy ra lưu trong quá trình tạo mới sản phẩm";

        store.setStatusMessage(400, errorMessage, "", false);
    };

    const handleFormFieldChange = (changedFields: any, allFields: any) => {};

    const handleFormValueChange = (changedValues: any, values: any) => {};

    useEffect(() => {
        if (formInitialValues) {
            const subFormValue: Record<
                string,
                Omit<IFormSkuCustomData, "name">
            > = subForm.getFieldValue("skus");
            if (subFormValue) {
                modalCreateProductStore.setFullCustomData(subFormValue);
            }
            form.setFieldsValue(formInitialValues);
        }
    }, [formInitialValues]);
    const navigate = useNavigate();
    return (
        <>
            <CustomizeModal
                isOpen={isOpen}
                handleCloseModal={handleCloseCreateProductModal}
                handleSaveModal={onSave}
                okText={okText}
                cancelText={cancelText}
                width={900}
                title={title || "Tạo mới sản phẩm"}
                className="modal-create-product"
            >
                <div className="w-full">
                    <Form
                        form={form}
                        layout="vertical"
                        className="flex flex-col gap-8 w-full"
                        autoComplete="off"
                        onFinish={handleSubmit}
                        onFinishFailed={handleSubmitFailed}
                        onFieldsChange={handleFormFieldChange}
                        onValuesChange={handleFormValueChange}
                    >
                        <GeneralInformation />
                        <SpecificationsInformation />

                        {productId && (
                            <Button
                                onClick={() => {
                                    navigate("/variants", {
                                        state: {
                                            productId: productId,
                                        },
                                    });
                                    handleCloseCreateProductModal();
                                }}
                            >
                                Quản lí biến thể
                            </Button>
                        )}
                        {!productId && (
                            <>
                                <PriceInformation />
                                <InventoryInformation />
                                <VariantInformation defaultForm={subForm} />
                            </>
                        )}
                    </Form>
                </div>
            </CustomizeModal>
        </>
    );
};

export default observer(ModalCreateProduct);
