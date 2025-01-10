import PropTypes from 'prop-types';

import { PhoneOutlined, UserOutlined } from "@ant-design/icons";

const UserBasicInfo = ({ userInfo }) => {
  return <div className='mt-2'>
    <div className='font-semibold mb-2 bg-[#c9efff] mx-[-24px] pl-4 py-2'>Thông tin cơ bản</div>
    <div className='my-1'>
      <UserOutlined className='mr-2 mt-2' />
      {userInfo?.fullname}
    </div>
    <div className='my-1 flex'>
      <PhoneOutlined className='mr-2' />
      {userInfo?.phone}
    </div>
  </div>
}

UserBasicInfo.propTypes = {
  userInfo: PropTypes.object
};

UserBasicInfo.defaultProps = {
};

export default UserBasicInfo;