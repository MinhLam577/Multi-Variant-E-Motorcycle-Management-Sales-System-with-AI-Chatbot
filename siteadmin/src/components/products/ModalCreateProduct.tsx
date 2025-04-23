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
import CustomizeModal from "../common/CustomizeModal";
import "./ModalCreateProduct.css";
import { useStore } from "src/stores";
import ReactQuill from "react-quill";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import CustomizeEditor from "../common/CustomizeEditor";
import { observer } from "mobx-react-lite";
import {
    CloseOutlined,
    DeleteOutlined,
    PlusOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { FormListFieldData } from "antd/lib";
import { action, makeAutoObservable, observable, reaction, toJS } from "mobx";
import { ColumnsType } from "antd/es/table";
import { generateUUIDV4, getBase64 } from "src/utils";
import debounce from "lodash.debounce";
import { AcceptImageTypes } from "src/constants";

type TreeSelectType = {
    title: string;
    value: string;
    children?: TreeSelectType[];
};

type SelectType = {
    label: string;
    value: string;
};

const DEFAULT_MAX_VALUES_EACH_ROW = 1;
const DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT = 5;

interface IModalCreateProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    okText?: string;
    cancelText?: string;
    form: FormInstance;
    categorySelectData: TreeSelectType[];
    brandSelectData: SelectType[];
}

interface IFormListRowData {
    name: string;
    values: {
        value: string;
    }[];
}

interface IVariantCombination {
    name: string;
    details: { option_id: string; value: string }[];
}

interface ISkuCustomData {
    name: string;
    price_sold?: number;
    price_compare?: number;
    price_import?: number;
    barcode?: string;
    masku?: string;
    image?: string;
    detail_import?: Array<{
        warehouse_id: string;
        quantity_import: number;
    }>;
}

interface SkuCustomInputData {
    price_sold?: string;
    price_compare?: string;
    price_import?: string;
    barcode?: string;
    masku?: string;
    image?: string;
    detail_import?: Array<{
        warehouse_id: string;
        quantity_import: string;
    }>;
}

interface IFormListRowProps {
    rowField: FormListFieldData;
    removeRow: (index: number | number[]) => void;
    fieldValue: string;
    initialOptions: SelectType[];
    formItemLabel?: string;
    placeholderSelect?: string;
    maxFormListInputValue?: number;
    showAddValue?: boolean;
}

interface IFormListSelectProps {
    formListName: string | number | (string | number)[];
    fieldValue: string;
    initialOptions: SelectType[];
    formItemLabel: string;
    placeholderSelect: string;
    renderComponent?: React.ComponentType<any>;
    maxFormListInputValue?: number;
    showAddValue?: boolean;
}

interface IFormListValueColProps {
    rowField: FormListFieldData;
    fieldValue: string;
    maxFormListInputValue: number;
    formItemLabel?: string;
    showAddValue?: boolean;
}

interface IFormListValueColRenderProps {
    rowField: FormListFieldData;
    fieldValue: string;
    formListName?: string | number | (string | number)[];
    formItemName?: string;
    callback?: (...args: any[]) => void;
    component?: React.ComponentType<any>;
    showAddValue?: boolean;
}

class SpinningStore {
    spins = false;
    constructor() {
        makeAutoObservable(this);
        this.setSpins = this.setSpins.bind(this);
    }
    setSpins(value: boolean) {
        this.spins = value;
    }
}
export const spinning_store = new SpinningStore();

class ModalCreateProductStore {
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
    form: FormInstance;
    skuCustomData: Map<string, Omit<ISkuCustomData, "name">> = new Map();
    skusNameSelected: string;
    showSpecForm: boolean = false
    showVariantForm: boolean = false
    constructor(form: FormInstance) {
        makeAutoObservable(this, {
            skuCustomData: observable,
            setSkuCustomData: action,
        });
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
        this.form = form;
        this.setPrice = this.setPrice.bind(this);
        this.setWarehouseSelected = this.setWarehouseSelected.bind(this);
        this.setWarehouseOptions = this.setWarehouseOptions.bind(this);
        this.setFormVariantValue = this.setFormVariantValue.bind(this);
        this.setBarcode = this.setBarcode.bind(this);
        this.setMasku = this.setMasku.bind(this);
        this.setWarehouse_selected_quantities =
            this.setWarehouse_selected_quantities.bind(this);
        this.setSkuCustomData = this.setSkuCustomData.bind(this);
    }

    setWarehouseSelected(value: SelectType[]) {
        if (!Array.isArray(value)) {
            return;
        }
        this.warehouse_selected = value;
    }
    setShowSpecForm(value: boolean) {
      if(typeof value === "boolean")
        this.showSpecForm = value
    }
    setShowVariantForm(value: boolean) {
      if(typeof value === "boolean"){
        this.showVariantForm = value
      }
    }
    setWarehouse_selected_quantities(
        quantity_import: string = "0",
        warehouse_id: string
    ) {
        let convertQuantity: number = 0;
        try {
            convertQuantity = Number(quantity_import);
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
                            };
                        }

