import { useMutation } from '@apollo/client';
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CREATE_RESOURCE } from '../graphql/resources';
import { ResourceCategory } from '../constants';
import { message } from 'antd';
import { sleepFuntions } from '../utils';
import PropTypes from 'prop-types';

const RichTextEditor = ({ ...props }) => {
  const [createResource] = useMutation(CREATE_RESOURCE);
  const quillRef = useRef();

  const validateImage = async (file) => {
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
      message.error('Tệp tải lên không phải file ảnh!');
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Dung lượng ảnh không được lớn hơn 5MB!');
    }
    return isImage && isLt5M;
  };

  const uploadFiles = async (file, editor) => {
    let createResourceDt;
    try {
      createResourceDt = await createResource({
        variables: {
          file: file,
          category: ResourceCategory.image
        }
      });
      await sleepFuntions(2000);
      var range = editor.getSelection();

      editor.insertEmbed(range, 'image', createResourceDt?.data?.createResource?.url);
    }
    catch (err) {
      console.log('Upload error: ' + err?.message);
    }
  };

  const isDisableEditing = () => {
    return props?.disabled || props?.readOnly;
  };

  async () => {
    if (!isDisableEditing()) {
      const editor = quillRef.current.getEditor();
      const input = document.createElement('input');

      input.setAttribute('type', 'file');
      input.setAttribute('accept', 'image/*');
      input.click();

      input.onchange = async () => {
        var file = input.files[0];
        if (validateImage(file)) {
          await uploadFiles(file, editor);
        }
        else {
          console.log('Not a image type.');
        }
      };
    }
  };
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean'],
        [{ 'color': [] }],
      ],
    },
  }
  return (
    <ReactQuill
      {...props}
      ref={quillRef}
      theme='snow'
      modules={modules}
    />
  );
};
RichTextEditor.propTypes ={
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool
}
export default RichTextEditor;