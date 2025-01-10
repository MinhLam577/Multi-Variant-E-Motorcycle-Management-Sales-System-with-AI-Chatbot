import { Card } from "antd";
import PropTypes from 'prop-types';

import UserBasicInfo from "./UserBasicInfo";
import UserBankInfo from "./UserBankInfo";
import UserIncomeCard from "./UserIncomeCard";
import UserRevenueCard from "../detail/revenue/UserRevenueCard";

const UserDetailInTree = ({ userInfo, loading }) => {

  return <div>
    <Card
      type='inner'
      headStyle={{ background: 'red' }}
      title={<p className='text-[15px] text-center text-white'>
        Thông tin đại lý
      </p>}
      loading={loading}
    >
      <UserBasicInfo userInfo={userInfo}/>
      <UserBankInfo userInfo={userInfo}/>
      <UserIncomeCard userCode={userInfo?.userCode}/>
      <UserRevenueCard userCode={userInfo?.userCode} />
    </Card></div>
}

UserDetailInTree.propTypes = {
  userInfo: PropTypes.object,
  loading: PropTypes.bool
};

UserDetailInTree.defaultProps = {
};

export default UserDetailInTree;