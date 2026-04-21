"use client";
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

import { useParams } from "react-router-dom";

import apiClient from "@/src/api/apiClient";
import endpoints from "@/src/api/endpoints";
import { AddressResponseType } from "@/src/stores/address";

const AddressModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(true);
    const [provinces, setProvinces] = useState<AddressResponseType[]>([]);
    const [districts, setDistricts] = useState<AddressResponseType[]>([]);
    const [wards, setWards] = useState([]);
    const id = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const province = provinces.find((p) => p.code === values.province);
        const district = districts.find((d) => d.code === values.district);
        const ward = wards.find((w) => w.code === values.ward);
        const formData = {
            ...values,
            customerId: values.customerId,
            province: province ? province?.name || province : null,
            district: district ? district?.name || district : null,
            ward: ward ? ward?.name || ward : null,
        };

        setIsSubmit(true);
        const res = await apiClient.post(
            endpoints.receive_address.create(),
            formData
        );
        if (res.data) {
            message.success("Tạo địa chỉ thành công");
            form.resetFields();
            setOpenModalCreate(false);
            await props.fetchUser();
        } else {
            notification.error({
                message: "Lỗi tạo địa chỉ",
                description:
                    res.data?.message ||
                    "Đã có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại sau.",
            });
        }
        setIsSubmit(false);
    };

    const fetchProvince = async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.get(endpoints.province.list);
            setProvinces(data?.data);
        } catch (e) {
            console.log("lỗi khi fetch province: ", e);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchProvince();
    }, []);

    // gọi api tìm district
    const fetchDistrict = async (idProvince) => {
        form.setFieldsValue({ district: undefined, ward: undefined });
        const data = await apiClient.get(
            endpoints.district.districtByName(idProvince)
        );
        setDistricts(data.data);
    };

    // gọi api tìm award
    const fetchAward = async (idDistrict) => {
        form.setFieldsValue({ ward: undefined });
        const data = await apiClient.get(endpoints.ward.wardByName(idDistrict));
        setWards(data.data);
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
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText="Tạo mới"
                cancelText="Hủy"
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ customerId: props.userID }}
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
                        style={{ marginBottom: 8 }}
                    >
                        <Input autoComplete="off" />
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
                        style={{ marginBottom: 8 }}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>

                    {/* Dòng 1: Địa chỉ + Tỉnh/Thành phố */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <Form.Item
                            label="Địa chỉ"
                            name="street"
                            labelCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập địa chỉ!",
                                },
                            ]}
                            style={{ flex: 1, marginBottom: 8 }}
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
                            style={{ flex: 1, marginBottom: 8 }}
                        >
                            <Select
                                onChange={handleProvinceChange}
                                showSearch={{
                                    filterOption: (input, option) =>
                                        option?.label
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase()),
                                }}
                                options={provinces?.map((p) => ({
                                    value: p.code,
                                    label: p.name,
                                }))}
                            />
                        </Form.Item>
                    </div>

                    {/* Dòng 2: Quận/Huyện + Phường/Xã */}
                    <div style={{ display: "flex", gap: 16 }}>
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
                            style={{
                                marginBottom: 8,
                                flex: "1 1 50%",
                                minWidth: 0,
                            }}
                        >
                            <Select
                                onChange={handleDistrictChange}
                                showSearch={{
                                    filterOption: (input, option) =>
                                        option?.label
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase()),
                                }}
                                options={districts?.map((d) => ({
                                    value: d.code,
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
                            style={{
                                marginBottom: 8,
                                flex: "1 1 50%",
                                minWidth: 0,
                            }}
                        >
                            <Select
                                showSearch={{
                                    filterOption: (input, option) =>
                                        option?.label
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase()),
                                }}
                                options={wards?.map((w) => ({
                                    value: w.code,
                                    label: w.name,
                                }))}
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Mã bưu điện"
                        name="postal_code"
                        labelCol={{ span: 24 }}
                        style={{ marginBottom: 8 }}
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

export default AddressModalCreate;
