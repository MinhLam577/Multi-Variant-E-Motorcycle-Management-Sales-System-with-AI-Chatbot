import PropTypes from 'prop-types';
import MonthlyRevenue from './MonthRevenue';

const UserRevenueCard = ({ userCode }) => {
  if (!userCode) {
    return <div></div>
  }
  
  return <>
    {/* <div>
      <DailyRevenue
        userCode={userCode}
      />
    </div> */}
    <div>
      <MonthlyRevenue
        userCode={userCode}
      />
    </div>
  </>
}

UserRevenueCard.propTypes = {
  userCode: PropTypes.string.isRequired
};

UserRevenueCard.defaultProps = {
};

export default UserRevenueCard;