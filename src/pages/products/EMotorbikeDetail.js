import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
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
    <>
      <Card loading={loading} title={getCardTitle()}>
        <Form
          form={form}
          {...formItemLayout}
          layout={"vertical"}
          autoComplete="off"
          onFinish={handleFormFinish}
        >
          <Form.Item name="productId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Hình ảnh sản phẩm"
            name="listImgUrl"
            rules={[{ required: true, message: "Hãy chọn ít nhất 1 ảnh!" }]}
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
            rules={[{ required: true, message: "Hãy nhập tên sản phẩm!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          {/* category and brand */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Danh mục xe"
                name="category_id"
                rules={[{ required: true, message: "Chọn danh mục!" }]}
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
            <Col span={6}>
              <Form.Item
                label="Thương hiệu"
                name="brand_id"
                rules={[{ required: true, message: "Chọn thương hiệu!" }]}
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

            {/* numberVin */}
            <Col span={6}>
              <Form.Item
                label="Số khung"
                name="numberVin"
                rules={[{ required: true, message: "Nhập số khung!" }]}
              >
                <Input
                  maxLength={255}
                  readOnly={isReadOnly()}
                  placeholder="Nhập số khung"
                />
              </Form.Item>
            </Col>
            {/* EngineNumber */}
            <Col span={6}>
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
              { required: true, message: "Hãy nhập nội dung mô tả sản phẩm!" },
            ]}
          >
            <RichTextEditor
              className="h-[400px] mb-10"
              readOnly={isReadOnly()}
            />
          </Form.Item>

          {/* price */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="Giá nhập"
                name="price"
                rules={[
                  { required: true, message: "Nội dung không được để trống!" },
                ]}
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
            <Col span={6}>
              <Form.Item
                label="Giá đặt cọc"
                name="depositPrice"
                rules={[
                  { required: false, message: "Nội dung không được để trống!" },
                ]}
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
            <Col span={6}>
              <Form.Item
                label="Đăng ký theo gói"
                name="planId"
                rules={[
                  { required: false, message: "Nội dung không được để trống!" },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={[
                    {
                      planId: 1,
                      name: "Gói mua kèm pin",
                      pricePerMonth: 300000,
                      features: [
                        "Pin thuê bao",
                        "Bảo trì nâng cao",
                        "Hỗ trợ 24/7",
                      ],
                    },
                    {
                      planId: 2,
                      name: "Gói thuê pin",
                      pricePerMonth: 50000,
                      features: ["Pin thuê bao", "Bảo trì cơ bản"],
                    },
                  ]?.map((item) => {
                    return {
                      value: item?.planId,
                      label: item?.name,
                    };
                  })}
                  placeholder="Chọn kho"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* warehouse */}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Kho"
                name="warehouse_id"
                rules={[{ required: false, message: "Chọn kho!" }]}
              >
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={[
                    {
                      id: 1,
                      name: "Kho Bình Dương",
                      stockByColor: [
                        { colorId: 1, color: "Đỏ tươi", stockAvailable: 5 },
                        {
                          colorId: 2,
                          color: "Trắng ngọc trai",
                          stockAvailable: 10,
                        },
                        {
                          colorId: 4,
                          color: "Xanh tím than",
                          stockAvailable: 8,
                        },
                      ],
                    },
                    {
                      id: 2,
                      name: "Kho Hà Nội",
                      stockByColor: [
                        { colorId: 1, color: "Đỏ tươi", stockAvailable: 5 },
                        {
                          colorId: 2,
                          color: "Trắng ngọc trai",
                          stockAvailable: 10,
                        },
                        {
                          colorId: 4,
                          color: "Xanh tím than",
                          stockAvailable: 8,
                        },
                      ],
                    },
                  ]?.map((item) => {
                    return {
                      value: item?.id,
                      label: item?.name,
                    };
                  })}
                  placeholder="Chọn kho"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Kho"
                name="warehouse_id"
                rules={[{ required: false, message: "Chọn kho!" }]}
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
                  placeholder="Chọn kho"
                />
              </Form.Item>
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
      </Card>
    </>
  );
};

EMotorbikeDetail.propTypes = {
  mode: PropTypes.number,
};

export default EMotorbikeDetail;
