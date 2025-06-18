import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { EnumOrderStatuses } from "../../constants";
import { OrderStatus } from "src/stores/order.store";
import { ButtonProps } from "antd/lib";
import { toJS } from "mobx";
interface IOrderStatusSearchProps {
    order_status: OrderStatus[];
    order_store: any;
}
const OrderStatusSearch: React.FC<IOrderStatusSearchProps> = ({
    order_status,
    order_store,
}) => {
    const button_extra_style: Partial<ButtonProps> = {
        color: "default",
        variant: "solid",
    };
    const [button_focus, set_button_focus] = useState(false);
    const [status_selected, set_status_selected] = useState("All");
    return (
        <div className="flex flex-wrap justify-between items-center gap-y-4 mt-2">
            {order_status?.map((status) => {
                const isSelected = status_selected === status.key;
                return (
                    <Button
                        key={status.key}
                        onClick={() => {
                            set_button_focus(!button_focus);
                            set_status_selected(status.key);
                            order_store?.setOrderStatusSelected(status.key);
                        }}
                        {...(isSelected ? button_extra_style : {})}
                        size="middle"
                    >
                        <span className="text-sm font-semibold">
                            #
                            {EnumOrderStatuses[status.key]
                                ?.toLowerCase()
                                ?.split(" ")
                                ?.map(
                                    (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                )
                                ?.join(" ")}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
};

export default OrderStatusSearch;
