import ModalCreateProduct, {
    IModalCreateProductProps,
} from "../ModalCreateProduct/ModalCreateProduct";
import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "antd";

interface IModalUpdateProductProps extends IModalCreateProductProps {
    productId: string;
    initialData: Record<string, any>;
}

const ModalUpdateProduct: React.FC<IModalUpdateProductProps> = observer(
    ({ productId, initialData, ...props }: IModalUpdateProductProps) => {
        return (
            <ModalCreateProduct
                {...props}
                formInitialValues={initialData ? initialData : {}}
                productId={productId}
            />
        );
    }
);

export default ModalUpdateProduct;
