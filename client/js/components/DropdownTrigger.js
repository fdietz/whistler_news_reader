import React, { PropTypes } from 'react';
import classNames from 'classnames';

const DropdownTrigger = ({ children, className, style, active, onClick, ...rest }) => {
  const cls = classNames('dropdown__trigger', className, {
    active: active,
  });

  return (
    <a href="#" className={cls} onClick={onClick} style={style} {...rest}>
      {children}
    </a>
  );
};

DropdownTrigger.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DropdownTrigger;
