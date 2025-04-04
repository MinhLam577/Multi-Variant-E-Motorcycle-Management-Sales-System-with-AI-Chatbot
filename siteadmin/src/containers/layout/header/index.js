import {
    LogoutOutlined,
    ProfileOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Col, Layout, Menu, Popover, Row, Space, theme } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../../../stores";
import { ProcessModalName, processWithModals } from "../../processWithModals";
import { useAuth } from "../../../contexts/AuthProvider";
const { Header } = Layout;

const HeaderComponent = () => {
    const navigate = useNavigate();
    const { accountObservable } = useStore();
    const account = accountObservable?.account;
    const auth = useAuth();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [openMenuPopup, setOpenMenuPopup] = useState(false);

    const handleLogout = () => {
        auth.logOut();
    };

    const getMenuPopupTitle = () => {
        return `Xin chào, ${account?.username}`;
    };

    const getMenuPopupContent = () => {
        return (
            <Menu
                selectedKeys={null}
                items={[
                    {
                        key: 0,
                        label: (
                            <Space>
                                <ProfileOutlined />
                                &nbsp;Thông tin tài khoản
                            </Space>
                        ),
                        title: "Thông tin tài khoản",
                        onClick: () => {
                            navigate("/profile");
                        },
                    },
                    {
                        key: 1,
                        label: (
                            <Space>
                                <LogoutOutlined />
                                &nbsp;Đăng xuất
                            </Space>
                        ),
                        title: "Đăng xuất",
                        onClick: () => {
                            processWithModals(ProcessModalName.ConfirmLogout)(
                                handleLogout
                            );
                        },
                    },
                ]}
                onClick={() => {
                    setOpenMenuPopup(false);
                }}
            />
        );
    };

    return (
        <Header
            style={{
                background: "#f7fafd",
            }}
            className="px-2 pr-8 border-b border-b-gray-600 shadow-lg mb-4"
        >
            <Row justify="end">
                <Col>
                    <Popover
                        placement="bottomLeft"
                        open={openMenuPopup}
                        onOpenChange={(open) => setOpenMenuPopup(open)}
                        title={getMenuPopupTitle()}
                        content={getMenuPopupContent()}
                        trigger="click"
                    >
                        <Space direction="horizontal" align="start" size={16}>
                            <Space wrap size={16}>
                                <Avatar
                                    className="border border-gray-300 cursor-pointer"
                                    size={42}
                                    src={account?.avatarUrl}
                                    icon={<UserOutlined />}
                                />
                            </Space>
                        </Space>
                    </Popover>
                </Col>
            </Row>
        </Header>
    );
};
export default HeaderComponent;
