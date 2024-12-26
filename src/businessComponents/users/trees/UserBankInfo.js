import PropTypes from 'prop-types';

import { BankOutlined, DollarCircleOutlined, UserOutlined } from "@ant-design/icons";

const UserBankInfo = ({ userInfo }) => {
  return <div className='mt-3'>
    <div className='font-semibold mb-2 bg-[#c9eff1] mx-[-24px] pl-4 py-2'>Thông tin ngân hàng</div>
    <div className='my-1'>
      <UserOutlined title='Tên tài khoản' className='mr-2 mt-2' />
      {userInfo?.bankAccountName}
    </div>
    <div className='my-1 flex'>
      <BankOutlined title='Tên ngân hàng' className='mr-2' />
      {userInfo?.bankName}
    </div>
    <div className='my-1 flex'>
      <DollarCircleOutlined title='Số tài khoản' className='mr-2 mt-1' />
      {userInfo?.bankAccountNumber}
    </div>
  </div>
}

UserBankInfo.propTypes = {
  userInfo: PropTypes.object
};

UserBankInfo.defaultProps = {
};

export default UserBankInfo;