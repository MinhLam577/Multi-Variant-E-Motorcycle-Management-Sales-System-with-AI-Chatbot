import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Form, Input } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ProcessModalName,
  processWithModals,
} from "../../containers/processWithModals";
import RichTextEditor from "../../containers/RichTextEditor";
import UploadSinglePictureGetUrl, {
  UploadSinglePictureGetUrlRemoteMode,
} from "../../containers/UploadSinglePictureGetUrl";

export const NewsDetailMode = {
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

const NewsDetail = ({ mode }) => {
  const { id } = useParams();
  const { idblog } = useParams();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  const getCardTitle = () => {
    if (mode === NewsDetailMode.View) {
      return "Chi tiết tin tức";
    } else if (mode === NewsDetailMode.Add) {
      return "Tạo tin tức";
    } else if (mode === NewsDetailMode.Edit) {
      return "Chỉnh sửa tin tức";
    }
  };

  const getButtonOkText = () => {
    if (mode === NewsDetailMode.Add) {
      return (
        <>
          <PlusOutlined />
          &nbsp;Tạo
        </>
      );
    } else if (mode === NewsDetailMode.Edit) {
      return (
        <>
          <SaveOutlined />
          &nbsp;Lưu
        </>
      );
    }
  };

  const getButtonCancelText = () => {
    if (mode === NewsDetailMode.Add) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === NewsDetailMode.Edit) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Hủy
        </>
      );
    } else if (mode === NewsDetailMode.View) {
      return (
        <>
          <CloseOutlined />
          &nbsp;Đóng
        </>
      );
    }
  };

  const getButtonEditText = () => {
    if (mode === NewsDetailMode.View) {
      return (
        <>
          <EditOutlined />
          &nbsp;Sửa
        </>
      );
    }
  };

  const prepareForm = (loadedData) => {
    if (mode === NewsDetailMode.View) {
      form.setFieldsValue({
        ...loadedData,
      });
    } else if (mode === NewsDetailMode.Add) {
      form.resetFields();
    } else if (mode === NewsDetailMode.Edit) {
      form.setFieldsValue({
        ...loadedData,
      });
    }
  };

  const isReadOnly = () => {
    if (mode === NewsDetailMode.Add) {
      return false;
    } else if (mode === NewsDetailMode.Edit) {
      return false;
    }
    return true;
  };

  const handleOk = () => {
    if (mode === NewsDetailMode.Add) {
      form.submit();
    } else if (mode === NewsDetailMode.Edit) {
      form.submit();
    }
  };

  const handleCancel = () => {
    if (mode === NewsDetailMode.Edit) {
      console.log(id);
      console.log(idblog);
      processWithModals(ProcessModalName.ConfirmCancelEditing)(() => {
        navigate(`/categorynews/${id}/news`);
      });
    } else {
      navigate(`/categorynews/${id}/news`);
    }
  };

  const handleEdit = () => {
    if (mode === NewsDetailMode.View) {
      navigate(`/categorynews/${id}/news/${idblog}/edit`, { replace: true });
    }
  };

  const handleFormFinish = (values) => {
    const dto = {
      ...values,
    };
    if (mode === NewsDetailMode.Add) {
      processWithModals(ProcessModalName.ConfirmCreateNews)(() => {});
    } else if (mode === NewsDetailMode.Edit) {
      processWithModals(ProcessModalName.ConfirmUpdateNews)(() => {});
    }
  };

  return (
    <>
      <Card title={getCardTitle()}>
        <Form
          form={form}
          {...formItemLayout}
          layout={"vertical"}
          autoComplete="off"
          onFinish={handleFormFinish}
        >
          <Form.Item name="newsId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            className="flex justify-center"
            name="thumbnail"
            rules={[{ required: true, message: "Hãy chọn ảnh bìa!" }]}
          >
            <UploadSinglePictureGetUrl
              remoteMode={UploadSinglePictureGetUrlRemoteMode.Private}
              disabled={isReadOnly()}
              maxCount={1}
              fileList={fileList}
              setFileList={setFileList}
            />
          </Form.Item>
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Hãy nhập tiêu đề tin tức!" }]}
          >
            <Input readOnly={isReadOnly()} placeholder="Nhập Tiêu đề tin tức" />
          </Form.Item>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Hãy nhập slug tin tức!" }]}
          >
            <Input
              maxLength={255}
              readOnly={isReadOnly()}
              placeholder="vd: blog-slug"
            />
          </Form.Item>
          <Form.Item
            className="custom-antd-richtext-editor mb-20"
            label="Nội dung"
            name="content"
            rules={[{ required: true, message: "Hãy nhập nội dung tin tức!" }]}
          >
            <RichTextEditor
              className="h-[400px] mb-10"
              readOnly={isReadOnly()}
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

NewsDetail.propTypes = {
  mode: PropTypes.number,
};

export default NewsDetail;
