"use client";
import authAPI from "@/src/api/authAPI";
import { notification } from "antd";
import { useState } from "react";

const ContactSeller = ({ setShowModal }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        note: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Gửi dữ liệu hoặc xử lý tại đây

        // Ví dụ: Gọi API hoặc reset form
        // fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
        const { data, message, status } = await authAPI.contactPrice(formData);
        if (status === 201) {
            notification.success({
                message: "Thành công",
                description: message,
            });
            setShowModal(false);
        }

        // Reset form sau khi gửi
        setFormData({
            name: "",
            phone: "",
            email: "",
            note: "",
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Họ tên */}
                <div className="col-lg-12">
                    <div className="mb-3">
                        <input
                            className="form-control form_control"
                            type="text"
                            placeholder="Họ tên"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Số điện thoại */}
                <div className="col-lg-12">
                    <div className="mb-3">
                        <input
                            className="form-control form_control"
                            type="text"
                            placeholder="Số điện thoại"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="col-lg-12">
                    <div className="mb-3">
                        <input
                            className="form-control form_control"
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Ghi chú */}
                <div className="col-md-12">
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            rows={4}
                            placeholder="Nhập ghi chú..."
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Nút gửi */}
                <div className="col-md-12">
                    <button
                        className="btn btn-block btn-thm mt10 mb20"
                        type="submit"
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ContactSeller;
