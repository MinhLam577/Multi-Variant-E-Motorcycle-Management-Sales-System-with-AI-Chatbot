import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import { RoleEnumValue } from "../../constants";
import { debounce } from "lodash";
import { useCallback } from "react";
const { RangePicker } = DatePicker;

export enum VoucherEnum {
    true = "Giảm giá theo phần trăm",
    false = "Giảm giá theo số tiền",
}

const VoucherSearch = ({ setFilters }) => {
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
                                <div className="font-bold">Loại voucher</div>
                            }
                            name="fixed"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={Object.keys(VoucherEnum).map(
                                    (item) => {
                                        return {
                                            label: VoucherEnum[item],
                                            value: item,
                                        };
                                    }
                                )}
                                placeholder="Chọn loại voucher"
                                onChange={(value) => {
                                    setFilters((prev) => ({
                                        ...prev,
                                        fixed: value,
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
                            name="status"
                        >
                            <Select
                                allowClear
                                showSearch
                                optionFilterProp="label"
                                options={[
                                    {
                                        label: "Hoạt động",
                                        value: "active",
                                    },
                                    {
                                        label: "Ngừng hoạt động",
                                        value: "inactive",
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
                                onChange={(date) => {
                                    const formattedDate = date?.map((item) => {
                                        if (item) {
                                            return item.format("YYYY-MM-DD");
                                        } else {
                                            return undefined;
                                        }
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
                </Row>
            </div>
        </Form>
    );
};
export default VoucherSearch;
