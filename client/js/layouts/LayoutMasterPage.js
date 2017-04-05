import React, { PropTypes } from 'react';
import classNames from 'classnames';

const LayoutMasterPage = ({ children, className }) => {
  const cls = classNames('layout-master-page', className);
  return (
    <div className={cls}>
    {children}
    </div>
  );
};

LayoutMasterPage.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default LayoutMasterPage;
