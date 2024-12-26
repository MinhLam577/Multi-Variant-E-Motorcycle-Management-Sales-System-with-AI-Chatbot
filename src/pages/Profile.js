import { useContext, useState } from 'react';
import { GlobalContext } from '../contexts/global';
import { Button, Card, Divider, Form, Input, message } from 'antd';
import { CloseOutlined, EditOutlined, SaveOutlined, KeyOutlined } from '@ant-design/icons';
import { ProcessModalName, processWithModals } from '../containers/processWithModals';
import ChangePasswordModal from '../containers/ChangePasswordModal';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '../graphql/users';
import UploadAvatarGetUrlWithImgCrop, { UploadAvatarGetUrlWithImgCropRemoteMode } from '../containers/UploadAvatarGetUrlWithImgCrop';

// eslint-disable-next-line
const clearProperties = ({ obj, ignoreProperties }) => {
  if (typeof obj === 'object' && Array.isArray(ignoreProperties)) {
    Object.keys(obj).forEach((key) => {
      if (ignoreProperties.includes(key)) {
        obj[key] = undefined;
      }
      else if (typeof obj[key] === 'object') {
        clearProperties({ obj: obj[key], ignoreProperties });
      }
    })
  }
};

const Profile = () => {
  const [form] = Form.useForm();
  const { user, globalDispatch } = useContext(GlobalContext);
  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  const switchMode = (enableEditing, values) => {
    if (!enableEditing) {
      form.setFieldsValue(values || user);
    }
    setIsEditing(enableEditing);
  };

  const handleUpdateUserProfile = (values) => {
    const dto = {
      ...values,
      email: undefined
    };

    updateUserProfile({
      variables: {
        updateUserProfileInput: {
          ...dto
        }
      },
      onCompleted: (res) => {
        if (res?.updateUserProfile?.status) {
          let data = {
            ...user,
            ...res?.updateUserProfile,
            status: undefined
          };
          localStorage.setItem('user', JSON.stringify(data));
          globalDispatch({
            type: 'update',
            data: data
          });
          switchMode(false, data);
          message.success('Thay đổi thông tin người dùng thành công!');
        }
      },
    })
  };

  return (
    <>
      <Card title='Thông tin cơ bản'
        extra={isEditing ?
          <>
            <Button title='Hủy' onClick={() => processWithModals(ProcessModalName.ConfirmCancelEditing)(() => switchMode(false))}><CloseOutlined /></Button>
            <Divider type='vertical' />
            <Button title='Lưu' onClick={() => form.submit()}><SaveOutlined /></Button>
          </>
          :
          <>
            <Button title='Chỉnh sửa' onClick={() => switchMode(true)}><EditOutlined /></Button>
          </>
        }
        actions={[
          <Button key={1} title='Thay đổi mật khẩu' onClick={() => setOpenChangePasswordModal(true)}><KeyOutlined />&nbsp;Thay đổi mật khẩu</Button>
        ]}
      >
        <Form
          form={form}
          layout='vertical'
          disabled={!isEditing}
          initialValues={user}
          onFinish={(values) => processWithModals(ProcessModalName.ConfirmSaveEditing)(() => handleUpdateUserProfile(values))}
        >
          <Form.Item
            name='avatar'
            label='Hình đại diện'
            tooltip={`Hình đại diện`}
          >
            <UploadAvatarGetUrlWithImgCrop remoteMode={UploadAvatarGetUrlWithImgCropRemoteMode.Private} />
          </Form.Item>
          <Form.Item
            name={'fullname'}
            label={'Họ và tên'}
          >
            <Input placeholder="Nhập Họ và tên" />
          </Form.Item>
          <Form.Item
            name={'email'}
            label={'Email'}
          >
            <Input disabled placeholder="Nhập Email" />
          </Form.Item>
        </Form>
      </Card>
      <ChangePasswordModal open={openChangePasswordModal} cancelCallback={() => setOpenChangePasswordModal(false)} />
    </>
  );
}

export default Profile;
