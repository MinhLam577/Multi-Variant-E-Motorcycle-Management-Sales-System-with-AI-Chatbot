import PropTypes from "prop-types";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Loading = ({ inline }) => {
  if (inline) {
    return <Spin indicator={<LoadingOutlined spin />} size="default" />;
  }
  return (
    <div style={{ textAlign: "center", margin: "15px" }}>
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
};

Loading.propTypes = {
  inline: PropTypes.bool,
};

Loading.defaultProps = {
  inline: false,
};

export default Loading;
