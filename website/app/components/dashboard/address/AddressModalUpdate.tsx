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

import { useParams } from "react-router";
import apiClient from "@/src/api/apiClient";
import endpoints from "@/src/api/endpoints";
import { AddressResponseType } from "@/src/stores/address";

const AddressModalUpdate = (props) => {
    const {
        openAddressModalUpdate,
        setOpenModalUpdate,
        setAddressDataUpdate,
        dataAddressUpdate,
    } = props;
    const [isSubmit, setIsSubmit] = useState(true);
    const [provinces, setProvinces] = useState<AddressResponseType[]>([]);
    const [districts, setDistricts] = useState<AddressResponseType[]>([]);
    const [wards, setWards] = useState<AddressResponseType[]>([]);

    const [form] = Form.useForm();
    useEffect(() => {
        if (dataAddressUpdate) {
            form.setFieldsValue(dataAddressUpdate);
        }
    }, [dataAddressUpdate]);

    const onFinish = async (values) => {
        let province = values.province;
        if (provinces?.length) {
            province =
                provinces.find((p) => p.code === values.province)?.name ||
                province;
        }
        let district = values.district;
        if (districts?.length) {
            district =
                districts.find((d) => d.code === values.district)?.name ||
                district;
        }
        let ward = values.ward;
        if (wards?.length) {
            ward = wards.find((w) => w.code === values.ward)?.name || ward;
        }

        const formData = {
            ...values,
            customerId: values.customerId,
            province: province ? province : null,
            district: district ? district : null,
            ward: ward ? ward : null,
        };

        setIsSubmit(true);
        const res = await apiClient.put(
            endpoints.receive_address.update(dataAddressUpdate.id),
            formData
        );

        if (res && res.data) {
            message.success("Cập nhật địa chỉ thành công");
            form.resetFields();
            setOpenModalUpdate(false);
            props.fetchUser();
        } else {
            notification.error({
                message: "Cập nhật địa chỉ thất bại",
                description:
                    res.data?.message ||
                    "Đã có lỗi xảy ra khi cập nhật địa chỉ. Vui lòng thử lại sau.",
            });
        }
        setIsSubmit(false);
    };

    useEffect(() => {
        const fetchProvince = async () => {
            const data = await apiClient.get(endpoints.province.list);
            setProvinces(data.data);
        };
        fetchProvince();
    }, []);

    const fetchDistrict = async (idProvince) => {
        form.setFieldsValue({ district: undefined, ward: undefined });

        const data = await apiClient.get(
            endpoints.district.districtByName(idProvince)
        );
        setDistricts(data.data);
    };

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
                title="Cập nhật địa chỉ người dùng"
                open={openAddressModalUpdate}
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.setFieldsValue(dataAddressUpdate);
                }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{ customerId: props.userID }} // Gán customerId ẩn vào form
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
                    <div style={{ display: "flex", gap: 16 }}>
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
                            style={{
                                marginBottom: 8,
                                flex: "1 1 50%",
                                minWidth: 0,
                            }}
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
                            style={{
                                marginBottom: 8,
                                flex: "1 1 50%",
                                minWidth: 0,
                            }}
                        >
                            <Select
                                onChange={handleProvinceChange}
                                showSearch={{
                                    filterOption: (input, option) =>
                                        option?.label
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase()),
                                }}
                                options={provinces.map((p) => ({
                                    value: p.code,
                                    label: p.name,
                                }))}
                            />
                        </Form.Item>
                    </div>

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
                                style={{ width: "100%" }}
                                onChange={handleDistrictChange}
                                showSearch={{
                                    filterOption: (input, option) =>
                                        option?.label
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase()),
                                }}
                                options={districts.map((d) => ({
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
                                style={{ width: "100%" }}
                                showSearch={{
                                    filterOption: (input, option) =>
                                        option?.label
                                            ?.toLowerCase()
                                            .includes(input.toLowerCase()),
                                }}
                                options={wards.map((w) => ({
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
AddressModalUpdate.propTypes = {
    openAddressModalUpdate: PropTypes.bool,
    setOpenModalUpdate: PropTypes.func,
    setAddressDataUpdate: PropTypes.func,
    dataAddressUpdate: PropTypes.bool,
    fetchUser: PropTypes.func,
    userID: PropTypes.string,
};
export default AddressModalUpdate;
