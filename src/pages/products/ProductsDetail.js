import {
  CloseOutlined,
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAll } from "../../api/cars";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import RichTextEditor from "../../containers/RichTextEditor";
import UploadSinglePictureGetUrl, {
  UploadSinglePictureGetUrlRemoteMode,
} from "../../containers/UploadSinglePictureGetUrl";
import { CREATE_PRODUCT, UPDATE_PRODUCT } from "../../graphql/products";

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

const ProductsDetail = ({ mode }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [settingData, setData] = useState({
    categories: [],
    colors: [],
    branches: [],
  });

  console.log("settingData", settingData);

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

  const [createProduct, { loading: creating }] = useMutation(CREATE_PRODUCT, {
    onCompleted: (res) => {
      if (res?.createProduct?.status) {
        message.success("Tạo sản phẩm thành công!");
        navigate(`/products`);
      }
    },
  });

  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: (res) => {
      if (res?.updateProduct?.status) {
        message.success("Cập nhật sản phẩm thành công!");
        navigate(`/products`);
      }
    },
  });

  const getCardTitle = () => {
    if (mode === ProductsDetailMode.View) {
      return "Chi tiết sản phẩm";
    } else if (mode === ProductsDetailMode.Add) {
      return "Tạo sản phẩm";
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

  const prepareForm = (loadedData) => {
    if (mode === ProductsDetailMode.View) {
      form.setFieldsValue({
        ...loadedData,
        categoryIds: loadedData.categories?.map((i) => i?.categoryId),
        storeIds: loadedData.stores?.map((i) => i?.storeId),
        productPrices: loadedData.prices?.map((i) => ({
          name: i.name,
          price: i.price,
          oneUnit: i.oneUnit,
        })),
        unit: loadedData.unit,
      });
    } else if (mode === ProductsDetailMode.Add) {
      form.resetFields();
    } else if (mode === ProductsDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData,
        categoryIds: loadedData.categories?.map((i) => i?.categoryId),
        storeIds: loadedData.stores?.map((i) => i?.storeId),
        productPrices: loadedData.prices?.map((i) => ({
          name: i.name,
          price: i.price,
          oneUnit: i.oneUnit,
        })),
        unit: loadedData.unit,
      });
    }
  };

  const isReadOnly = () => {
    if (mode === ProductsDetailMode.Add) {
      return false;
    } else if (mode === ProductsDetailMode.Edit) {
      return false;
    }

    // mode === ProductsDetailMode.View
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
        navigate(`/products`);
      });
    } else {
      navigate("/products");
    }
  };

  const handleEdit = () => {
    if (mode === ProductsDetailMode.View) {
      navigate(`/products/${id}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values,
    };
    if (mode === ProductsDetailMode.Add) {
      createProduct({
        variables: {
          createProductInput: {
            ...dto,
            listImgUrl: fileList?.map((i) => i?.url),
          },
        },
      });
      return;
    }

    if (mode === ProductsDetailMode.Edit) {
      updateProduct({
        variables: {
          updateProductInput: {
            ...dto,
            listImgUrl: fileList?.map((i) => i?.url),
            productId: id,
          },
        },
      });
      return;
    }
  };

  return (
    <>
      <Card loading={loading || creating || updating} title={getCardTitle()}>
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
            className="flex justify-center"
            name="listImgUrl"
            // rules={[{ required: true, message: 'Hãy chọn ít nhất 1 ảnh!' }]}
          >
            <UploadSinglePictureGetUrl
              remoteMode={UploadSinglePictureGetUrlRemoteMode.Private}
              disabled={isReadOnly()}
              maxCount={5}
              fileList={fileList}
              setFileList={setFileList}
            />
          </Form.Item>

          {/* product name */}
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Hãy nhập tên sản phẩm!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          {/* category  */}
          <Form.Item
            label="Danh mục xe"
            name="name"
            rules={[{ required: true, message: "Chọn danh mục!" }]}
          >
            <Select
              allowClear
              showSearch
              mode="multiple"
              optionFilterProp="label"
              options={[
                { categoryId: "21212", categoryName: "Xe tải" },
                { categoryId: "21212", categoryName: "Xe Ben" },
              ]?.map((item) => {
                return {
                  value: item?.categoryId,
                  label: item?.categoryName,
                };
              })}
              placeholder="Chọn danh mục"
            />
          </Form.Item>

          {/* brand */}
          <Form.Item
            label="Thương hiệu"
            name="name"
            rules={[{ required: true, message: "Chọn thương hiệu!" }]}
          >
            <Select
              allowClear
              showSearch
              mode="multiple"
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

          {/* modelYear */}
          <Form.Item
            label="Model"
            name="name"
            rules={[{ required: true, message: "Chọn model!" }]}
          >
            <Select
              allowClear
              showSearch
              mode="multiple"
              optionFilterProp="label"
              options={[
                { categoryId: "21212", categoryName: "2024" },
                { categoryId: "21212", categoryName: "2025" },
              ]?.map((item) => {
                return {
                  value: item?.categoryId,
                  label: item?.categoryName,
                };
              })}
              placeholder="Chọn model"
            />
          </Form.Item>

          {/* note */}
          <Form.Item
            label="Mô tả"
            name="brief"
            rules={[{ required: true, message: "Hãy nhập mô tả sản phẩm!" }]}
          >
            <Input
              maxLength={255}
              readOnly={isReadOnly()}
              placeholder="Nhập mô tả sản phẩm"
            />
          </Form.Item>

          {/* description  */}
          <Form.Item
            className="custom-antd-richtext-editor mb-20"
            label="Nội dung"
            name="description"
            rules={[{ required: true, message: "Hãy nhập nội dung sản phẩm!" }]}
          >
            <RichTextEditor
              className="h-[400px] mb-10"
              readOnly={isReadOnly()}
            />
          </Form.Item>
          <div className="mb-2">Giá sản phẩm</div>
          <Form.List
            name="productPrices"
            initialValue={[{ name: "", price: "", oneUnit: "" }]}
          >
            {(value, { add, remove }) => (
              <>
                <div className="flex flex-wrap gap-4">
                  <InputNumber
                    min={0}
                    placeholder="Giá 1 số lượng sản phẩm"
                    formatter={(value) =>
                      `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    className="w-full"
                  />
                </div>
              </>
            )}
          </Form.List>
          <Form.Item label="Danh mục" name="categoryIds">
            <Select
              allowClear
              optionFilterProp="label"
              mode="multiple"
              options={[]?.map((i) => ({
                value: i?.categoryId,
                label: i?.categoryName,
              }))}
              readOnly={isReadOnly()}
              placeholder="Chọn danh mục"
            />
          </Form.Item>
          <Form.Item label="Cửa hàng" name="storeIds">
            <Select
              allowClear
              options={settingData?.categories?.map((i) => ({
                value: i?.id,
                label: i?.name,
              }))}
              readOnly={isReadOnly()}
              placeholder="Chọn cửa hàng"
            />
          </Form.Item>
          <Form.Item label="Chọn màu xe" name="unit">
            <Select
              allowClear
              optionFilterProp="label"
              options={settingData?.colors?.map((i) => ({
                value: i?.hex,
                label: i?.name,
              }))}
              readOnly={isReadOnly()}
              placeholder="Chọn màu xe"
            />
          </Form.Item>

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

ProductsDetail.propTypes = {
  mode: PropTypes.number,
};

export default ProductsDetail;
