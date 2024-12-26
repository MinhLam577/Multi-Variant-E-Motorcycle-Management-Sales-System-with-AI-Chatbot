import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/global";
import VouchersTable from "../../businessComponents/vouchers/VouchersTable";

export default function Vouchers() {
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);

  const handleAddVouchers = () => {
    navigate("/vouchers/add", { replace: true });
  };

  const handleEditVouchers = (voucherData) => {
    globalDispatch({
      type: "breadcrum",
      data: voucherData.discountName,
    });
    navigate(`/vouchers/${voucherData.discountId}/edit`, {
      replace: true,
    });
  };

  const handleViewVouchers = (voucherData) => {
    globalDispatch({
      type: "breadcrum",
      data: voucherData.discountName,
    });
    navigate(`/vouchers/${voucherData.discountId}`, { replace: true });
  };

  return (
    <>
      <div className="w-full flex justify-between">
        <Space className="my-4 flex flex-row justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddVouchers}
          >
            Tạo mới
          </Button>
        </Space>
      </div>
      <VouchersTable
        handleEditVouchers={handleEditVouchers}
        handleViewVouchers={handleViewVouchers}
      />
    </>
  );
}
