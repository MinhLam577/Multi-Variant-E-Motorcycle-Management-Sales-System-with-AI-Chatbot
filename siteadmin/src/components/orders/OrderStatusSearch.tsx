import { Button } from "antd";
import React, { useState } from "react";
import { EnumOrderStatuses, EnumOrderStatusesValue } from "../../constants";
import { ButtonProps } from "antd/lib";
interface IOrderStatusSearchProps {
    order_store: any;
}
const OrderStatusSearch: React.FC<IOrderStatusSearchProps> = ({
    order_store,
}) => {
    const button_extra_style: Partial<ButtonProps> = {
        color: "default",
        variant: "solid",
    };
    const [button_focus, set_button_focus] = useState(false);
    const [status_selected, set_status_selected] = useState(
        EnumOrderStatusesValue.All
    );
    const order_status_selectData = Object.keys(EnumOrderStatuses).map(
        (key) => ({
            key: key,
            value: EnumOrderStatusesValue[
                key as keyof typeof EnumOrderStatusesValue
            ],
        })
    );
    return (
        <div className="flex flex-wrap justify-start items-center gap-y-4 mt-2">
            {order_status_selectData?.map((status) => {
                const isSelected = status_selected === status.value;
                return (
                    <Button
                        key={status.value}
                        onClick={() => {
                            set_button_focus(!button_focus);
                            set_status_selected(status.value);
                            order_store?.setGlobalFilters({
                                order_status: status.value,
                            });
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
