import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  MinusCircleOutlined,
  QuestionCircleFilled,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
  Flex,
  Tag,
  Tooltip,
  Space,
  Radio,
  Table,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCar, getAll, updateCar } from "../../api/cars";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import RichTextEditor from "../../containers/RichTextEditor";
import UploadSinglePictureGetUrl, {
  UploadSinglePictureGetUrlRemoteMode,
} from "../../containers/UploadSinglePictureGetUrl";
import TagsGroup from "../../businessComponents/tags/tagsGroup";

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

const EMotorbikeDetail = ({ mode }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [settingData, setData] = useState({
    categories: [],
    colors: [],
    branches: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAll();
        setData(result);
      } catch (err) {
        message.error("Đã có lỗi xảy ra, vui lòng thử lại!", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCardTitle = () => {
    if (mode === ProductsDetailMode.View) {
      return "Chi tiết sản phẩm";
    } else if (mode === ProductsDetailMode.Add) {
      return "Tạo sản phẩm - Xe máy điện";
    } else if (mode === ProductsDetailMode.Edit) {
      return "Chỉnh sửa sản phẩm";
    }
  };

  const getButtonOkText = () => {
    if (mode === ProductsDetailMode.Add) {
      return (
        <>
          <PlusOutlined />
          &nbsp;Tạo
        </>
      );
    } else if (mode === ProductsDetailMode.Edit) {
      return (
        <>
          <SaveOutlined />
          &nbsp;Lưu
        </>
      );
    }
  };

  const getButtonCancelText = () => {
    if (mode === ProductsDetailMode.Add) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === ProductsDetailMode.Edit) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === ProductsDetailMode.View) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Đóng
        </>
      );
    }
  };

  const getButtonEditText = () => {
    if (mode === ProductsDetailMode.View) {
      return (
        <>
          <EditOutlined />
          &nbsp;Sửa
        </>
      );
    }
  };

  const isReadOnly = () => {
    if (mode === ProductsDetailMode.Add) {
      return false;
    } else if (mode === ProductsDetailMode.Edit) {
      return false;
    }
    return true;
  };

  const handleOk = () => {
    if (mode === ProductsDetailMode.Add) {
      form.submit();
    } else if (mode === ProductsDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === ProductsDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/e-motorbike`);
      });
    } else {
      navigate("/e-motorbike");
    }
  };

  const handleEdit = () => {
    if (mode === ProductsDetailMode.View) {
      navigate(`/e-motorbike/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = async (values) => {
    const dto = {
      ...values,
    };

    const formData = {
      ...values,
      category_id: dto?.category_id,
      brand_id: dto?.brand_id.toString(),
      stock: parseInt(dto?.stock ?? 0),
      images: fileList?.map((i) => ({
        url: i?.url,
        color: "",
        count: "",
      })),
      modelYear: 0,
      fuelType: "",
      transmission: "",
      videos: [],

      videosCount: 0,
      rating: 0,
      reviewsCount: 0,
      mileage: 0,
      totalWindown: 0,
      totalXilanh: 0,
      status: true,
    };

    if (mode === ProductsDetailMode.Add) {
      delete formData.engineNumber;
      await createCar(formData)
        .then((res) => {
          console.log("res", res);
        })
        .catch((error) => {
          console.log("error", error);
        });
      return;
    }

    if (mode === ProductsDetailMode.Edit) {
      await updateCar({ ...formData, id });
    }
  };

  return (
    <Form
      form={form}
      {...formItemLayout}
      layout={"vertical"}
      autoComplete="off"
      onFinish={handleFormFinish}
    >
      <Row gutter={16}>
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
                        options={settingData?.branches?.map((item) => {
                          return {
                            value: item?.id,
                            label: item?.name,
                          };
                        })}
                        placeholder="Chọn thương hiệu"
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
                        options={settingData?.categories?.map((item) => {
                          return {
                            value: item?.id,
                            label: item?.name,
                          };
                        })}
                        placeholder="Chọn danh mục"
                      />
                    </Form.Item>
                  </Col>

                  {/* numberVin */}
                  <Col span={12}>
                    <Form.Item
                      label="Số khung"
                      name="numberVin"
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
                {/* description  */}
                <Form.Item
                  className="custom-antd-richtext-editor"
                  label="Trích dẫn"
                  name="description"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input readOnly={isReadOnly()} placeholder="Nhập trích dẫn" />
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
                      name="price"
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
                              `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            className="w-full"
                          />
                        </Form.Item>
                      </Col>
                      <Row span={12} gutter={[16, 16]}>
                        <Col span={12}>
                          <Form.Item label="Biên lợi nhuận" name="profitMargin">
                            <InputNumber
                              variant="borderless"
                              min={0}
                              defaultValue={"-"}
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
                              defaultValue={"-"}
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

                        <Button type="primary" onClick={() => {}}>
                          Chọn kho lưu trữ
                        </Button>
                      </Col>
                      <Col span={24}>
                        <Form.Item name="Tìm kho">
                          <Input
                            addonBefore={<SearchOutlined />}
                            placeholder="Tìm kho"
                          />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Table
                          columns={[
                            {
                              title: "Kho hàng",
                              dataIndex: "warehouse",
                              key: "warehouse",
                            },
                            {
                              title: "Tồn đầu kỳ",
                              dataIndex: "initialStock",
                              key: "initialStock",
                            },
                          ]}
                          dataSource={[]}
                        />
                      </Col>
                    </Row>
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
                  name="brand_id"
                  rules={[{ required: true, message: "Chọn nhóm!" }]}
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
                <Form.Item
                  name="promo_id"
                  rules={[{ required: true, message: "Chọn khuyến mãi!" }]}
                >
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
      </Row>

      <>
        <Button onClick={handleCancel}>{getButtonCancelText()}</Button>
        {isReadOnly() ? (
          <>
            <Divider type="vertical" />
            <Button onClick={handleEdit}>{getButtonEditText()}</Button>
          </>
        ) : (
          <>
            <Divider type="vertical" />
            <Button onClick={handleOk}>{getButtonOkText()}</Button>
          </>
        )}
      </>
    </Form>
  );
};

EMotorbikeDetail.propTypes = {
  mode: PropTypes.number,
};

export default EMotorbikeDetail;
