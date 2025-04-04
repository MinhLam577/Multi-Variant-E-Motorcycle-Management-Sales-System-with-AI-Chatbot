import { PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Button } from "antd";
import { MouseEventHandler } from "react";
import { getBreadcrumbItems } from "src/containers/layout";

interface ProductHeaderProps {
    onCreateNew: (event: React.MouseEvent<HTMLElement>) => void;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onCreateNew }) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <Breadcrumb
                style={{
                    margin: "1rem 0",
                    fontSize: "1.5rem",
                }}
                items={[...getBreadcrumbItems(location.pathname)]}
            />
            <div className="flex gap-2">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onCreateNew}
                    size="large"
                >
                    Tạo mới
                </Button>
            </div>
        </div>
    );
};

export default ProductHeader;
