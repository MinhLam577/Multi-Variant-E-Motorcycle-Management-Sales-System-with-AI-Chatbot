"use client";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { GenderType, RegExps, UserType } from "@/app/constants";
import { useStore } from "@/src/stores";
import UploadPictureApi from "@/src/api/uploadFile";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import apiClient from "@/src/api/apiClient";
import endpoints from "@/src/api/endpoints";

const Account = observer(() => {
  const [initForm, setInitForm] = useState("");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingSlider, setLoadingSlider] = useState(false);

  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const store = useStore();
  const storeAccount = store.accountObservable;
  const fetchBlogDetail = async () => {
    try {
      await storeAccount.getAccount();
      const dataAccount = storeAccount.account;
      if (dataAccount) {
        const arrThumbnail = [
          {
            uid: "s",
            name: "Avatar",
            status: "done",
            url: dataAccount.avatarUrl,
            thumbnail: dataAccount.avatarUrl,
          },
        ];
        const init = {
          id: dataAccount?.userId,
          username: dataAccount?.username,
          email: dataAccount?.email,
          phoneNumber: dataAccount?.phoneNumber,
          gender: dataAccount?.gender,
          thumbnail: { fileList: arrThumbnail },
        };
        setInitForm(init);
        setDataThumbnail(arrThumbnail);
        form.setFieldsValue({
          ...init,
          birthday: dataAccount?.birthday ? dayjs(dataAccount.birthday) : null,
        });
        // form.setFieldsValue(init);
      }
      return () => {
        form.resetFields();
      };
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết Account:", error);
    }
  };

  useEffect(() => {
    fetchBlogDetail();
  }, []);
  const handleFormFinish = async (values) => {
    const updateInfo = {
      avatarUrl: dataThumbnail[0]?.url || "",
      username: values?.username,
      phoneNumber: values?.phoneNumber,
      gender: values.gender,
      birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null, // Chỉ lấy ngày, tránh lỗi múi giờ
    };

    try {
      const data = await apiClient.patch(
        endpoints.customers.update(storeAccount.account?.userId),
        updateInfo
      );
      if (data.status == 200) {

        const dataAccount = {
          ...storeAccount.account,
          ...updateInfo,
        };
        await storeAccount.setAccount(dataAccount);
        message.success("Cập nhật thành công");
      } else {
        message.error("Lỗi");
      }
    } catch (error) {
      console.log(error);
      message.error(error);
    }
  };
  const handleChange = (info, type) => {
    if (info.file.status === "uploading") {
      type ? setLoadingSlider(true) : setLoading(true);
      return;
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        type ? setLoadingSlider(false) : setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
    // upload ảnh
    const res = await UploadPictureApi.createImageCustomer(file);
    if (res && res.data) {
      setDataThumbnail([
        {
          name: res.data.url,
          uid: file.uid,
          status: "done",
          url: res.data.url,
        },
      ]);
      onSuccess("done");
    } else {
      onError("Đã có lỗi khi upload file");
    }
  };
  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSlider = dataSlider.filter((x) => x.uid !== file.uid);
      setDataSlider(newSlider);
    }
  };

  const handlePreview = async (file) => {
    if (file.url && !file.originFileObj) {
      setPreviewImage(file.url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
      return;
    }
    getBase64(file.originFileObj, (url) => {
      setPreviewImage(url);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    });
  };
  return (
    <div>
      <Form
        form={form}
        layout={"vertical"}
        autoComplete="off"
        onFinish={handleFormFinish}
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 24 }}
          label="Ảnh Thumbnail"
          name="thumbnail"
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            {initForm && (
              <Upload
                name="thumbnail"
                listType="picture-card"
                className="avatar-uploader"
                maxCount={1}
                multiple={false}
                customRequest={handleUploadFileThumbnail}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                onPreview={handlePreview}
                defaultFileList={initForm?.thumbnail?.fileList ?? []}
                // fileList={dataThumbnail} // dùng state để kiểm soát fileList
                showUploadList={{ showRemoveIcon: true }}
              >
                {dataThumbnail.length >= 1 ? null : (
                  <div>
                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            )}
          </div>

          {/* Chia thành 2 cột */}
          <Col span={12}>
            <Form.Item
              label="id"
              name="id"
              hidden
              rules={[{ required: true, message: "id!" }]}
            >
              <Input placeholder="id" />
            </Form.Item>
          </Col>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="username"
                rules={[{ required: true, message: "Hãy nhập họ và tên!" }]}
              >
                <Input placeholder="Nhập Họ và tên" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập số điện thoại!",
                  },
                  () => ({
                    validator(_, value) {
                      if (!value || RegExps.PhoneNumber.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Số điện thoại không đúng định dạng.")
                      );
                    },
                  }),
                ]}
              >
                <Input placeholder="Nhập Số điện thoại" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Ngày sinh" name="birthday">
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Email" name="email">
                <Input placeholder="Email" disabled="true" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Giới tính" name="gender">
                <Select
                  allowClear
                  optionFilterProp="label"
                  options={Object.keys(GenderType).map((item) => ({
                    value: item,
                    label: UserType[item],
                  }))}
                  placeholder="Chọn giới tính"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Nút cập nhật */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form.Item>
      </Form>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width={420} // hoặc 360, tuỳ bạn
      >
        <img
          alt="example"
          style={{
            width: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            display: "block",
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  );
});
export default Account;
// {!isReadOnly() && (
//     <div>
//       {loading ? <LoadingOutlined /> : <PlusOutlined />}
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </div>
//   )}
