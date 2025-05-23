import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { debounce } from "lodash";
import { useCallback } from "react";
import {
    getSpendingEnumRangeLabel,
    SpendingEnumRange,
} from "src/pages/customers";
import { GenderEnum } from "src/stores/user.store";
const { RangePicker } = DatePicker;

const CustomerSearch = ({ setFilters }) => {
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
        <Form labelWrap labelCol={{ flex: "30%" }} layout="vertical">
            <div className="w-full">
                <Row gutter={16} align="middle" justify={"space-between"}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={5}>
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
                    <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                        <Form.Item
                            label={<div className="font-bold">Giới tính</div>}
                            name="gender"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={Object.keys(GenderEnum).map((key) => ({
                                    label: GenderEnum[key],
                                    value: GenderEnum[key],
                                }))}
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        gender: value,
                                    }));
                                }}
                                placeholder="Chọn giới tính"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={5}>
                        <Form.Item
                            label={
                                <div className="font-bold">Khoảng chi tiêu</div>
                            }
                            name="spending_range"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={Object.keys(SpendingEnumRange).map(
                                    (key) => ({
                                        label: getSpendingEnumRangeLabel(
                                            SpendingEnumRange[key]
                                        ),
                                        value: SpendingEnumRange[key],
                                    })
                                )}
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        spending_range: value,
                                    }));
                                }}
                                placeholder="Chọn khoảng chi tiêu"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={5}>
                        <Form.Item
                            label={
                                <div className="font-bold">
                                    Trạng thái hoạt động
                                </div>
                            }
                            name="isActive"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={[
                                    {
                                        label: "Hoạt động",
                                        value: true,
                                    },
                                    {
                                        label: "Ngừng hoạt động",
                                        value: false,
                                    },
                                ]}
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: value,
                                    }));
                                }}
                                placeholder="Chọn trạng thái"
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={12} lg={12} xl={5}>
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
export default CustomerSearch;
