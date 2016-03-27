import React, { PropTypes } from "react";

const ButtonGroup = ({ className, children }) => {
  const clazzName =  `btn-group ${className}`;
  return (
    <div className={clazzName}>
      {children}
    </div>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default ButtonGroup;
