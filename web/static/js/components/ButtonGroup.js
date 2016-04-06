import React, { PropTypes } from "react";
import classNames from "classnames";

const ButtonGroup = ({ className, children }) => {
  const cls =  classNames("btn-group", className);
  return (
    <div className={cls}>
      {children}
    </div>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default ButtonGroup;
