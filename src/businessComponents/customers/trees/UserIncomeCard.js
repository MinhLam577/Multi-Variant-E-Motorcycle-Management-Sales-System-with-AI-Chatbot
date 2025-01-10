import PropTypes from 'prop-types';
import { formatVNDMoney } from '../../../utils';
import dayjs from 'dayjs';
import { useMutation, useQuery } from '@apollo/client';
import { APPROVE_BUILDING_BRAND_RECOGNITION_BONUS, GET_USER_MONTHLY_INCOME } from '../../../graphql/users';
import { Button, DatePicker, Spin, message } from 'antd';
import { useState } from 'react';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';
import UserIncomeYearCard from './UserIncomeYearCard';

const UserIncomeCard = ({ userCode }) => {
  const [date, setDate] = useState(dayjs(new Date()));

  const {data: income, loading, error, refetch} = useQuery(GET_USER_MONTHLY_INCOME, {
    variables: {
      userCode, 
      month: dayjs(date).month() + 1,
      year: dayjs(date).year(),
    }
  });

  const [approveBuildingBrandRecognitionBonus] = useMutation(APPROVE_BUILDING_BRAND_RECOGNITION_BONUS, {
    onCompleted: () => {      
      message.success('Duyệt thưởng thành công!');
    },
  });

  const handleApprove = () => {
    approveBuildingBrandRecognitionBonus({ 
      variables: { 
        month: dayjs(date).month() + 1,
        year: dayjs(date).year(),
        userCodes: [userCode]
      }});
  }

  const onChange = (date) => {
    console.log('date ', date)
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
  if (error) {
    return <div>Không thể lấy thu nhập của user</div>
  }


  const sum = income && income?.admin_userMonthlyIncome ? Object.values(income?.admin_userMonthlyIncome).reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0) : 0;
  return <Spin spinning={loading}>
    <div className='mt-4 flex justify-between mx-[-24px] bg-[#fffbb3] py-2'>
      <div className='font-semibold pl-4 '>Thu nhập tháng {dayjs(date).month() + 1}</div>
      <span className='text-[#EC2029] font-bold mr-6'>{formatVNDMoney(sum - income?.admin_userMonthlyIncome?.retailProfit)} đ</span>
    </div>
    <div className='ml-0 flex mt-4'>
      <div className='px-0'>
        <DatePicker locale={locale} onChange={onChange} defaultValue={dayjs(new Date())} picker="month" />
      </div>
    </div>
    <div>
      <div className='mt-4 italic flex justify-between'>
        <span>1. Lợi nhuận bán lẻ (Không tính vào thu nhập)</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.retailProfit ?? 0)} đ</span>
      </div>
      <div className='mt-2 italic flex justify-between'>
        <span>2. Lương</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.salary ?? 0)} đ</span>
      </div>
      <div className='mt-2 italic flex justify-between'>
        <span>3. Lương cộng tác viên</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.collaboratorSalary ?? 0)} đ</span>
      </div>
      <div className='mt-2 italic flex justify-between'>
        <span>4. Thưởng thành lập hệ thống</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.systemEstablishmentBonus ?? 0)} đ</span>
      </div>
      <div className='mt-2 italic flex justify-between'>
        <span>5. Thưởng xây dựng hệ thống</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.systemBuildingBonus ?? 0)} đ</span>
      </div>
      <div className='mt-2 italic flex justify-between'>
        <span>6. Hoa hồng lãnh đạo</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.leadershipBonus ?? 0)} đ</span>
      </div>
      <div className='mt-2 italic flex justify-between'>
        <div>
          <span>7. Thưởng xây dựng nhận diện thương hiệu</span>
          {
            income?.admin_userMonthlyIncome?.needToApproveBuildingBrandRecognitionBonus
            &&
            <Button className='ml-2' onClick={handleApprove}>Duyệt</Button>
          }
        </div>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.buildingBrandRecognitionBonus ?? 0)} đ</span>
      </div>
      <div className='mt-2 mb-4 italic flex justify-between'>
        <span>8. Thưởng phát triển hệ thống</span>
        <span className='text-[#EC2029]'>{formatVNDMoney(income?.admin_userMonthlyIncome?.systemDevelopmentBonus ?? 0)} đ</span>
      </div>
    </div>

    <div>
      <UserIncomeYearCard 
        userCode={userCode}
      />
    </div>
  </Spin>
}

UserIncomeCard.propTypes = {
  userCode: PropTypes.string
};

UserIncomeCard.defaultProps = {
};

export default UserIncomeCard;