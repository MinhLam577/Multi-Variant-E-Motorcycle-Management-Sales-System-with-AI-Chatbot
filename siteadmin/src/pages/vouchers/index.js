import { PlusOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GlobalContext } from "../../contexts/global";
import VouchersTable from "../../components/vouchers/VouchersTable";
import { useStore } from "../../stores";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";
const Vouchers = observer(() => {
  const navigate = useNavigate();
  const { globalDispatch } = useContext(GlobalContext);
  const store = useStore();
  const voucherStore = store.voucherObservable;
  const handleAddVouchers = () => {
    navigate("/vouchers/add", { replace: true });
  };
  const [vouchers, setVoucher] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      voucherStore.getListVoucher();
    };
    fetchData();
  }, []);

  const handleEditVouchers = (voucherData) => {
    globalDispatch({
      type: "breadcrum",
      data: voucherData.voucher_name,
    });
    navigate(`/vouchers/${voucherData.id}/edit`, {
      replace: true,
    });
  };

  const handleViewVouchers = (voucherData) => {
    globalDispatch({
      type: "breadcrum",
      data: voucherData.voucher_name,
    });
    navigate(`/vouchers/${voucherData.id}`, { replace: true });
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
        data={voucherStore.data}
        handleEditVouchers={handleEditVouchers}
        handleViewVouchers={handleViewVouchers}
        voucherStore={voucherStore}
      />

      
    </>
  );
});
export default Vouchers;
