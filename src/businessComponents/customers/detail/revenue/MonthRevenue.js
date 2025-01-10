import PropTypes from 'prop-types';
import { formatVNDMoney } from '../../../../utils';
import dayjs from 'dayjs';
import {  DatePicker, Divider, Spin } from 'antd';
import { useQuery } from '@apollo/client';
import { MONTHLY_REVENUE } from '../../../../graphql/revenue';
import { useState } from 'react';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';


const MonthlyRevenue = ({ userCode }) => {
  const [date, setDate] = useState(dayjs(new Date()));
  // Lay doanh thu theo ngay
  const { data: revenueUser, error, loading, refetch } = useQuery(MONTHLY_REVENUE, {
    variables: {
      filter: {
        userCode,
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
    console.log(date, dateString);
    setDate(date);
    refetch({
      variables: {
        filter: {
          userCode,
          month: dayjs(date).month() + 1,
          year: dayjs(date).year()
        }
      }
    });
  };

  return <Spin tip="Loading..." spinning={loading}>
    <div className='mt-4 flex justify-between mx-[-24px] bg-green-200 py-2'>
      <div className='font-semibold pl-4 '>Doanh thu tháng {dayjs(date).month() + 1}</div>
      <span className='text-[#EC2029] font-bold mr-6'>
        {
          formatVNDMoney(revenueUser?.monthlyRevenue?.personalRevenue + revenueUser?.monthlyRevenue?.agencyRevenueFromReferences 
          + revenueUser?.monthlyRevenue?.childrenRevenue)
        } đ</span>
    </div>
    <div className='mt-4'>
      <div className='px-0'>
        <DatePicker locale={locale} onChange={onChange} defaultValue={dayjs(new Date())} picker="month" />
      </div>
      <div className='mt-4 italic flex justify-between'>
        <span className='pr-8'>1. Doanh thu cá nhân:</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(revenueUser?.monthlyRevenue?.personalRevenue)}đ</span>
      </div>
      <div className='mt-4 italic flex justify-between'>
        <span className='pr-8'>2. Doanh thu khách hàng tiêu dùng:</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(revenueUser?.monthlyRevenue?.retailRevenueFromReferences)}đ</span>
      </div>
      <div className='mt-4 italic flex justify-between'>
        <span className='pr-8'>3. Quy đổi doanh thu khách hàng tiêu dùng:</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(revenueUser?.monthlyRevenue?.agencyRevenueFromReferences)}đ</span>
      </div>
      <div className='mt-4 italic flex justify-between'>
        <span className='pr-8'>4. Tổng doanh thu cấp dưới:</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(revenueUser?.monthlyRevenue?.childrenRevenue)}đ</span>
      </div>
      <div className='ml-0 italic mt-4'>
        <span className='pr-8'>5. Doanh thu cấp dưới trực tiếp:</span>
        <div className='mt-4 px-4'>
          {
            revenueUser?.monthlyRevenue?.children.map(child => {
              return (
                <>
                  <div className='w-[400px]'>
                    <div className='ml-0 flex italic justify-between mt-4'>
                      <span className='font-bold'> Tên đại lý:</span>
                      <span className='font-bold'>{child?.user?.fullname} ({child?.user?.userCode})</span>
                    </div>
                    <div className='ml-0 flex italic justify-between mt-4'>
                      <span className='pr-8'> Doanh thu cá nhân:</span>
                      <span className='text-[#EC2029]'>{formatVNDMoney(child?.personalRevenue)}đ</span>
                    </div>
                    <div className='ml-0 flex italic justify-between mt-4'>
                      <span className='pr-8'>Tổng doanh thu cấp dưới:</span>
                      <span className='text-[#EC2029]'>{formatVNDMoney(child?.childrenRevenue)}đ</span>
                    </div>
                    <div className='ml-0 flex italic justify-between mt-4'>
                      <span className='pr-8'> Doanh thu khách hàng tiêu dùng:</span>
                      <span className='text-[#EC2029]'>{formatVNDMoney(child?.retailRevenueFromReferences)}đ</span>
                    </div>
                    <div className='ml-0 flex italic justify-between mt-4'>
                      <span className='pr-8'> Quy đổi doanh thu khách hàng tiêu dùng:</span>
                      <span className='text-[#EC2029]'>{formatVNDMoney(child?.agencyRevenueFromReferences)}đ</span>
                    </div>
                    <Divider />
                  </div>
                </>
              )
            })
          }
        </div>
      </div>
    </div>
  </Spin>
}

MonthlyRevenue.propTypes = {
  userCode: PropTypes.object
};

MonthlyRevenue.defaultProps = {
};

export default MonthlyRevenue;