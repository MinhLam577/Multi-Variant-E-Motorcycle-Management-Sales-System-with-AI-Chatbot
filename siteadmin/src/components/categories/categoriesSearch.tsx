import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { debounce } from "lodash";
import { useCallback } from "react";
import { EnumProductStore, EnumProductType } from "src/stores/product.store";
import { SelectType } from "../products/detail/ModalCreateProduct/ModalCreateProduct";
import {
    CategoryResponseLabel,
    CategoryResponseTypeEnum,
} from "src/stores/categories.store";
const { RangePicker } = DatePicker;

const CategoriesSearch = ({ setFilters }) => {
    const debounceInputChange: (value: string) => void = useCallback(
        debounce((value: string) => {
            setFilters((prev) => ({
                ...prev,
                search: value,
            }));
        }, 400),
        []
    );
    const productTypeOption: SelectType[] = Object.keys(EnumProductType).map(
        (key) => ({
            label: EnumProductType[key as keyof typeof EnumProductType],
            value: EnumProductStore[key as keyof typeof EnumProductStore],
        })
    );
    return (
        <Form labelWrap labelCol={{ flex: "30%" }} layout="vertical">
            <div className="w-full">
                <Row gutter={16} align="middle" justify={"space-between"}>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
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
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <Form.Item
                            label={<span className="font-bold">Loại xe</span>}
                            name="type"
                        >
                            <Select
                                placeholder="Chọn loại xe"
                                showSearch
                                options={productTypeOption}
                                optionFilterProp="label"
                                allowClear
                                size="middle"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        type: value,
                                    }));
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">Kiểu hiển thị</div>
                            }
                            name="responseType"
                            initialValue={CategoryResponseTypeEnum.FLAT}
                        >
                            <Select
                                showSearch
                                optionFilterProp="label"
                                options={Object.keys(
                                    CategoryResponseTypeEnum
                                ).map((key) => ({
                                    label: CategoryResponseLabel[key],
                                    value: CategoryResponseTypeEnum[key],
                                }))}
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        responseType: value,
                                    }));
                                }}
                                placeholder="Chọn kiểu hiển thị"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">
                                    Khoảng thời gian
                                </div>
                            }
                            name="date"
                        >
                            <RangePicker
                                format={"DD/MM/YYYY"}
                                placeholder={["Start Day", "End Day"]}
                                className="!w-full"
                                onChange={(_, dateString) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        created_from: dateString[0],
                                        created_to: dateString[1],
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
export default CategoriesSearch;