                        // Thêm mục mới cho kho chưa có
                        return {
                            warehouse_id: wh.warehouse_id,
                            quantity_import: wh.quantity_import || 0,
                        };
                    });
                // Cập nhật skuCustomData với detail_import mới
                this.setSkuCustomData(name, {
                    detail_import: updatedDetailImport.map((d) => ({
                        warehouse_id: d.warehouse_id,
                        quantity_import: String(d.quantity_import),
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

    setSkuCustomData(name: string, data: Partial<SkuCustomInputData>) {
        const validData: Partial<Omit<ISkuCustomData, "name">> = {};
        if (data.price_sold !== undefined) {
            const numberValue = Number(data.price_sold);
            if (!isNaN(numberValue) && numberValue >= 0) {
                validData.price_sold = numberValue;
            }
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
        if (data.image) {
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
                        };
                    }
                    return null;
                })
                .filter((d) => d !== null);
        }
        const existing = this.skuCustomData.get(name);
        if (Object.keys(validData).length > 0) {
            this.skuCustomData.set(name, { ...existing, ...validData });
        } else if (existing) {
            this.skuCustomData.delete(name);
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
    } {
        return {
            warehouse_id,
            quantity_import:
                this.warehouse_selected_quantities.find(
                    (q) => q.warehouse_id === warehouse_id
                )?.quantity_import || 0,
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
            })),
        });
    }

    updateSkusBarcode(value: string) {
        if (!this.skusNameSelected) return;
        this.setSkuCustomData(this.skusNameSelected, {
            barcode: value || undefined,
        });
    }

    updateSkusMasku(value: string) {
        if (!this.skusNameSelected) return;
        this.setSkuCustomData(this.skusNameSelected, {
            masku: value || undefined,
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
const ModalCreateProduct: React.FC<IModalCreateProductProps> = ({
    isOpen,
    onClose,
    onSave,
    okText,
    cancelText,
    form,
    categorySelectData,
    brandSelectData,
}) => {
    const store = useStore();
    const modalCreateProductStore = useMemo(
        () => new ModalCreateProductStore(form),
        []
    );
    const quillRef = useRef<ReactQuill>(null);
    const productStore = store.productObservable;
    const handleQuillChange = (content: string, delta, source, editor) => {
        try {
            form.setFieldValue("description", content);
        } catch (e) {}
    };

    const initialOptionsBrand: SelectType[] = [
        { label: "Nhãn hàng A", value: "BA" },
        { label: "Nhãn hàng B", value: "BB" },
        { label: "Nhãn hàng C", value: "BC" },
    ];
    const initialOptionsCategory: TreeSelectType[] = [
        {
            title: "Điện tử",
            value: "electronics",
            children: [
                {
                    title: "Điện thoại",
                    value: "mobile-phones",
                    children: [
                        { title: "iPhone", value: "iphone", children: [] },
                        { title: "Samsung", value: "samsung", children: [] },
                        { title: "Xiaomi", value: "xiaomi", children: [] },
                    ],
                },
                {
                    title: "Laptop",
                    value: "laptops",
                    children: [
                        { title: "MacBook", value: "macbook", children: [] },
                        { title: "Dell", value: "dell", children: [] },
                        { title: "HP", value: "hp", children: [] },
                    ],
                },
            ],
        },
        {
            title: "Thời trang",
            value: "fashion",
            children: [
                {
                    title: "Nam",
                    value: "men",
                    children: [
                        { title: "Áo sơ mi", value: "shirt-men", children: [] },
                        {
                            title: "Quần jean",
                            value: "jeans-men",
                            children: [],
                        },
                    ],
                },
                {
                    title: "Nữ",
                    value: "women",
                    children: [
                        { title: "Váy", value: "dress-women", children: [] },
                        {
                            title: "Áo thun",
                            value: "tshirt-women",
                            children: [],
                        },
                    ],
                },
            ],
        },
        {
            title: "Đồ gia dụng",
            value: "home-appliances",
            children: [
                {
                    title: "Nhà bếp",
                    value: "kitchen",
                    children: [
                        {
                            title: "Nồi chiên không dầu",
                            value: "air-fryer",
                            children: [],
                        },
                        {
                            title: "Máy xay sinh tố",
                            value: "blender",
                            children: [],
                        },
                    ],
                },
                {
                    title: "Phòng khách",
                    value: "living-room",
                    children: [
                        {
                            title: "Máy lọc không khí",
                            value: "air-purifier",
                            children: [],
                        },
                        { title: "Quạt điện", value: "fan", children: [] },
                    ],
                },
            ],
        },
    ];

    const initialOptionsSpec: SelectType[] = [
        { label: "Màu sắc", value: "color" },
        { label: "Kích thước", value: "size" },
        { label: "Chất liệu", value: "material" },
    ];
    const initialOptionsInventory: SelectType[] = [
        { label: "Kho chính", value: "main" },
        { label: "Kho phụ", value: "sub" },
        { label: "Kho tạm", value: "temp" },
        { label: "Kho 1", value: "warehouse1" },
        { label: "Kho 2", value: "warehouse2" },
        { label: "Kho 3", value: "warehouse3" },
    ];
    const initialOptionsVariant: SelectType[] = [
        { label: "Thuộc tính 1", value: "color" },
        { label: "Thuộc tính 2", value: "size" },
        { label: "Thuộc tính 4", value: "material" },
    ];

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
          const currentImages = form.getFieldValue("image") || [];
          if (JSON.stringify(currentImages) !== JSON.stringify(formImageList)) {
            form.setFieldsValue({
              image: formImageList
            })
          }
        }, [form, formImageList]);

        return (
            <div className="flex flex-col gap-4 bg-white rounded-md p-4">
                <h2 className="text-base text-gray-900 font-semibold border-b border-b-gray-500 shadow-sm !m-0 pb-2">
                    Thông tin chung
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
                                label="Nhãn hàng"
                                name={"brand_id"}
                                className="w-full"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng chọn nhãn hàng",
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn nhãn hàng"
                                    showSearch
                                    className="h-10"
                                    options={initialOptionsBrand}
                                    defaultActiveFirstOption={true}
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
                            >
                                <TreeSelect
                                    placeholder="Chọn danh mục"
                                    showSearch
                                    treeData={initialOptionsCategory}
                                    className="h-10"
                                    treeDefaultExpandAll
                                    allowClear
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
                                setSpins={spinning_store.setSpins}
                                className="w-full h-full"
                                defaultForm={form}
                            />
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="Hình ảnh sản phẩm"
                        tooltip={`Ảnh nhận định dạng ${AcceptImageTypes.map((image) => "." + image.split("/")[1]).join(", ")}, có tỷ lệ 1:1 (Ảnh vuông) và được chọn tối đa 5 hình ảnh`}
                        valuePropName="image"
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
                                            productStore.setStatusMessage(
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
                                            productStore.setStatusMessage(
                                                400,
                                                `Chỉ được upload tối đa ${DEFAULT_MAX_IMAGE_UPLOAD_PRODUCT} ảnh!`,
                                                ""
                                            );
                                            return false;
                                        }
                                        return true;
                                    }}
                                    onChange={(info) => {
                                      setFormImageList([...info.fileList])
                                    }}
                                    fileList={formImageList.length ? formImageList : undefined}
                                    customRequest={async ({
                                        file,
                                        onSuccess,
                                        onError,
                                    }) => {
                                        try {
                                          const base64Url = await getBase64(file as File);
                                        //   const uploadedFiles = await BaseAPI.uploadImagesToServer(
                                        //     files,
                                        //     folder
                                        // );
                                          onSuccess?.({url: base64Url}, file);
                                          productStore.setStatusMessage(200, "", "Tải ảnh thành công", true);
                                        } catch (error) {
                                          const errorrMsg = error instanceof Error ? error.message : "có lỗi xảy ra khi xử lí request ảnh"
                                          productStore.setStatusMessage(500, errorrMsg, "", false);
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

    //#region Xử lý sự kiện thông số kỹ thuật

    // Hàm lấy các tùy chọn có sẵn cho thông số kỹ thuật và loại bỏ các tùy chọn đã chọn
    const getAvailableSpecSelectOptions = (
        currentFieldName: number,
        fieldValueName: string,
        initialOptions: SelectType[]
    ) => {
        const fieldValues = form.getFieldValue(fieldValueName) || [];
        const selectedNames = fieldValues
            .map((item: { name: string }, index: number) => ({
                name: item?.name,
                index,
            }))
            .filter(
                (item: { name: string; index: number }) =>
                    item.name && item.index !== currentFieldName
            )
            .map((item: { name: string }) => item.name);
        return initialOptions.filter(
            (option) => !selectedNames.includes(option.value)
        );
    };

    // Hàm xử lý sự kiện thêm thông số kỹ thuật
    // Hàm thêm giá trị thông số kỹ thuật vào ref
    const addSpecValueRefs = useRef<Map<number, (value?: any) => void>>(
        new Map()
    );
    // Callback để cật nhật lại hàm thêm giá trị thông số kỹ thuật vào ref
    const setAddSpecValueRef = useCallback(
        (fieldName: number, addValue: (value?: any) => void) => {
            addSpecValueRefs.current.set(fieldName, addValue);
        },
        []
    );
    // Hàm thêm giá trị thông số kỹ thuật
    const handleAddFormListValue = useCallback(
        (
            fieldName: number,
            fieldValue: string,
            maxFormListInputValue: number = DEFAULT_MAX_VALUES_EACH_ROW,
            formItemLabel?: string
        ) => {
            const formFieldValues = form.getFieldValue(fieldValue) || [];
            const currentValues = formFieldValues[fieldName]?.values || [];
            if (currentValues.length >= maxFormListInputValue) {
                productStore.setStatusMessage(
                    400,
                    `Chỉ nhập tối đa ${maxFormListInputValue} giá trị cho mỗi ${formItemLabel || fieldValue}`,
                    "",
                    false
                );
                return;
            }
            addSpecValueRefs.current.get(fieldName)?.({ value: "" });
        },
        [form]
    );

    // Hàm thêm hàng thông số kỹ thuật
    const handleAddFormListRow = useCallback(
        (
            add: (value?: any) => void,
            fieldValue: string,
            formItemLabel: string
        ) => {
            const formFieldValues = form.getFieldValue(fieldValue) || [];
            const selectedNames = formFieldValues
                .map((item: { name: string }) => item?.name)
                .filter((name: string) => name);
            const availableOptions = initialOptionsSpec.filter(
                (option) => !selectedNames.includes(option.value)
            );
            const defaultName = availableOptions[0]?.value || "";
            if (defaultName === "") {
                productStore.setStatusMessage(
                    400,
                    `Đã đạt giới hạn ${formItemLabel} cho phép`,
                    "",
                    false
                );
                return;
            }
            add({
                name: defaultName,
                values: [
                    {
                        value: "",
                    },
                ],
            });
        },
        [form]
    );

    const handleCheckSpec =  useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const defaultFirstSpec = initialOptionsSpec[0]?.value || "";
            const specifications = [
                { name: defaultFirstSpec, values: [{ value: "" }] },
            ];
            form.setFieldsValue({
                specifications: specifications,
            });
            modalCreateProductStore.setShowSpecForm(true)
        } else {
            modalCreateProductStore.setShowSpecForm(false)
            form.resetFields(["specifications"]);
        }
    }, []);

    // Hàm render ra form list input
    const ValueColRender: React.FC<IFormListValueColRenderProps> = ({
        callback,
        formListName,
        formItemName,
        rowField,
        component,
        fieldValue,
        showAddValue,
    }) => {
        const [isDuplicateCleared, setIsDuplicateCleared] = useState(false);
        const debouncedResetVariantValueFields: (
            fieldPath: (string | number)[]
        ) => void = useCallback(
            debounce((fieldPath: (string | number)[]) => {
                form.setFields([
                    {
                        name: fieldPath,
                        value: "",
                        errors: [],
                    },
                ]);
                modalCreateProductStore.setFormVariantValue({
                    variants: form.getFieldValue(fieldValue),
                });
                setIsDuplicateCleared(true);
            }, 500),
            [form]
        );

        const getExistingValues = (valueFieldName: number) => {
            const rootFieldPathFormItem = [fieldValue, formListName].flat();
            const existingValues =
                form.getFieldValue(rootFieldPathFormItem) || [];
            return (
                existingValues
                    .map((item: { value: string }) => item.value.trim())
                    .filter((_, index: number) => index !== valueFieldName) ||
                []
            );
        };
        return (
            <Form.List name={formListName}>
                {(valueFields, { add: addValue, remove: removeValue }) => {
                    if (callback && rowField && showAddValue) {
                        callback(rowField.name, addValue);
                    }
                    return (
                        <div className="flex flex-col gap-4 w-full">
                            {valueFields &&
                                Array.isArray(valueFields) &&
                                valueFields.map((valueField) => {
                                    const fieldPathFormItem = [
                                        valueField.name,
                                        formItemName || "value",
                                    ];
                                    const rootFieldPathFormItem = [
                                        fieldValue,
                                        formListName,
                                    ].flat();
                                    return (
                                        <div
                                            key={valueField.key}
                                            className="flex items-start justify-between gap-1 w-full"
                                        >
                                            <Form.Item
                                                name={fieldPathFormItem}
                                                rules={[
                                                    {
                                                        required:
                                                            !isDuplicateCleared,
                                                        message:
                                                            "Vui lòng nhập giá trị thuộc tính",
                                                    },
                                                    {
                                                        validator: (
                                                            _,
                                                            value
                                                        ) => {
                                                            if (!value) {
                                                                return Promise.resolve();
                                                            }
                                                            const existingValues =
                                                                getExistingValues(
                                                                    valueField.name
                                                                );
                                                            if (
                                                                existingValues.includes(
                                                                    value.trim()
                                                                )
                                                            ) {
                                                                return Promise.reject(
                                                                    new Error(
                                                                        "Giá trị đã tồn tại"
                                                                    )
                                                                );
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                                className="w-full mb-0"
                                            >
                                                <Input
                                                    placeholder="Nhập giá trị"
                                                    className="w-full p-[0.625rem] h-10"
                                                    autoComplete="off"
                                                    onBlur={(e) => {
                                                        const value =
                                                            e.target.value.trim();
                                                        const existingValues =
                                                            getExistingValues(
                                                                valueField.name
                                                            );
                                                        const rootFieldPathFormValue =
                                                            [
                                                                ...rootFieldPathFormItem,
                                                                valueField.name,
                                                                formItemName ||
                                                                    "value",
                                                            ].flat();
                                                        if (
                                                            !existingValues.includes(
                                                                value
                                                            )
                                                        ) {
                                                            modalCreateProductStore.setFormVariantValue(
                                                                form.getFieldsValue(
                                                                    [fieldValue]
                                                                )
                                                            );
                                                            setIsDuplicateCleared(
                                                                false
                                                            );
                                                        } else {
                                                            debouncedResetVariantValueFields(
                                                                rootFieldPathFormValue
                                                            );
                                                        }
                                                    }}
                                                />
                                            </Form.Item>

                                            {component &&
                                                React.createElement(component, {
                                                    onClick: () => {
                                                        removeValue(
                                                            valueField.name
                                                        );
                                                        modalCreateProductStore.setFormVariantValue(
                                                            {
                                                                variants:
                                                                    form.getFieldValue(
                                                                        fieldValue
                                                                    ),
                                                            }
                                                        );
                                                    },
                                                    style: {
                                                        visibility:
                                                            valueFields.length >
                                                            1
                                                                ? "visible"
                                                                : "hidden",
                                                    },
                                                })}
                                        </div>
                                    );
                                })}
                        </div>
                    );
                }}
            </Form.List>
        );
    };

    // Hàm render ra cột select của form list
    const SelectCol: React.FC<IFormListRowProps> = ({
        rowField,
        removeRow,
        formItemLabel,
        placeholderSelect,
        fieldValue,
        initialOptions,
    }) => {
        const availableOptions = useMemo(
            () =>
                getAvailableSpecSelectOptions(
                    rowField.name,
                    fieldValue,
                    initialOptions
                ),
            [form.getFieldValue(fieldValue), rowField.name]
        );
        return (
            <Col xs={10} md={10} lg={10} xl={10}>
                <div className="flex items-center justify-between gap-4 w-full">
                    <Form.Item
                        label={formItemLabel || "Default title"}
                        name={[rowField.name, "name"]}
                        className="w-full"
                    >
                        <Select
                            options={availableOptions || []}
                            defaultActiveFirstOption={true}
                            showSearch
                            placeholder={placeholderSelect || "Chọn dữ liệu"}
                            className="h-10"
                        />
                    </Form.Item>
                    <button
                        className="flex items-center justify-center text-[red] w-10 h-10 border-none outline-none hover:bg-[rgb(255,0,0,0.2)] cursor-pointer bg-transparent text-lg"
                        onClick={() => {
                            removeRow(rowField.name);
                            modalCreateProductStore.setFormVariantValue({
                                variants: form.getFieldValue(fieldValue),
                            });
                        }}
                    >
                        <DeleteOutlined />
                    </button>
                </div>
            </Col>
        );
    };

    // Hàm render ra cột giá trị input của form list
    const ValueCol: React.FC<IFormListValueColProps> = ({
        rowField,
        fieldValue,
        maxFormListInputValue,
        formItemLabel,
        showAddValue = true,
    }) => {
        return (
            <Col xs={13} md={13} lg={13} xl={13}>
                <div className="flex flex-col items-center justify-between w-full relative">
                    {showAddValue && (
                        <Button
                            type="primary"
                            shape="circle"
                            size="small"
                            onClick={() =>
                                handleAddFormListValue(
                                    rowField.name,
                                    fieldValue,
                                    maxFormListInputValue,
                                    formItemLabel
                                )
                            }
                            className="absolute -top-1 left-14 border-none outline-none text-lg cursor-pointer flex items-center justify-center z-50"
                        >
                            <PlusOutlined className="text-[var(--primary-color)]" />
                        </Button>
                    )}
                    <Form.Item label="Giá trị" className="w-full ">
                        <ValueColRender
                            formListName={[rowField.name, "values"]}
                            formItemName={"value"}
                            callback={setAddSpecValueRef}
                            rowField={rowField as FormListFieldData}
                            component={({ onClick, style }) => (
                                <button
                                    className="flex items-center justify-center text-[black] w-10 h-10 border-none outline-none cursor-pointer bg-transparent text-lg"
                                    onClick={onClick}
                                    style={style}
                                >
                                    <CloseOutlined />
                                </button>
                            )}
                            fieldValue={fieldValue}
                            showAddValue={showAddValue}
                        />
                    </Form.Item>
                </div>
            </Col>
        );
    };

    // Hàm render ra một row trong form list
    const FormListRow: React.FC<IFormListRowProps> = ({
        rowField,
        removeRow,
        fieldValue,
        initialOptions,
        formItemLabel,
        placeholderSelect,
        maxFormListInputValue,
        showAddValue,
    }) => {
        return (
            <div
                className="py-4"
                style={{
                    borderBottom: "1px solid #d9d9d9",
                }}
            >
                <Row gutter={24} justify="space-between">
                    <SelectCol
                        rowField={rowField}
                        removeRow={removeRow}
                        formItemLabel={formItemLabel}
                        placeholderSelect={placeholderSelect}
                        fieldValue={fieldValue}
                        initialOptions={initialOptions}
                    />

                    <ValueCol
                        rowField={rowField as FormListFieldData}
                        fieldValue={fieldValue}
                        maxFormListInputValue={maxFormListInputValue}
                        formItemLabel={formItemLabel}
                        showAddValue={showAddValue}
                    />
                </Row>
            </div>
        );
    };

    // Hàm render ra form list select và giá trị select
    const FormListSelect: React.FC<IFormListSelectProps> = ({
        formListName,
        fieldValue,
        initialOptions,
        formItemLabel,
        placeholderSelect,
        renderComponent,
        maxFormListInputValue = DEFAULT_MAX_VALUES_EACH_ROW,
        showAddValue,
    }) => {
        return (
            <Form.List name={formListName}>
                {(rowFields, { add: addRow, remove: removeRow }) => (
                    <div className="flex flex-col">
                        {rowFields.map((rowField) => (
                            <FormListRow
                                key={rowField.key}
                                rowField={rowField}
                                removeRow={removeRow}
                                fieldValue={fieldValue}
                                initialOptions={initialOptions}
                                formItemLabel={formItemLabel}
                                placeholderSelect={placeholderSelect}
                                maxFormListInputValue={maxFormListInputValue}
                                showAddValue={showAddValue}
                            />
                        ))}
                        {renderComponent &&
                            React.createElement(renderComponent, {
                                onClick: () =>
                                    handleAddFormListRow(
                                        addRow,
                                        fieldValue,
                                        formItemLabel
                                    ),
                            })}
                    </div>
                )}
            </Form.List>
        );
    };

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
                        paddingBottom: modalCreateProductStore.showSpecForm ? "1rem" : "0",
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
                        <FormListSelect
                            formListName="specifications"
                            fieldValue="specifications"
                            initialOptions={initialOptionsSpec}
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
                        />
                    )}
                    
                    {/* <FormListSelect
                        formListName="specifications"
                        fieldValue="specifications"
                        initialOptions={initialOptionsSpec}
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
                    /> */}
                </div>
            </div>
        );
    });
    //#endregion

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
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập giá bán"
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
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập giá so sánh"
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
            form.setFieldsValue({ detail_import: [] });
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
                                            if (!value) {
                                                return Promise.reject(
                                                    new Error(
                                                        "Vui lòng nhập giá vốn"
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
                                        if (!modalCreateProductStore.hasSkus) {
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
                                        if (!modalCreateProductStore.hasSkus) {
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
                                        if (!modalCreateProductStore.hasSkus) {
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

    const [subForm] = Form.useForm();
    const handleCheckVariant = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const defaultVariant = initialOptionsVariant[0].value || "";
            const variants = [
                { name: defaultVariant, values: [{ value: "" }] },
            ];
            form.setFieldsValue({
                variants: variants,
            });
            modalCreateProductStore.setShowVariantForm(true)
        } else {
            modalCreateProductStore.setShowVariantForm(false)
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
                                                  }
                                              ).quantity_import || 0,
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
                        Omit<ISkuCustomData, "name">,
                    ][]
                )
                    .filter(([name, value]) => validKeyValues.includes(name))
                    .map(([name, value]) => ({
                        name,
                        ...value,
                    }));
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

                productStore.setStatusMessage(400, errorMessage, "", false);
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

            const handleUploadVariantImage = (
                e: React.ChangeEvent<HTMLInputElement>
            ) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 2 * 1024 * 1024) {
                    productStore.setStatusMessage(
                        400,
                        "Kích thước ảnh không được vượt quá 2MB",
                        "",
                        false
                    );
                    return;
                }
                if (!AcceptImageTypes.includes(file.type)) {
                    productStore.setStatusMessage(
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
                    productStore.setStatusMessage(
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
                            paddingBottom: modalCreateProductStore.showSpecForm ? "1rem" : "0",
                        }}
                    >
                        <input
                            type="checkbox"
                            onChange={(e) => {
                                handleCheckVariant(e);
                            }}
                            id="variantCheck"
                            checked={modalCreateProductStore.showVariantForm}
                        />
                        <label htmlFor="variantCheck" className="text-sm">
                            Chọn để nhập các biến thể của sản phẩm
                        </label>
                    </div>
                    {modalCreateProductStore.showVariantForm && (
                        <div className="flex flex-col gap-4">
                            <FormListSelect
                                formListName="variants"
                                fieldValue="variants"
                                initialOptions={initialOptionsVariant}
                                formItemLabel="Thuộc tính của biến thể"
                                placeholderSelect="Chọn thuộc tính"
                                renderComponent={({ onClick }) => (
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
                                )}
                                maxFormListInputValue={5}
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
                        handleSaveModal={handleSaveUpdateVariantModal}
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
                                                message: `Vui lòng nhập giá nhập của biến thể ${modalCreateProductStore.skusNameSelected}`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="w-full h-10"
                                            autoComplete="off"
                                            placeholder="Nhập giá nhập"
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
                                            disabled={
                                                !modalCreateProductStore.skusNameSelected
                                            }
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
                                                message: `Vui lòng nhập giá bán của biến thể ${modalCreateProductStore.skusNameSelected}`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập giá bán"
                                            className="w-full h-10"
                                            autoComplete="off"
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
                                            disabled={
                                                !modalCreateProductStore.skusNameSelected
                                            }
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
                                                message: `Vui lòng nhập giá so sánh của biến thể ${modalCreateProductStore.skusNameSelected}`,
                                            },
                                        ]}
                                    >
                                        <Input
                                            className="w-full h-10"
                                            autoComplete="off"
                                            placeholder="Nhập giá so sánh"
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
                                            disabled={
                                                !modalCreateProductStore.skusNameSelected
                                            }
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
                                                required: true,
                                                message: `Vui lòng nhập SKU của biến thể ${modalCreateProductStore.skusNameSelected}`,
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
                                                    String(e.target.value ?? "")
                                                );
                                            }}
                                            disabled={
                                                !modalCreateProductStore.skusNameSelected
                                            }
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
                                                required: true,
                                                message: `Vui lòng nhập Barcode của biến thể ${modalCreateProductStore.skusNameSelected}`,
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
                                                    String(e.target.value ?? "")
                                                );
                                            }}
                                            disabled={
                                                !modalCreateProductStore.skusNameSelected
                                            }
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
                                                message: `Vui lòng nhập ảnh của biến thể ${modalCreateProductStore.skusNameSelected}`,
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (value) {
                                                        if (
                                                            !value.startsWith(
                                                                "data:image/"
                                                            )
                                                        ) {
                                                            return Promise.reject(
                                                                "Ảnh không hợp lệ!"
                                                            );
                                                        }
                                                    }
                                                    return Promise.resolve();
                                                },
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
                                                        {modalCreateProductStore.warehouse_selected.map(
                                                            (
                                                                item: SelectType,
                                                                index: number
                                                            ) => (
                                                                <Row
                                                                    gutter={24}
                                                                    key={
                                                                        item.value
                                                                    }
                                                                    align="top"
                                                                >
                                                                    <Col flex="50%">
                                                                        <span>
                                                                            {
                                                                                item.label
                                                                            }
                                                                        </span>
                                                                    </Col>
                                                                    <Col flex="50%">
                                                                        <Form.Item
                                                                            name={[
                                                                                index,
                                                                                "quantity_import",
                                                                            ]}
                                                                            rules={[
                                                                                {
                                                                                    required:
                                                                                        true,
                                                                                    message: `Vui lòng nhập số lượng của kho biến thể`,
                                                                                },
                                                                            ]}
                                                                        >
                                                                            <Input
                                                                                placeholder="Nhập số lượng"
                                                                                className="w-full h-10"
                                                                                autoComplete="off"
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
                                                                                                    index,
                                                                                                    "warehouse_id",
                                                                                                ],
                                                                                                value: item.value,
                                                                                            },
                                                                                            {
                                                                                                name: [
                                                                                                    "skus",
                                                                                                    modalCreateProductStore.skusNameSelected,
                                                                                                    "detail_import",
                                                                                                    index,
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
                                                                                        item.value
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

    const updateFormVariantValue = useCallback((skusData: ISkuCustomData[]) => {
        form.setFields([
            {
                name: "skus",
                value: skusData,
            },
        ]);
    }, []);

    const validateDefaultSkus = () => {
        // Hàm hiển thị thông báo lỗi
        const showError = (message) => {
            productStore.setStatusMessage(400, message, "", false);
            return false; // Trả về false để báo lỗi
        };

        // Kiểm tra kho hàng
        if (
            modalCreateProductStore.warehouse_selected.length === 0 ||
            modalCreateProductStore.warehouse_selected_quantities.length ===
                0 ||
            modalCreateProductStore.warehouse_selected_quantities.length !==
                modalCreateProductStore.warehouse_selected.length
        ) {
            return showError(
                "Vui lòng chọn kho hàng hoặc nhập đầy đủ số lượng kho cho biến thể mặc định"
            );
        }

        // Kiểm tra quantity_import
        const hasMissingQuantity =
            modalCreateProductStore.warehouse_selected_quantities.some(
                (item) => !item.quantity_import && item.quantity_import !== 0
            );
        if (hasMissingQuantity) {
            return showError(
                "Vui lòng nhập số lượng tồn kho cho biến thể mặc định"
            );
        }

        // Danh sách các field cần kiểm tra
        const requiredFields = [
            {
                key: "barcode",
                message: "Vui lòng nhập barcode cho biến thể mặc định",
            },
            {
                key: "masku",
                message: "Vui lòng nhập SKU cho biến thể mặc định",
            },
            {
                key: "price_compare",
                message: "Vui lòng nhập giá so sánh cho biến thể mặc định",
            },
            {
                key: "price_import",
                message: "Vui lòng nhập giá nhập cho biến thể mặc định",
            },
            {
                key: "price_sold",
                message: "Vui lòng nhập giá bán cho biến thể mặc định",
            },
        ];

        // Kiểm tra các field bắt buộc
        for (const field of requiredFields) {
            if (!modalCreateProductStore[field.key]) {
                return showError(field.message);
            }
        }

        // Tạo defaultSkus
        const defaultSkus = {
            name: `Default name ${form.getFieldValue("name")}`,
            barcode: modalCreateProductStore.barcode,
            masku: modalCreateProductStore.masku,
            price_import: modalCreateProductStore.price_import,
            price_sold: modalCreateProductStore.price_sold,
            price_compare: modalCreateProductStore.price_compare,
            image: null,
            detail_import:
                modalCreateProductStore.warehouse_selected_quantities.map(
                    ({ warehouse_id, quantity_import }) => ({
                        warehouse_id,
                        quantity_import,
                    })
                ),
        };

        console.log("values", form.getFieldsValue(true));
        return defaultSkus;
    };

    const handleSubmit = () => {
        const skusFormValue = form.getFieldValue("skus");
        const validName = [...modalCreateProductStore.skuCustomData.keys()];
        if (!skusFormValue) {
            if (validName.length > 0) {
                productStore.setStatusMessage(
                    400,
                    `Dữ liệu biến thể ${validName.join(", ")} chưa điền hoặc ko hợp lệ`,
                    "",
                    false
                );
                return;
            }

            const defaultSkus = {
                name: `Default name ${form.getFieldValue("name")}`,
                barcode: modalCreateProductStore.barcode,
                masku: modalCreateProductStore.masku,
                price_import: modalCreateProductStore.price_import,
                price_sold: modalCreateProductStore.price_sold,
                price_compare: modalCreateProductStore.price_compare,
                image: null,
                detail_import:
                    modalCreateProductStore.warehouse_selected_quantities.map(
                        ({ warehouse_id, quantity_import }) => ({
                            warehouse_id,
                            quantity_import,
                        })
                    ),
            };

            console.log("values", form.getFieldsValue(true));
            console.log("defaultSkus", defaultSkus);
            return;
        }
        const missingValidName = validName.filter((item: string) =>
            skusFormValue.every((skus: ISkuCustomData) => skus.name !== item)
        );
        if (missingValidName.length > 0) {
            productStore.setStatusMessage(
                400,
                `Dữ liệu biến thể ${missingValidName.join(", ")} chưa điền hoặc ko hợp lệ`,
                "",
                false
            );
            return;
        }

        // subForm
        //     .validateFields(
        //         validName.map((value) => ({
        //             skus: value,
        //         }))
        //     )
        //     .catch((values: any) => {
        //         const errorMessage =
        //             values?.errorFields
        //                 ?.map((item: any) => item?.errors)
        //                 ?.flat()
        //                 ?.join(", ") ||
        //             "Có lỗi xảy ra lưu trong quá trình tạo mới sản phẩm ở biến thể";
        //         productStore.setStatusMessage(400, errorMessage, "", false);
        //         return;
        //     });
      console.log("values", form.getFieldsValue(true));
    };

    const handleSubmitFailed = (errorInfo: any) => {
        const errorMessage =
            errorInfo &&
            typeof errorInfo === "object" &&
            "errorFields" in errorInfo &&
            Array.isArray(errorInfo.errorFields)
                ? "Vui lòng nhập đầy đủ thông tin của biến thể mặc định"
                : errorInfo instanceof Error
                  ? errorInfo.message
                  : "Có lỗi xảy ra lưu trong quá trình tạo mới sản phẩm";

        productStore.setStatusMessage(400, errorMessage, "", false);
    };

    const handleFormFieldChange = (changedFields: any, allFields: any) => {};

    const handleFormValueChange = (changedValues: any, values: any) => {};

    return (
        <>
            <CustomizeModal
                isOpen={isOpen}
                handleCloseModal={() => {
                    form.resetFields();
                    modalCreateProductStore.clearSkusCustomData();
                    modalCreateProductStore.clearVariantCombination();
                    modalCreateProductStore.clearWarehouseSelectedAndQuantity();
                    onClose();
                }}
                handleSaveModal={onSave}
                okText={okText}
                cancelText={cancelText}
                width={900}
                title="Tạo sản phẩm"
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
                        initialValues={{
                            price_import: 0,
                            price_sold: 0,
                            price_compare: 0,
                        }}
                    >
                        <GeneralInformation />
                        <SpecificationsInformation />
                        <PriceInformation />
                        <InventoryInformation />
                        <VariantInformation defaultForm={subForm} />
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="mt-4"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </CustomizeModal>
        </>
    );
};

export default observer(ModalCreateProduct);
