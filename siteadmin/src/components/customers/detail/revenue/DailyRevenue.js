import { DatePicker, Spin } from "antd";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { useState } from "react";
import { formatVNDMoney } from "../../../../utils";

const DailyRevenue = ({ userCode }) => {
    const [date, setDate] = useState(dayjs(new Date()));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    if (error) {
        return <div>Không thể lấy được doanh thu theo ngày!</div>;
    }

    const onChange = (date, dateString) => {
        setDate(date);
    };

    return (
        <Spin tip="Loading..." spinning={loading}>
            <div className="">
                <div className="font-bold">Doanh thu theo ngày: </div>
                <div className="ml-10 flex mt-4">
                    <span className="font-bold">Chọn ngày: </span>
                    <div className="px-4">
                        <DatePicker
                            onChange={onChange}
                            defaultValue={dayjs(new Date())}
                        />
                    </div>
                </div>
                <div className="ml-10 flex mt-4">
                    <span className="font-bold pr-8"> Doanh thu cá nhân:</span>
                    <span className="font-bold">
                        {formatVNDMoney(1000000)}đ
                    </span>
                </div>
                <div className="ml-10 flex mt-4">
                    <span className="font-bold pr-8"> Doanh thu cấp dưới:</span>
                    <span className="font-bold">
                        {formatVNDMoney(1000000)}đ
                    </span>
                </div>
                <div className="ml-10 flex mt-4">
                    <span className="font-bold pr-8"> Doanh thu bán lẻ:</span>
                    <span className="font-bold">
                        {formatVNDMoney(1000000)}đ
                    </span>
                </div>
            </div>
        </Spin>
    );
};

DailyRevenue.propTypes = {
    userCode: PropTypes.object,
};

DailyRevenue.defaultProps = {};

export default DailyRevenue;
