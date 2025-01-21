import { InfoCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Space,
  Table,
} from "antd";
import PropTypes from "prop-types";
import RichTextEditor from "../../../containers/RichTextEditor";
import UploadSinglePictureGetUrl, {
  UploadSinglePictureGetUrlRemoteMode,
} from "../../../containers/UploadSinglePictureGetUrl";
import UnitTable from "../components/UnitTable";
import { WarehousePopup } from "../components/WarehousePopup";
import WarehouseTable from "../components/WarehouseTable";
import { useStore } from "../../../stores";

export const ProductsDetailMode = {
  View: 1,
  Add: 2,
  Edit: 3,
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
  },
};

const EMotorbikeDetailScreen = ({
  mode,
  form,
  handleFormFinish,
  handleCancel,
  handleEdit,
  settingData,
  isReadOnly,
  fileList,
  setFileList,
  setIsOpenWarehousePopup,
  getButtonCancelText,
  getButtonEditText,
  getButtonOkText,
  isOpenWarehousePopup,
  handleOk,
  listBrand,
  listCategory,
  listColor,
}) => {
  console.log("listBrand", listBrand);
  return (
    <>
      <Form
        form={form}
        {...formItemLayout}
        layout={"vertical"}
        autoComplete="off"
        onFinish={handleFormFinish}
        initialValues={{
          borderless: "-",
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Thông tin sản phẩm">
                  <Form.Item name="productId" hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Hình ảnh sản phẩm"
                    name="listImgUrl"
                    rules={[
                      { required: true, message: "Hãy chọn ít nhất 1 ảnh!" },
                    ]}
                  >
                    <div className="flex justify-center">
                      <UploadSinglePictureGetUrl
                        remoteMode={UploadSinglePictureGetUrlRemoteMode.Private}
                        disabled={isReadOnly()}
                        maxCount={8}
                        fileList={fileList}
                        setFileList={setFileList}
                      />
                    </div>
                  </Form.Item>

                  {/* product name */}
                  <Form.Item
                    label="Tên sản phẩm"
                    name="title"
                    rules={[
                      { required: true, message: "Hãy nhập tên sản phẩm!" },
                    ]}
                  >
                    <Input
                      readOnly={isReadOnly()}
                      placeholder="Nhập tên sản phẩm"
                    />
                  </Form.Item>

                  {/* category and brand */}
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Nhà cung cấp"
                        name="brand_id"
                        rules={[
                          { required: true, message: "Chọn nhà cung cấp!" },
                        ]}
                      >
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="label"
                          options={listBrand?.map((item) => {
                            return {
                              value: item?.id,
                              label: item?.name,
                            };
                          })}
                          placeholder="Chọn nhà cung cấp"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Loại"
                        name="category_id"
                        rules={[{ required: true, message: "Chọn loại!" }]}
                      >
                        <Select
                          allowClear
                          showSearch
                          optionFilterProp="label"
                          options={listCategory?.map((item) => {
                            return {
                              value: item?.id,
                              label: item?.name,
                            };
                          })}
                          placeholder="Chọn danh mục"
                        />
                      </Form.Item>
                    </Col>

                    {/* chassisNumber */}
                    <Col span={12}>
                      <Form.Item
                        label="Số khung"
                        name="chassisNumber"
                        rules={[{ required: false, message: "Nhập số khung!" }]}
                      >
                        <Input
                          maxLength={255}
                          readOnly={isReadOnly()}
                          placeholder="Nhập số khung"
                        />
                      </Form.Item>
                    </Col>
                    {/* EngineNumber */}
                    <Col span={12}>
                      <Form.Item
                        label="Số máy"
                        name="engineNumber"
                        rules={[{ required: false, message: "Chọn model!" }]}
                      >
                        <Input
                          maxLength={255}
                          readOnly={isReadOnly()}
                          placeholder="Nhập số máy"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* description  */}
                  <Form.Item
                    className="custom-antd-richtext-editor"
                    label="Mô tả sản phẩm"
                    name="description"
                    rules={[
                      {
                        required: false,
                        message: "Hãy nhập nội dung mô tả sản phẩm!",
                      },
                    ]}
                  >
                    <RichTextEditor
                      className="h-[400px] mb-10"
                      readOnly={isReadOnly()}
                    />
                  </Form.Item>
                </Card>
              </Col>
              {/* Price */}
              <Col span={24}>
                <Card title="Giá sản phẩm">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item
                        label="Giá bán"
                        name="price"
                        tooltip={{
                          title: "Số tiền khách hàng cần thanh toán",
                          icon: <InfoCircleOutlined />,
                        }}
                      >
                        <InputNumber
                          min={0}
                          placeholder="Nhập đơn giá"
                          formatter={(value) =>
                            `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          className="w-full"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Giá so sánh"
                        name="depositPrice"
                        tooltip={{
                          title:
                            "Số tiền chưa giảm giá, thể hiện giá trị giảm giá, ưu đãi cho khách hàng",
                          icon: <InfoCircleOutlined />,
                        }}
                      >
                        <InputNumber
                          min={0}
                          placeholder="Nhập đơn giá"
                          formatter={(value) =>
                            `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          className="w-full"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
              {/* Warehouse */}
              <Col span={24}>
                <Card title="Quản lý tồn kho">
                  <Row gutter={[16, 0]}>
                    <Col span={24}>
                      <Form.Item label="Tồn kho" name="stock">
                        <Radio.Group>
                          <Radio value={1}>Có quản lý tồn kho</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Form.Item
                            label="Giá vốn"
                            name="costPrice"
                            tooltip={{
                              title: "Số tiền nhập sản phẩm",
                              icon: <InfoCircleOutlined />,
                            }}
                          >
                            <InputNumber
                              min={0}
                              placeholder="Nhập đơn giá"
                              formatter={(value) =>
                                `${value} đ`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ","
                                )
                              }
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                        <Row span={12} gutter={[16, 16]}>
                          <Col span={12}>
                            <Form.Item
                              label="Biên lợi nhuận"
                              name="profitMargin"
                            >
                              <InputNumber
                                variant="borderless"
                                min={0}
                                readOnly={true}
                                placeholder="Nhập biên lợi nhuận"
                                formatter={(value) =>
                                  `${value}%`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                className="w-full "
                              />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item label="Lợi nhuận" name="profitMargin">
                              <InputNumber
                                variant="borderless"
                                min={0}
                                readOnly={true}
                                placeholder="Nhập biên lợi nhuận"
                                formatter={(value) =>
                                  `${value}%`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ","
                                  )
                                }
                                className="w-full"
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row span={24} gutter={[16, 16]}>
                        <Col span={12}>
                          <Form.Item
                            label="SKU"
                            name="sku"
                            tooltip={{
                              title:
                                "SKU - Mã sản phẩm cho mỗi sản phẩm nên là duy nhất bao gồm cả chữ và số",
                              icon: <InfoCircleOutlined />,
                            }}
                          >
                            <InputNumber
                              min={0}
                              placeholder="SKY"
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="Barcode"
                            name="barcode_id"
                            tooltip={{
                              title:
                                "Barcode - Mã vạch thường được nhà sản xuất tạo ra",
                              icon: <InfoCircleOutlined />,
                            }}
                          >
                            <InputNumber
                              min={0}
                              placeholder="Barcode"
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={24}>
                      <Row span={24} gutter={[16, 16]}>
                        <Col span={24} className="flex justify-between">
                          <span className="font-bold text-base">
                            Tồn kho khả dụng
                          </span>

                          <Button
                            type="primary"
                            onClick={() => setIsOpenWarehousePopup(true)}
                          >
                            Chọn kho lưu trữ
                          </Button>
                        </Col>
                        <Col span={24}>
                          <Form.Item name="Tìm kho" className="m-0">
                            <Input
                              addonBefore={<SearchOutlined />}
                              placeholder="Tìm kho"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <WarehouseTable
                            onChangeInitialStock={(val) => {
                              console.log("onChangeInitialStock", val);
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </Col>
              {/* Unit */}
              <Col span={24}>
                <Card title="Biến thể">
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Radio.Group value={1}>
                        <Radio value={1}>
                          Sản phẩm có nhiều biến thể. Ví dụ như khác nhau về
                          kích thước, màu sắc
                        </Radio>
                      </Radio.Group>
                    </Col>
                    <Col span={24}>
                      <UnitTable form={form} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Card title="Nhóm sản phẩm">
                  <Form.Item
                    name="product_combo"
                    rules={[{ required: false, message: "Chọn nhóm!" }]}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      options={settingData?.branches?.map((item) => {
                        return {
                          value: item?.id,
                          label: item?.name,
                        };
                      })}
                      placeholder="Chọn nhóm"
                    />
                  </Form.Item>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Khuyến mãi">
                  <Form.Item name="promo_id">
                    <Space direction="vertical" size={16} className="w-full">
                      <Radio.Group>
                        <Radio value={1}>Không áp dụng khuyến mãi</Radio>
                      </Radio.Group>
                      <Select
                        mode="multiple"
                        allowClear
                        showSearch
                        optionFilterProp="label"
                        options={settingData?.branches?.map((item) => {
                          return {
                            value: item?.id,
                            label: item?.name,
                          };
                        })}
                        placeholder="Chọn khuyến mãi"
                      />
                    </Space>
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Button onClick={handleCancel}>{getButtonCancelText()}</Button>
            {isReadOnly() ? (
              <>
                <Divider type="vertical" />
                <Button onClick={handleEdit}>{getButtonEditText()}</Button>
              </>
            ) : (
              <>
                <Divider type="vertical" />
                <Button type="primary" onClick={handleOk}>
                  {getButtonOkText()}
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Form>
      <WarehousePopup
        isOpen={isOpenWarehousePopup}
        onOk={() => setIsOpenWarehousePopup(false)}
        onCancel={() => setIsOpenWarehousePopup(false)}
      />
    </>
  );
};

EMotorbikeDetailScreen.propTypes = {
  mode: PropTypes.number,
  form: PropTypes.object,
  handleFormFinish: PropTypes.func,
  handleCancel: PropTypes.func,
  handleEdit: PropTypes.func,
  settingData: PropTypes.object,
  isReadOnly: PropTypes.func,
  fileList: PropTypes.array,
  setFileList: PropTypes.func,
  setIsOpenWarehousePopup: PropTypes.func,
  getButtonCancelText: PropTypes.func,
  getButtonEditText: PropTypes.func,
  getButtonOkText: PropTypes.func,
  isOpenWarehousePopup: PropTypes.bool,
  handleOk: PropTypes.func,
  listColor: PropTypes.array,
  listCategory: PropTypes.array,
  listBrand: PropTypes.array,
};

export default EMotorbikeDetailScreen;
