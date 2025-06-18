import {
    CloseOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { Form } from "antd";
import { reaction, toJS } from "mobx";
import { observer } from "mobx-react-lite";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { RequestStatus } from "../../../constants";
import {
    ProcessModalName,
    processWithModals,
} from "../../../containers/processWithModals";
import { useStore } from "../../../stores";
import EMotorbikeDetailScreen from "./screen";

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
    const [settingData] = useState({
        categories: [],
        colors: [],
        brands: [],
    });

    useEffect(() => {
        return reaction(
            () => motorbikeObservable.status,
            (status, prevStatus) => {
                handleLoginEvents(prevStatus, status);
            }
        );
    }, []);

    const handleLoginEvents = (prevStatus, status) => {
        if (prevStatus === RequestStatus.SUBMITTING) {
            // setIsLoading(false);
        }
        switch (status) {
            case RequestStatus.SUBMITTING: {
                // setIsLoading(true);
                break;
            }

            case RequestStatus.FETCH_DETAIL_SUCCESS: {
                const data = toJS(motorbikeObservable?.detail);
                form.setFieldsValue({
                    ...data,
                    category_id: data?.category?.id,
                    brand_id: data?.brand?.id,
                });

                break;
            }

            default: {
                break;
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await motorbikeObservable.getAllConfig();
        };

        if (id) {
            fetchDetail();
        }

        fetchData();
    }, [id]);

    const fetchDetail = async () => {
        await motorbikeObservable.getDetail(id);
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
        const formData = {
            ...values,
            category_id: values?.category_id,
            brand_id: values?.brand_id.toString(),
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
            depositPrice: parseFloat(values?.depositPrice),
        };
        delete formData.listImgUrl;
        delete formData.stock;
        delete formData.id;

        if (mode === ProductsDetailMode.Add) {
            await motorbikeObservable.updateCar({
                form: formData,
                id: values.id,
            });
        }

        if (mode === ProductsDetailMode.Edit) {
            await motorbikeObservable.updateMotorbike({
                form: formData,
                id: values.id,
            });
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
