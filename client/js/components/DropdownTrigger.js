import React, { PropTypes } from 'react';
import classNames from 'classnames';

const DropdownTrigger = ({ children, className, style, active, onClick }) => {
  const cls = classNames('dropdown__trigger', className, {
    active,
  });

  return (
    <a className={cls} onClick={onClick} style={style}>
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
