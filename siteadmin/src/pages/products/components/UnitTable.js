import {
    CloseOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Select, Space } from "antd";
import PropTypes from "prop-types";

const UnitTable = ({ form }) => {
    return (
        <Form.List name="properties">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Row
                            key={key}
                            gutter={[16, 16]}
                            align="middle"
                            className="items-start pb-4"
                        >
                            <Col span={10}>
                                <Form.Item
                                    label="Thuộc tính"
                                    {...restField}
                                    name={[name, "unit"]}
                                    rules={[
                                        {
                                            required: false,
                                        },
                                    ]}
                                >
                                    <Select placeholder="Chọn thuộc tính">
                                        <Select.Option value="kích thước">
                                            Kích thước
                                        </Select.Option>
                                        <Select.Option value="màu sắc">
                                            Màu sắc
                                        </Select.Option>
                                        <Select.Option value="tiêu đề">
                                            Tiêu đề
                                        </Select.Option>
                                        <Select.Option value="vật liệu">
                                            Vật liệu
                                        </Select.Option>
                                        <Select.Option value="kiểu dáng">
                                            Kiểu dáng
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={10}>
                                {/* value child list */}
                                <Form.Item
                                    label="Giá trị"
                                    // {...restField}
                                    // name={[name, "value"]}
                                >
                                    <Form.List name={[key, "list"]}>
                                        {(subFields, subOpt) => (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    rowGap: 16,
                                                }}
                                            >
                                                <Input placeholder="Thêm giá trị mới" />

                                                {subFields.map((subField) => (
                                                    <Space key={subField.key}>
                                                        <Form.Item
                                                            noStyle
                                                            name={[
                                                                subField.name,
                                                                "first",
                                                            ]}
                                                        >
                                                            <Input placeholder="Thêm giá trị mới" />
                                                        </Form.Item>

                                                        <CloseOutlined
                                                            onClick={() => {
                                                                subOpt.remove(
                                                                    subField.name
                                                                );
                                                            }}
                                                        />
                                                    </Space>
                                                ))}
                                                <Button
                                                    type="dashed"
                                                    onClick={() => subOpt.add()}
                                                    block
                                                >
                                                    + Thêm giá trị mới
                                                </Button>
                                            </div>
                                        )}
                                    </Form.List>
                                </Form.Item>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        // Assuming form is the instance of the form
                                        form.validateFields()
                                            .then((values) => {})
                                            .catch((info) => {});
                                    }}
                                >
                                    Xong
                                </Button>
                            </Col>

                            <Col span={4} className="flex">
                                <MinusCircleOutlined
                                    onClick={() => remove(name)}
                                />
                            </Col>
                            {fields.length > 1 && (
                                <Divider type="horizontal" className="m-0" />
                            )}
                        </Row>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                        >
                            Thêm thuộc tính khác
                        </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    );
};

UnitTable.propTypes = {
    form: PropTypes.object,
};

export default UnitTable;
