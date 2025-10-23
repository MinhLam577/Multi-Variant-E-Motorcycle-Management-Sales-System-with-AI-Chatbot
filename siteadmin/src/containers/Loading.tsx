import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = ({ inline = false }: { inline?: boolean }) => {
    if (inline) {
        return <Spin indicator={<LoadingOutlined spin />} size="default" />;
    }
    return (
        <div style={{ textAlign: "center", margin: "15px" }}>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
    );
};

export default Loading;
