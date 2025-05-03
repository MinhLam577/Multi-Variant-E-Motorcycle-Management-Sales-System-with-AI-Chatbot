import { Tabs } from "antd";
import React from "react";
import type { TabsProps } from "antd";
import "./CustomizeTab.css";
interface ICustomizeTabProps {
    items: TabsProps["items"];
}

const CustomizeTab: React.FC<ICustomizeTabProps> = ({ items }) => {
    return <Tabs defaultActiveKey="1" items={items} />;
};

export default CustomizeTab;
