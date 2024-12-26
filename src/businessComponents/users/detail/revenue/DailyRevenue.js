import PropTypes from 'prop-types';
import { formatVNDMoney } from '../../../../utils';
import dayjs from 'dayjs';
import { Button, DatePicker, Spin } from 'antd';
import { useQuery } from '@apollo/client';
import { DAILY_REVENUE } from '../../../../graphql/revenue';
import { useState } from 'react';

const DailyRevenue = ({ userCode }) => {
  const [date, setDate] = useState(dayjs(new Date()));
  // Lay doanh thu theo ngay
  const { data: revenueUser, error, loading, refetch } = useQuery(DAILY_REVENUE, {
    variables: {
      filter: {
        userCode,
        day: dayjs(date).day(),
        month: dayjs(date).month() + 1,
        year: dayjs(date).year()
      }
    }
  });

  if (error) {
    return <div>
      Không thể lấy được doanh thu theo ngày!
    </div>
  }

  const onChange = (date, dateString) => {
    console.log(dayjs(date).day());
    setDate(date);
    refetch({
      variables: {
        filter: {
          userCode,
          day: dayjs(date).day(),
          month: dayjs(date).month() + 1,
          year: dayjs(date).year()
        }
      }
    });
  };

  return <Spin tip="Loading..." spinning={loading}>
    <div className=''>
      <div className='font-bold'>Doanh thu theo ngày: </div>
      <div className='ml-10 flex mt-4'>
        <span className='font-bold'>Chọn ngày: </span>
        <div className='px-4'>
          <DatePicker onChange={onChange} defaultValue={dayjs(new Date())} />
        </div>
      </div>
      <div className='ml-10 flex mt-4'>
        <span className='font-bold pr-8'> Doanh thu cá nhân:</span>
        <span className='font-bold'>{formatVNDMoney(revenueUser?.dailyRevenue?.personalRevenue)}đ</span>
      </div>
      <div className='ml-10 flex mt-4'>
        <span className='font-bold pr-8'> Doanh thu cấp dưới:</span>
        <span className='font-bold'>{formatVNDMoney(revenueUser?.dailyRevenue?.childrenRevenue)}đ</span>
      </div>
      <div className='ml-10 flex mt-4'>
        <span className='font-bold pr-8'> Doanh thu bán lẻ:</span>
        <span className='font-bold'>{formatVNDMoney(revenueUser?.dailyRevenue?.retailRevenue)}đ</span>
      </div>
    </div>
  </Spin>
}

DailyRevenue.propTypes = {
  userCode: PropTypes.object
};

DailyRevenue.defaultProps = {
};

export default DailyRevenue;