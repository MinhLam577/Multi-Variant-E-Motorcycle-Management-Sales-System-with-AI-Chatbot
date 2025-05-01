"use client";
import React from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import authAPI from "@/src/api/authAPI";
export default function Verify(props) {
  const { id } = props;

  const router = useRouter();

  const onFinish = async (values) => {
    const { id, code } = values;
    const res = await authAPI.checkCode(values);
    console.log(res);
    if (res?.status == 200) {
      message.success("Kích hoạt tài khoản thành công.");
      router.push(`/login`);
    } else {
      notification.error({
        message: "Verify error",
        description: res?.message,
      });
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Kích hoạt tài khoản</legend>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item label="Id" name="id" initialValue={id} hidden>
              <Input disabled />
            </Form.Item>
            <div>
              Mã code đã được gửi tới email đăng ký, vui lòng kiểm tra email.
            </div>
            <Divider />

            <Form.Item
              label="Code"
              name="codeId"
              rules={[
                {
                  required: true,
                  message: "Please input your code!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Link href={"/"}>
            <ArrowLeftOutlined /> Quay lại trang chủ
          </Link>
          <Divider />
          <div style={{ textAlign: "center" }}>
            Đã có tài khoản? <Link href={"/login"}>Đăng nhập</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
}
