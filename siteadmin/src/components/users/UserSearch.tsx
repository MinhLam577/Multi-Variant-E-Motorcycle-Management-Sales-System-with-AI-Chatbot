import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { RoleEnum, RoleEnumValue } from "../../constants";
import { debounce } from "lodash";
import { useCallback } from "react";
const { RangePicker } = DatePicker;

const UserSearch = ({ setFilters }) => {
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
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
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
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <Form.Item
                            label={
                                <div className="font-bold">Loại người dùng</div>
                            }
                            name="role"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={Object.keys(RoleEnumValue)
                                    .map((item) => {
                                        return {
                                            label: RoleEnumValue[item],
                                            value: RoleEnum[item],
                                        };
                                    })
                                    .filter(
                                        (item) => item.value !== RoleEnum.USER
                                    )}
                                placeholder="Chọn loại người dùng"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        role: value,
                                    }));
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
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
                    <Col xs={24} sm={12} md={8} lg={6} xl={6}>
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
export default UserSearch;
