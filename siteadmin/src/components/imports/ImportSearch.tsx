import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { Col, Form, Input, Row, Select, DatePicker } from "antd";
import { useStore } from "src/stores";
import { getSelectOption } from "src/pages/products";
import { globalFiltersImportDataType } from "src/stores/imports.store";
import { observer } from "mobx-react-lite";
import { SelectType } from "../products/detail/ModalCreateProduct/ModalCreateProduct";
const { RangePicker } = DatePicker;
const ImportSearch: React.FC<{
    setFilters: Dispatch<SetStateAction<globalFiltersImportDataType>>;
    productsSelect: SelectType[];
    warehouseSelect: SelectType[];
    skusSelect: SelectType[];
    globalFiltersImportDataType: globalFiltersImportDataType;
}> = ({
    setFilters,
    productsSelect,
    warehouseSelect,
    skusSelect,
    globalFiltersImportDataType,
}) => {
    const debounceInputChange: (value: string) => void = useCallback(
        debounce((value: string) => {
            setFilters((prev) => ({
                ...prev,
                search: value,
            }));
        }, 400),
        []
    );
    const [form] = Form.useForm<globalFiltersImportDataType>();
    useEffect(() => {
        form.setFieldsValue({
            ...globalFiltersImportDataType,
        });
    }, [globalFiltersImportDataType, form]);
    return (
        <Form
            labelWrap
            labelCol={{ flex: "30%" }}
            layout="vertical"
            form={form}
        >
            <div className="w-full">
                <Row gutter={16} align="middle" justify={"space-between"}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                        <Form.Item
                            label={<div className="font-bold">Search</div>}
                            name="search"
                        >
                            <Input
                                placeholder="Nhập dữ liệu tìm kiếm"
                                onChange={(e) => {
                                    debounceInputChange(e.target.value);
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                        <Form.Item
                            label={<div className="font-bold">Kho hàng</div>}
                            name="warehouse_id"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={warehouseSelect || []}
                                placeholder="Chọn kho hàng"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        warehouse_id: value,
                                    }));
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">
                                    Khoảng thời gian
                                </div>
                            }
                            name="date"
                            className="w-full"
                        >
                            <RangePicker
                                format={"DD/MM/YYYY"}
                                placeholder={["Start Day", "End Day"]}
                                className="w-full"
                                onChange={(date) => {
                                    const formattedDate = date?.map((item) => {
                                        if (item) {
                                            return item.format("DD/MM/YYYY");
                                        }
                                        return undefined;
                                    });
                                    setFilters((prev) => ({
                                        ...prev,
                                        start_date: formattedDate?.[0],
                                        end_date: formattedDate?.[1],
                                    }));
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            label={<div className="font-bold">Sản phẩm</div>}
                            name="product_id"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={productsSelect}
                                placeholder="Chọn sản phẩm"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        product_id: value,
                                    }));
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                        <Form.Item
                            label={<div className="font-bold">Biến thể</div>}
                            name="skus_id"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={skusSelect || []}
                                placeholder="Chọn biến thể"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        skus_id: value,
                                    }));
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>
        </Form>
    );
};
export default observer(ImportSearch);
