import {
    ModalForm,
    ProFormSelect,
    ProFormText,
} from "@ant-design/pro-components";
import { Col, Form, Row, message } from "antd";
import { isMobile } from "react-device-detect";
import { ALL_MODULES } from "src/constants/permissions";
import apiClient from "src/api/apiClient";
import endpoints from "src/api/endpoints";
import { useStore } from "src/stores";
import { PermissionResponseType } from "src/types/permission.type";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: PermissionResponseType | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
    fetchPermissions: (query: object) => Promise<void>;
}

const ModalPermission = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } =
        props;
    const [form] = Form.useForm();
    const store = useStore();
    const permissionStore = store.permissionObservable;
    const submitPermission = async (valuesForm: any) => {
        const { name, path, method, module } = valuesForm;
        if (dataInit?.id) {
            try {
                // Tạo object permission
                const permission = {
                    name,
                    path,
                    method,
                    module,
                };

                // Gửi request cập nhật permission
                const res = await apiClient.patch(
                    endpoints.permission.update(dataInit.id),
                    permission
                );

                if (res.data) {
                    message.success(res.data.message);
                    props.fetchPermissions({
                        ...permissionStore.pagination,
                    });
                    handleReset();
                    reloadTable();
                } else {
                    message.error("Cập nhật permission thất bại");
                }
            } catch (error: any) {
                message.error(error.message);
            }
        } else {
            try {
                // Tạo object permission
                const permission = {
                    name,
                    path,
                    method,
                    module,
                };

                // Gửi request tạo mới permission
                const res = await apiClient.post(
                    endpoints.permission.create,
                    permission
                );

                if (res.data) {
                    message.success("Thêm mới permission thành công");
                    handleReset();
                    reloadTable();
                    props.fetchPermissions({
                        ...permissionStore.pagination,
                    });
                } else {
                    message.error("Có lỗi xảy ra khi thêm permission");
                }
            } catch (error: any) {
                message.error(error?.message);
            }
        }
    };

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    return (
        <>
            <ModalForm
                title={
                    <>
                        {dataInit?.id
                            ? "Cập nhật Permission"
                            : "Tạo mới Permission"}
                    </>
                }
                open={openModal}
                modalProps={{
                    onCancel: () => {
                        handleReset();
                    },

                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy",
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={async (values) => {
                    submitPermission(values);
                }}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên Permission"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng không bỏ trống",
                                },
                            ]}
                            placeholder="Nhập name"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="API Path"
                            name="path"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng không bỏ trống",
                                },
                            ]}
                            placeholder="Nhập path"
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="method"
                            label="Method"
                            valueEnum={{
                                GET: "GET",
                                POST: "POST",
                                PUT: "PUT",
                                PATCH: "PATCH",
                                DELETE: "DELETE",
                            }}
                            placeholder="Please select a method"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn method!",
                                },
                            ]}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSelect
                            name="module"
                            label="Thuộc Module"
                            valueEnum={ALL_MODULES}
                            showSearch
                            placeholder="Please select a module"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn module!",
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    );
};

export default ModalPermission;
