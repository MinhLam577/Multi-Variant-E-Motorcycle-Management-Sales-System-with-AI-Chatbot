import { Avatar } from 'antd';
import PropTypes from 'prop-types';
import { ColorList } from '../../../constants';

const UserTreeNode = ({ user, handleSelect }) => {
  return <div className='flex justify-center items-center' onClick={() => handleSelect({key: user?.userId})}>
    <div className='p-1'>
      {
        user?.avatar === '' ?
          <Avatar style={{ backgroundColor: ColorList.sort(() => Math.random() - 0.5)?.[0] }}>{user?.fullname.charAt(0).toUpperCase()}</Avatar> 
          :
          <Avatar src={user?.avatar}/>
      }
      <span className='font-bold ml-2'>{user?.fullname}</span> - <span className='font-bold text-blue-500'>{user?.userCode}</span>
    </div>
  </div>
};

UserTreeNode.propTypes = {
  user: PropTypes.object,
  handleSelect: PropTypes.func.isRequired
};

export default UserTreeNode;