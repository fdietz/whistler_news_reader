import React, { PropTypes } from "react";
import classNames from "classnames";

const Button = ({ type, expand, onClick, children }) => {
  const cls = classNames({
    btn: true,
    "btn-expand": expand,
    [`btn-${type}`]: type
  });

  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  expand: PropTypes.boolean,
  onClick: PropTypes.func
};

export default Button;
