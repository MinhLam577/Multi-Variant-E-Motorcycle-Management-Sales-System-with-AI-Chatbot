import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import PropTypes from "prop-types";
import TableComponent from "../../../containers/TableComponent";
import { render } from "@testing-library/react";
import { formatVNDMoney } from "../../../utils";

const UnitTable = ({ form }) => {
  const dataFake = [{ isCheckbox: true, nameUnit: "Xanh", priceUnit: 121212 }];
  const getColumnsConfig = () => {
    return [
      //checkbox
      {
        title: "aa",
        dataIndex: "isCheckbox",
        key: "isCheckbox",
        render: (value, item) => {
          return <Checkbox checked={value} />;
        },
      },
      //nameUnit
      {
        title: "nameUnit",
        key: "nameUnit",
        dataIndex: "nameUnit",
        render: (value, item) => {
          return <div>{value}</div>;
        },
      },
      //price
      {
        title: "priceUnit",
        key: "priceUnit",
        dataIndex: "priceUnit",
        render: (value, item) => {
          return <div>{formatVNDMoney(value)}</div>;
        },
      },
    ];
  };
  return (
    <Form.List name="specifications">
      {(fields, { add, remove }) => {
        console.log("fieldsfieldsfields", fields);
        return (
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
                      <Select.Option value="màu sắc">Màu sắc</Select.Option>
                      <Select.Option value="tiêu đề">Tiêu đề</Select.Option>
                      <Select.Option value="vật liệu">Vật liệu</Select.Option>
                      <Select.Option value="kiểu dáng">Kiểu dáng</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={10}>
                  {/* value child list */}
                  <Form.Item
                    label="Giá trị"
                    {...restField}
                    name={[name, "value"]}
                  >
                    <Form.List name={[key, "value"]}>
                      {(subFields, subOpt) => (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            rowGap: 16,
                          }}
                        >
                          <Form.Item name={[name, "value"]}>
                            <Input placeholder="Thêm giá trị mới" />
                          </Form.Item>

                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item noStyle name={[subField.name, "name"]}>
                                <Input placeholder="Thêm giá trị mới" />
                              </Form.Item>

                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                }}
                              />
                            </Space>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => {
                              subOpt.add();
                            }}
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
                      form
                        .validateFields()
                        .then((values) => {
                          console.log("All data", values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                    }}
                  >
                    Xong
                  </Button>
                </Col>

                <Col span={4} className="flex">
                  <MinusCircleOutlined onClick={() => remove(name)} />
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
            <Form.Item>
              <TableComponent
                data={dataFake}
                loadData={() => {}}
                showHeader={false}
                pagination={false}
                getColumnsConfig={getColumnsConfig}
              />
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
};

UnitTable.propTypes = {
  form: PropTypes.object,
};

export default UnitTable;
