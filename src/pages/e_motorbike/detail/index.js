import {
  CloseOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Form } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createCar, updateCar } from "../../../api/cars";
import {
  ProcessModalName,
  processWithModals,
} from "../../../containers/processWithModals";
import { useStore } from "../../../stores";
import EMotorbikeDetailScreen from "./screen";
import { observer } from "mobx-react-lite";
import { toJS } from "mobx";

export const ProductsDetailMode = {
  View: 1,
  Add: 2,
  Edit: 3,
};

const EMotorbikeDetail = observer(({ mode }) => {
  const { id } = useParams();
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const { motorbikeObservable } = useStore();
  const { listBrand, listCategory, listColor } = motorbikeObservable;

  const [isOpenWarehousePopup, setIsOpenWarehousePopup] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [settingData, setData] = useState({
    categories: [],
    colors: [],
    brands: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await motorbikeObservable.getAllConfig();
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
      //   stock: parseInt(dto?.stock ?? 0),
      images: fileList?.map((i) => ({
        url: i?.url,
        color: "",
        count: "",
      })),
      videosCount: 0,
      rating: 0,
      reviewsCount: 0,
      status: true,
      specifications: [],
      subscriptionPlans: [],
    };
    delete formData.listImgUrl;
    delete formData.stock;

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
    <EMotorbikeDetailScreen
      mode={mode}
      form={form}
      handleFormFinish={handleFormFinish}
      handleCancel={handleCancel}
      handleEdit={handleEdit}
      settingData={settingData}
      isReadOnly={isReadOnly}
      fileList={fileList}
      setFileList={setFileList}
      setIsOpenWarehousePopup={setIsOpenWarehousePopup}
      getButtonCancelText={getButtonCancelText}
      getButtonEditText={getButtonEditText}
      getButtonOkText={getButtonOkText}
      isOpenWarehousePopup={isOpenWarehousePopup}
      handleOk={handleOk}
      listBrand={toJS(listBrand)}
      listCategory={toJS(listCategory)}
      listColor={toJS(listColor)}
    />
  );
});

EMotorbikeDetail.propTypes = {
  mode: PropTypes.number,
};

export default EMotorbikeDetail;
