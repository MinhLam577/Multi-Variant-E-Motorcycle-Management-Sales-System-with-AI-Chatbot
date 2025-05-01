import { Descriptions, Modal, notification, Table } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import PropTypes from "prop-types";
const { Dragger } = Upload;
import * as XLSX from "xlsx";
import { useState } from "react";
import { callBulkCreateUser } from "../../api/user.api";
import templateFile from "./test_user.xlsx?url";
import apiClient from "../../api/apiClient";
import endpoints from "../../api/endpoints";
const UserImport = (props) => {
    const { setOpenModalImport, openModalImport } = props;
    const [dataExcel, setDataExcel] = useState([]);
    // https://stackoverflow.com/questions/51514757/action-function-is-required-with-antd-upload-control-but-i-dont-need-it
    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    // tự tạo biến prop
    const propsUpload = {
        name: "file",
        // upload 1 file duy nhất thôi
        multiple: false,
        maxCount: 1,
        // loại file muốn upload
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        // https://stackoverflow.com/questions/11832930/html-input-file-accept-attribute-file-type-csv

        // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

        // tóm lại : ko dùng action thôi mà chỉ read file csv ra bảng
        customRequest: dummyRequest,
        onChange(info) {
            // sau khi upload thanh công thì chạy vào đây
            const { status } = info.file;
            if (status !== "uploading") {
                // lúc delete
                console.log(info.file, info.fileList);

                if (info.fileList && info.fileList.length > 0) {
                    // lấy ra file dựa vào fileList
                    const file = info.fileList[0].originFileObj;
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);
                    // thao tác với file bất đồng bộ nên tốn thời gian => viết dạng callback
                    reader.onload = function (e) {
                        const data = new Uint8Array(reader.result);
                        const workbook = XLSX.read(data, { type: "array" });
                        console.log(workbook);
                        // Lấy tên sheet đầu tiên workbook.SheetNames[0]
                        // Lấy dữ liệu của sheet đó
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        console.log(sheet);
                        // Chuyển đổi dữ liệu sheet thành JSON
                        // const json = XLSX.utils.sheet_to_json(sheet);
                        // đọc ngược lại mã nguồn để biết header
                        const json = XLSX.utils.sheet_to_json(sheet, {
                            header: [
                                "username",
                                "email",
                                "address",
                                "phoneNumber",
                                "birthday",
                                "gender",
                                "role",
                            ],
                            range: 1, // Bỏ qua dòng tiêu đề
                            raw: false, // Chuyển đổi giá trị số thành ngày nếu có
                            dateNF: "MM/DD/YYYY", // Định dạng ngày đầy đủ
                        });

                        // Kiểm tra và sửa lại năm nếu bị rút gọn (nếu cần)
                        json.forEach((item) => {
                            if (item.birthday) {
                                const parsedDate = new Date(item.birthday);
                                if (!isNaN(parsedDate)) {
                                    item.birthday =
                                        parsedDate.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        });
                                }
                            }
                        });

                        console.log(json);

                        if (Array.isArray(json) && json.length > 0) {
                            setDataExcel(json);
                        }
                    };
                }
            }
            if (status === "done") {
                console.log(info.file, info.fileList);
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files);
        },
    };

    const handleSubmit = async () => {
        const data = dataExcel.map((item) => {
            item.password = "123456";
            return item;
        });
        const res = await apiClient.post(
            endpoints.user.callBulkCreateUser,
            data
        );
        console.log(res);
        if (res?.data) {
            notification.success({
                description: `Success: ${res.data.successCount}, Error: ${res.data.errorCount}`,
                message: "Upload thành công",
            });
            setDataExcel([]);
            setOpenModalImport(false);
            props.fetchUser();
        } else {
            console.log(res);
            notification.error({
                description: res.message,
                message: "Đã có lỗi xảy ra",
            });
        }
    };

    return (
        <>
            <Modal
                title="Import data user"
                width={"50vw"}
                open={openModalImport}
                onOk={() => handleSubmit()}
                onCancel={() => {
                    setOpenModalImport(false);
                    setDataExcel([]);
                }}
                okText="Import data"
                okButtonProps={{
                    disabled: dataExcel.length < 1,
                }}
                //do not close when click outside
                maskClosable={false}
            >
                <Dragger {...propsUpload}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls,
                        .xlsx
                    </p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls,
                        .xlsx . or &nbsp;{" "}
                        <a
                            onClick={(e) => e.stopPropagation()}
                            href={templateFile}
                            download
                        >
                            Download Sample File
                        </a>
                    </p>
                    ;
                </Dragger>

                <div style={{ paddingTop: 20 }}>
                    <Table
                        title={() => <span>Dữ liệu upload:</span>}
                        dataSource={dataExcel}
                        columns={[
                            {
                                dataIndex: "username",
                                title: "Tên hiển thị",
                                ellipsis: true,
                            },
                            {
                                dataIndex: "email",
                                title: "Email",
                                ellipsis: true,
                            },
                            {
                                dataIndex: "phoneNumber",
                                title: "Số điện thoại",
                                ellipsis: true,
                            },
                            {
                                dataIndex: "address",
                                title: "Địa chỉ",
                                ellipsis: true,
                            },
                            {
                                dataIndex: "birthday",
                                title: "Ngày Sinh",
                                ellipsis: true,
                            },
                            {
                                dataIndex: "gender",
                                title: "Giới tính",
                                ellipsis: true,
                            },
                            {
                                dataIndex: "role",
                                title: "Vai trò",
                                ellipsis: true,
                            },
                        ]}
                    />
                </div>
            </Modal>
        </>
    );
};
// Thêm PropTypes để định nghĩa kiểu của props
UserImport.propTypes = {
    setOpenModalImport: PropTypes.func.isRequired, // Phải là một function
    openModalImport: PropTypes.bool.isRequired, // Phải là boolean
    fetchUser: PropTypes.func,
};
export default UserImport;
