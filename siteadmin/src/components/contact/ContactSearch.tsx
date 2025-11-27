import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { debounce } from "lodash";
import { useCallback } from "react";
import { EnumContact } from "@/types/contact.type";
const { RangePicker } = DatePicker;

const ContactSearch = ({ setFilters }) => {
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
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
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
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Form.Item
                            label={
                                <div className="font-bold">Loại dịch vụ</div>
                            }
                            name="service"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={Object.keys(EnumContact).map(
                                    (item) => {
                                        return {
                                            label: EnumContact[item],
                                            value: EnumContact[item],
                                        };
                                    }
                                )}
                                placeholder="Chọn dịch vụ"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        service: value,
                                    }));
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
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
export default ContactSearch;
