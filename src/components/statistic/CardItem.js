import { Card, Col, Statistic } from "antd";
import PropTypes from "prop-types";

function CardItem({ title, color, value, prefix }) {
  return (
    <Col xs={24} lg={6}>
      <Card style={{borderBottomColor: color, borderBottomWidth: 1.5, fontWeight: 700}}>
        <Statistic
          title={title}
          value={value}
          prefix={prefix}
        />
      </Card>
    </Col>
  );
}

CardItem.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.number,
  prefix: PropTypes.node
};

export default CardItem;
