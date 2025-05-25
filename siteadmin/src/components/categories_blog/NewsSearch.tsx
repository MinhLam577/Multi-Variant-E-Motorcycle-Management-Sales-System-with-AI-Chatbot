import { Col, DatePicker, Form, Input, Row } from "antd";
import { useCallback } from "react";
import { debounce } from "lodash";
const { RangePicker } = DatePicker;
const NewsSearch = ({ setFilters }) => {
    const debounceInputChange: (value: string) => void = useCallback(
        debounce((value: string) => {
            setFilters((prev) => ({
                ...prev,
                search: value,
            }));
        }, 300),
        []
    );

    return (
        <Form
            labelWrap
            labelCol={{ flex: "30%" }}
            layout="vertical"
            autoComplete="off"
        >
            <div className="w-full">
                <Row gutter={16} align="middle" justify={"space-between"}>
                    <Col xs={24} sm={12} md={12} lg={12} xl={18}>
                        <Form.Item
                            label={<div className="font-bold">Search</div>}
                            name="search"
                            className="w-full"
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
                            label={
                                <div className="font-bold">
                                    Khoảng thời gian đăng bài
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
                                    const formattedDate =
                                        date && Array.isArray(date)
                                            ? date.map((d) =>
                                                  d.format("YYYY-MM-DD")
                                              )
                                            : [undefined, undefined];
                                    setFilters((prev) => ({
                                        ...prev,
                                        created_from: formattedDate?.[0],
                                        created_to: formattedDate?.[1],
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

export default NewsSearch;
