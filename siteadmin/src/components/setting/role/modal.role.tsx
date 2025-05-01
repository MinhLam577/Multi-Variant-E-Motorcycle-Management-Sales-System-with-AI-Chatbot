import {
  FooterToolbar,
  ModalForm,
  ProCard,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from "@ant-design/pro-components";
import { Col, Form, Row, message, notification } from "antd";
import { isMobile } from "react-device-detect";
// import { callCreateRole, callFetchPermission, callUpdateRole } from "@/config/api";
import { IPermission } from "src/types/backend";
import { CheckSquareOutlined } from "@ant-design/icons";
// import ModuleApi from "./module.api";
import { useState, useEffect } from "react";
import _ from "lodash";
import { useStore } from "src/stores";
import RoleApi from "src/api/setting";
import Permissons from "src/api/permission";
import ModuleApi from "./module.api";
import { observer } from "mobx-react-lite";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { resetSingleRole } from "@/redux/slice/roleSlide";

interface IProps {
  openModal: boolean;
  setOpenModal: (v: boolean) => void;
  reloadTable: () => void;
}

const ModalRole = observer((props: IProps) => {
  const { openModal, setOpenModal, reloadTable } = props;
  const Store = useStore();
  const roleStore = Store.settingObservable;
  const singleRole = roleStore.dataRoleDetail;
  //   const singleRole = useAppSelector((state) => state.role.singleRole);
  //   const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [listPermissions, setListPermissions] = useState<
    | {
        module: string;
        permissions: IPermission[];
      }[]
    | null
  >(null);

  const groupByPermission = (data: any) => {
    return _(data)
      .groupBy((x) => x.module)
      .map((value, key) => {
        return { module: key, permissions: value as IPermission[] };
      })
      .value();
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await Permissons.getListPermissions();
        if (res.data) {
          setListPermissions(groupByPermission(res.data));
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách quyền:", error);
        // Bạn có thể thêm thông báo UI ở đây nếu muốn
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (listPermissions?.length && singleRole?.id) {
      form.setFieldsValue({
        name: singleRole.name,
        isActive: singleRole.isActive,
        description: singleRole.description,
      });
      const userPermissions = groupByPermission(singleRole.permissions);
      console.log(userPermissions);
      listPermissions.forEach((x) => {
        let allCheck = true;
        x.permissions?.forEach((y) => {
          const temp = userPermissions.find((z) => z.module === x.module);
          if (temp) {
            const isExist = temp.permissions.find((k) => k.id === y.id);
            if (isExist) {
              form.setFieldValue(["permissions", y.id as string], true);
            } else allCheck = false;
          } else {
            allCheck = false;
          }
        });
        form.setFieldValue(["permissions", x.module], allCheck);
      });
    }
  }, [listPermissions, singleRole]);

  const submitRole = async (valuesForm: any) => {
    const { description, isActive, name, permissions } = valuesForm;
    const checkedPermissions = [];
    console.log(permissions);
    if (permissions) {
      for (const key in permissions) {
        if (
          key.match(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
          ) &&
          permissions[key] === true
        ) {
          checkedPermissions.push(key);
        }
      }
    }

    if (singleRole?.id) {
      //update
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };

      console.log(role);
      const res = await RoleApi.update(singleRole.id, role);
      if (res.data) {
        message.success("Cập nhật role thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    } else {
      //create
      const role = {
        name,
        description,
        isActive,
        permissions: checkedPermissions,
      };
      const res = await RoleApi.create(role);
      if (res.data) {
        message.success("Thêm mới role thành công");
        handleReset();
        reloadTable();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: res.message,
        });
      }
    }
  };

  const handleReset = async () => {
    form.resetFields();
    setOpenModal(false);
    roleStore.resetSingleRole();
  };

  return (
    <>
      <ModalForm
        title={<>{singleRole?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
        open={openModal}
        modalProps={{
          onCancel: () => {
            handleReset();
          },
          afterClose: () => handleReset(),
          destroyOnClose: true,
          width: isMobile ? "100%" : 900,
          keyboard: false,
          maskClosable: false,
        }}
        scrollToFirstError={true}
        preserve={false}
        form={form}
        onFinish={submitRole}
        submitter={{
          render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
          submitButtonProps: {
            icon: <CheckSquareOutlined />,
          },
          searchConfig: {
            resetText: "Hủy",
            submitText: <>{singleRole?.id ? "Cập nhật" : "Tạo mới"}</>,
          },
        }}
      >
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormText
              label="Tên Role"
              name="name"
              rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              placeholder="Nhập name"
            />
          </Col>
          <Col lg={12} md={12} sm={24} xs={24}>
            <ProFormSwitch
              label="Trạng thái"
              name="isActive"
              checkedChildren="ACTIVE"
              unCheckedChildren="INACTIVE"
              initialValue={true}
              fieldProps={{
                defaultChecked: true,
              }}
            />
          </Col>

          <Col span={24}>
            <ProFormTextArea
              label="Miêu tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng không bỏ trống" }]}
              placeholder="Nhập miêu tả role"
              fieldProps={{
                autoSize: { minRows: 2 },
              }}
            />
          </Col>
          <Col span={24}>
            <ProCard
              title="Quyền hạn"
              subTitle="Các quyền hạn được phép cho vai trò này"
              headStyle={{ color: "#d81921" }}
              style={{ marginBottom: 20 }}
              headerBordered
              size="small"
              bordered
            >
              <ModuleApi form={form} listPermissions={listPermissions} />
            </ProCard>
          </Col>
        </Row>
      </ModalForm>
    </>
  );
});

export default ModalRole;
