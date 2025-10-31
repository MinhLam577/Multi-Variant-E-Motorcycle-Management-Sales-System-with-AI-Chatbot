import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { SpinProps } from "antd/lib/spin";
interface LoadingProps extends SpinProps {
    inline?: boolean;
}
const Loading = ({ inline = false, ...props }: LoadingProps) => {
    if (inline) {
        return (
            <Spin
                indicator={<LoadingOutlined spin />}
                size="default"
                {...props}
            />
        );
    }
    return (
        <div style={{ textAlign: "center", margin: "15px" }}>
            <Spin
                indicator={<LoadingOutlined spin />}
                size="large"
                {...props}
            />
        </div>
    );
};

export default Loading;
