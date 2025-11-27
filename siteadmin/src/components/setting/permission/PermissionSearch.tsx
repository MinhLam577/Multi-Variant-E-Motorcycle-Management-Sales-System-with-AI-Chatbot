import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { debounce } from "lodash";
import { useCallback } from "react";
import { ALL_MODULES } from "@/constants/permissions";

const PermissionSearch = ({ setFilters }) => {
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
                            label={<div className="font-bold">Loại module</div>}
                            name="role"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={Object.keys(ALL_MODULES).map(
                                    (item) => {
                                        return {
                                            label: ALL_MODULES[item],
                                            value: ALL_MODULES[item],
                                        };
                                    }
                                )}
                                placeholder="Chọn loại module"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        module: value,
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
export default PermissionSearch;
