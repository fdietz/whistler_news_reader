import React, { PropTypes } from "react";

const Badge = ({count}) => (
  <div className="badge">{count > 99 ? "99+" : count}</div>
);

Badge.propTypes = {
  count: PropTypes.number
};

export default Badge;
