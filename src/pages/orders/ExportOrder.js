import { useLazyQuery } from "@apollo/client";
import { Button, DatePicker, Modal } from "antd";
import { useState } from "react";
import { EXPORT_ORDER } from "../../graphql/orders";
import { EnumOrderStatuses } from "../../constants";
import moment from "moment";


const ExportOrder = ({ globalFilters }) => {
  const { RangePicker } = DatePicker;

  const [isOpenExport, setIsOpenExport] = useState(false);
  const [date, setDate] = useState();

  const [exportExcel] = useLazyQuery(EXPORT_ORDER, {
    fetchPolicy: 'no-cache',
    onCompleted: async res => {
      if (res?.exportOrdersV2) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        window.open(res?.exportOrdersV2.fileResultUrl, '_blank')
        setIsOpenExport(false)
        setDate(undefined)
      }
    },
  });


  const onChange = (date) => {
    setDate(date);
  };

  const handleExport = () => {
    exportExcel({
      variables: {
        orderStatuses: globalFilters.status ? globalFilters.status : Object.keys(EnumOrderStatuses),
        fromDate: date ? moment(date[0].toDate()).hours(0).minutes(0).seconds(1).toDate() : undefined,
        toDate: date ? moment(date[1].toDate()).hours(23).minutes(59).seconds(59).toDate() : undefined
      }
    });
  }

  return <div className="mb-4">
    <div className="w-full flex justify-end">
      <Button
        onClick={() => {
          setIsOpenExport(true)
        }}
        type='primary'
      >
        Export
      </Button>
    </div>

    <Modal
      title='Xuất đơn hàng bằng excel'
      open={isOpenExport}
      onOk={handleExport}
      onCancel={() => {
        setIsOpenExport(false)
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
};

ExportOrder.propTypes = {
  globalFilters: Object
};

export default ExportOrder;