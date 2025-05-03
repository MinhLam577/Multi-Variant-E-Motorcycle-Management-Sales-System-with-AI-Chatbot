import { Col, DatePicker, Form, Input, Row, Select, TreeSelect } from "antd";
import PropTypes from "prop-types";
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
                    <Col xl={5} lg={12} md={12} xs={12}>
                        <Form.Item
                            label={<span className="font-bold">Danh mục</span>}
                            name="blogId"
                        >
                            <TreeSelect
                                allowClear
                                showSearch
                                placeholder="Chọn danh mục"
                                treeDefaultExpandAll
                                dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: "auto",
                                }}
                                treeData={[
                                    {
                                        title: "Danh mục 1",
                                        value: "category1",
                                        key: "category1",
                                        children: [
                                            {
                                                title: "Danh mục 1.1",
                                                value: "category1.1",
                                                key: "category1.1",
                                            },
                                            {
                                                title: "Danh mục 1.2",
                                                value: "category1.2",
                                                key: "category1.2",
                                            },
                                        ],
                                    },
                                ]}
                                treeNodeFilterProp="title"
                                onChange={(value, label, extra) => {}}
                                size="middle"
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

NewsSearch.propTypes = {
    setFilters: PropTypes.func,
};

export default NewsSearch;
