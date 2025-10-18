import { action, makeAutoObservable, observable, reaction, toJS } from "mobx";
import {
    IFormListRowData,
    IFormSkuCustomData,
    ISkuCustomInputData,
    IVariantCombination,
    SelectType,
} from "./ModalCreateProduct.type";

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
