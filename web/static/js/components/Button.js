import React, { PropTypes } from "react";

const Button = ({ type, onClick, children }) => {
  const cls = `btn ${type}`;

  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  onClick: PropTypes.func
};

export default Button;
