import React, { useEffect, useState } from "react";
import {
    Button,
    Divider,
    Form,
    Input,
    message,
    Modal,
    notification,
    Select,
} from "antd";

import PropTypes from "prop-types";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
import { useParams } from "react-router";
import { ApiResponse } from "@/types/api-response.type";

const AddressModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(true);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const id = useParams();
    // https://ant.design/components/form#components-form-demo-control-hooks
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const province = provinces.find((p) => p.id === values.province);
        const district = districts.find((d) => d.id === values.district);
        const ward = wards.find((w) => w.id === values.ward);
        const formData = {
            ...values,
            customerId: values.customerId,
            province: province ? province.name : null,
            district: district ? district.name : null,
            ward: ward ? ward.name : null,
        };
        setIsSubmit(true);
        const res: ApiResponse<any> = await apiClient.post(
            endpoints.receive_address.create(),
            formData
        );
        if (res && res.data) {
            message.success(res.message);
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: "You can only have max 3 receive address",
                description: res.message,
            });
        }
        setIsSubmit(false);
    };

    //
    useEffect(() => {
        const fetchProvince = async () => {
            const data = await apiClient.get(endpoints.province.list);
            setProvinces(data.data.data);
        };
        fetchProvince();
    }, []);

    // gọi api tìm district
    const fetchDistrict = async (idProvince) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        const data = await apiClient.get(
            endpoints.district.districtByName(idProvince)
        );
        setDistricts(data.data.data);
    };

    // gọi api tìm award
    const fetchAward = async (idDistrict) => {
        form.setFieldsValue({ ward: undefined });
        const data = await apiClient.get(endpoints.ward.wardByName(idDistrict));
        setWards(data.data.data);
    };

    const handleProvinceChange = (value) => {
        fetchDistrict(value);
    };

    const handleDistrictChange = (value) => {
        fetchAward(value);
    };

    return (
        <>
            <Modal
                title="Thêm mới địa chỉ người dùng"
                open={openModalCreate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => setOpenModalCreate(false)}
                okText={"Tạo mới"}
                cancelText={"Hủy"}
                // confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ customerId: id.id }} // Gán customerId ẩn vào form
                >
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="id"
                        name="customerId"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Tên người nhận"
                        name="receiver_name"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập tên người nhận!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Số điện thoại"
                        name="receiver_phone"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Địa chỉ"
                        name="street"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập địa chỉ!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Tỉnh/Thành phố"
                        name="province"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn tỉnh/thành phố!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Select
                            onChange={handleProvinceChange}
                            options={provinces.map((p) => ({
                                value: p.id,
                                label: p.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Quận/Huyện"
                        name="district"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn quận/huyện!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Select
                            onChange={handleDistrictChange}
                            options={districts.map((d) => ({
                                value: d.id,
                                label: d.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Phường/Xã"
                        name="ward"
                        labelCol={{ span: 24 }}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn phường/xã!",
                            },
                        ]}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Select
                            options={wards.map((w) => ({
                                value: w.id,
                                label: w.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mã bưu điện"
                        name="postal_code"
                        labelCol={{ span: 24 }}
                        style={{ marginBottom: 8 }} // Giảm khoảng cách
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Ghi chú"
                        name="note"
                        labelCol={{ span: 24 }}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
AddressModalCreate.propTypes = {
    openModalCreate: PropTypes.bool,
    setOpenModalCreate: PropTypes.func,
    fetchUser: PropTypes.func,
};
export default AddressModalCreate;
