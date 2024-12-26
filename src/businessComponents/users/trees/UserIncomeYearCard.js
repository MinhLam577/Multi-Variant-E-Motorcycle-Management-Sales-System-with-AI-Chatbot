import PropTypes from 'prop-types';
import { formatVNDMoney } from '../../../utils';
import { useQuery } from '@apollo/client';
import { GET_USER_YEAR_INCOMES } from '../../../graphql/users';
import { Spin } from 'antd';
import 'dayjs/locale/vi';

const UserIncomeYearCard = ({ userCode }) => {

  const {data: income, loading, error} = useQuery(GET_USER_YEAR_INCOMES, {
    variables: {
      userCode, 
    }
  });

  if (error) {
    return <div>Không thể lấy thu nhập của user</div>
  }


  return <Spin spinning={loading}>
    <div className='mt-4 flex justify-between mx-[-24px] bg-[#fffbb3] py-2'>
      <div className='font-semibold pl-4 '>Thu nhập theo năm</div>
    </div>

    {
      income?.admin_userAnnuallyIncomes.map(inc => {

        return <>
          <div>
            <div className='mt-4 italic font-bold flex justify-between'>
              <span>Năm:</span>
              <span className='text-[#EC2029] font-bold'>{inc?.year}</span>
            </div>
            <div className='mt-4 italic flex justify-between'>
              <span>1. Thưởng tăng trưởng cá nhân</span>
              <span className='text-[#EC2029]'>{formatVNDMoney(inc?.personalGrowthBonus ?? 0)} đ</span>
            </div>
            <div className='mt-2 italic flex justify-between'>
              <span>2. Thưởng tăng trưởng hệ thống</span>
              <span className='text-[#EC2029]'>{formatVNDMoney(inc?.systemGrowthBonus ?? 0)} đ</span>
            </div>
            <div className='mt-2 italic flex justify-between'>
              <span>3. Hoa hồng cổ đông</span>
              <span className='text-[#EC2029]'>{formatVNDMoney(inc?.shareHolderCommission ?? 0)} đ</span>
            </div>
          </div>
        </>
      })
    }
  </Spin>
}

UserIncomeYearCard.propTypes = {
  userCode: PropTypes.string
};

UserIncomeYearCard.defaultProps = {
};

export default UserIncomeYearCard;