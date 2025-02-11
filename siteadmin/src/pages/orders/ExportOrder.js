import { Button, DatePicker, Modal } from "antd";
import { useState } from "react";

const ExportOrder = ({ globalFilters }) => {
  const { RangePicker } = DatePicker;

  const [isOpenExport, setIsOpenExport] = useState(false);
  const [date, setDate] = useState();

  const onChange = (date) => {
    setDate(date);
  };

  const handleExport = () => {};

  return (
    <div className="mb-4">
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            setIsOpenExport(true);
          }}
          type="primary"
        >
          Export
        </Button>
      </div>

      <Modal
        title="Xuất đơn hàng bằng excel"
        open={isOpenExport}
        onOk={handleExport}
        onCancel={() => {
          setIsOpenExport(false);
        }}
      >
        <div className="my-8 flex justify-between w-full items-center">
          <div className="mr-2">Chọn ngày xuất:</div>
          <div>
            <RangePicker value={date} onChange={onChange} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

ExportOrder.propTypes = {
  globalFilters: Object,
};

export default ExportOrder;
