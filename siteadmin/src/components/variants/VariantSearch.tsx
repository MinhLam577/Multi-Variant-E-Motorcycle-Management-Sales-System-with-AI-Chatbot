import { observer } from "mobx-react-lite";
import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { SelectType } from "../products/detail/ModalCreateProduct/ModalCreateProduct";
import { Col, Form, FormInstance, Input, Row, Select } from "antd";
import { globalFiltersDataSkus } from "src/stores/skus.store";
const VariantSearch: React.FC<{
    setFilters: Dispatch<SetStateAction<globalFiltersDataSkus>>;
    productsSelect: SelectType[];
    warehouseSelect: SelectType[];
    brandSelect: SelectType[];
    searchForm: FormInstance;
}> = ({
    setFilters,
    productsSelect,
    warehouseSelect,
    brandSelect,
    searchForm,
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

    return (
        <Form labelWrap layout="vertical" form={searchForm}>
            <div className="w-full">
                <Row gutter={[16, 0]} align="middle" justify={"start"}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
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
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
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
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
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
                    <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">Nhà cung cấp</div>
                            }
                            name="brand_id"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={brandSelect || []}
                                placeholder="Chọn nhà cung cấp"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        brand_id: value,
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
export default observer(VariantSearch);
