import React, { PropTypes } from 'react';
import classNames from 'classnames';

const DropdownContent = ({ children, className, style, active }) => {
  const cls = classNames('dropdown__content', className, {
    hidden: !active,
  });

  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
};

DropdownContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  active: PropTypes.bool,
};

export default DropdownContent;
