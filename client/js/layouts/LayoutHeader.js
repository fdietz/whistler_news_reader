import React, { PropTypes } from 'react';

const LayoutHeader = ({ children }) => (
  <div className="layout-header">
    {children}
  </div>
);

LayoutHeader.propTypes = {
  children: PropTypes.node,
};

export default LayoutHeader;
