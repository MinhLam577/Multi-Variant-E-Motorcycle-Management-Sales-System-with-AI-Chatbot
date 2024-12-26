import { useEffect, useState } from 'react';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Modal, Spin, Upload, message } from 'antd';
import { useMutation } from '@apollo/client';
import { CREATE_RESOURCE, CREATE_RESOURCE_PUBLIC } from '../graphql/resources';
import { ResourceCategory } from '../constants';
import { sleepFuntions } from '../utils';
import PropTypes from 'prop-types';

export const UploadSinglePictureGetUrlRemoteMode = {
  Private: 'private',
  Public: 'public',
}

const UploadSinglePictureGetUrl = ({ onChange, value, disabled, remoteMode = UploadSinglePictureGetUrlRemoteMode.Private, maxCount, fileList, setFileList }) => {
  const [createResource] = useMutation(CREATE_RESOURCE);
  const [createResourcePublic] = useMutation(CREATE_RESOURCE_PUBLIC);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [uploading, setUploading] = useState(false);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async () => {
    if (Array.isArray(fileList) && fileList?.length > 0) {
      setPreviewOpen(true);
    }
  };


  const handleRemove = (item) => {
    setFileList(fileList.filter(i => i.url != item.url));
  }

  const uploadAvatarUrl = async ({ file }) => {
    setUploading(true);
    let createResourceDt;
    if (remoteMode === UploadSinglePictureGetUrlRemoteMode.Private) {
      createResourceDt = await createResource({
        variables: {
          file: file,
          category: ResourceCategory.avatar
        }
      });
 
    }
    else {
      createResourceDt = await createResourcePublic({
        variables: {
          file: file
        }
      });
    }
    await sleepFuntions(2000);
    setUploading(false);
    setFileList([{
      uid: createResourceDt?.data?.createResource?.url,
      name: createResourceDt?.data?.createResource?.fileName,
      status: 'done',
      url: createResourceDt?.data?.createResource?.url,
    }]);

    if (createResourceDt?.data?.createResource?.url) {
      typeof onChange === 'function' && onChange(createResourceDt?.data?.createResource?.url);
    }
    else {
      typeof onChange === 'function' && onChange(null);
    }
  };

  const handleBeforeUpload = async (file, FileList) => {
    const isImage = file.type.indexOf('image/') === 0;
    setUploading(true);
    if(maxCount > 1) {
      const createResourceDtArray = await Promise.all(FileList?.map(async (file) => {
        const createResourceDt = await createResource({
          variables: {
            file,
            category: ResourceCategory.avatar
          }
        });
        return createResourceDt;
      }));
      const mergedArray = createResourceDtArray
        .map(i => ({   uid: i?.data?.createResource?.url,
          name: i?.data?.createResource?.fileName,
          status: 'done',
          url: i?.data?.createResource?.url, }))
        .concat(fileList)
      await sleepFuntions(2000);
      setUploading(false);
      setFileList(mergedArray)     
    }
    if (!isImage) {
      message.error('Tệp tải lên không phải file ảnh!');
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Dung lượng ảnh không được lớn hơn 5MB!');
    }
    return isImage && isLt5M;
  };
  useEffect(() => {
    if (value) {
      if(typeof(value) != 'string') {
        setFileList(value?.map(i=>({
          uid: i,
          name: i,
          status: 'done',
          url: i,
        })));
      } else{
        setFileList([{
          uid: value,
          name: value,
          status: 'done',
          url: value,
        }]);
      }

    }
  }, [value, setFileList]);

  const uploadButton = (
    <Spin spinning={uploading}>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </Spin>
  );
  return (
    <div className='flex justify-center'>
      <Upload
        customRequest={maxCount>1 ? undefined : uploadAvatarUrl}
        listType="picture-card"
        fileList={Array.isArray(fileList) && fileList.length > 0 ? fileList : []}
        onPreview={handlePreview}
        onRemove={handleRemove}
        beforeUpload={handleBeforeUpload}
        maxCount={maxCount}
        disabled={disabled}
        className={maxCount > 1 ? "": "upload-new"}
        multiple={maxCount>1}
      >
        {fileList?.length >= maxCount ? null : uploadButton}
      </Upload>
      <Modal
        className="custom-antd-modal-preview-image"
        open={previewOpen}
        closeIcon={<CloseOutlined className="text-red-700 hover:!text-red-400" />}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={Array.isArray(fileList) && fileList?.length > 0 ? fileList[0]?.url : ''}
        />
      </Modal>
    </div>
  );
};

UploadSinglePictureGetUrl.propTypes ={
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  remoteMode: PropTypes.string,
  value: PropTypes.any,
  maxCount: PropTypes.number,
  fileList: PropTypes.array,
  setFileList: PropTypes.func
}
export default UploadSinglePictureGetUrl;