import React, { PropTypes } from 'react';

const LayoutHeader = ({ children }) => (
  <div className="layout-master-header">
    {children}
  </div>
);

LayoutHeader.propTypes = {
  children: PropTypes.node,
};

export default LayoutHeader;
