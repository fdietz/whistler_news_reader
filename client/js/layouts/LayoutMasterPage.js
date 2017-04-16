import React, { PropTypes } from 'react';
import classNames from 'classnames';

const LayoutMasterPage = ({ children, className, style }) => {
  const cls = classNames('layout-master-page', className);
  return (
    <div className={cls} style={style}>
    {children}
    </div>
  );
};

LayoutMasterPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.string
};

export default LayoutMasterPage;
