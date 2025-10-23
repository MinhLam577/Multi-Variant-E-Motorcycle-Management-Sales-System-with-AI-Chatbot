import ModalCreateProduct from "../ModalCreateProduct/ModalCreateProduct";
import React from "react";
import { observer } from "mobx-react-lite";
import { IModalCreateProductProps } from "../ModalCreateProduct/ModalCreateProduct.type";

interface IModalUpdateProductProps extends IModalCreateProductProps {
    productId: string;
    initialData: Record<string, any>;
}

const ModalUpdateProduct: React.FC<IModalUpdateProductProps> = observer(
    ({ productId, initialData, ...props }: IModalUpdateProductProps) => {
        return (
            <ModalCreateProduct
                title="Cật nhật sản phẩm"
                formInitialValues={initialData ? initialData : {}}
                productId={productId}
                {...props}
            />
        );
    }
);

export default ModalUpdateProduct;
