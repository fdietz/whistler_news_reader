import React, { PropTypes } from 'react';

const LayoutContent = ({ children }) => (
  <div className="layout-master-content">
    {children}
  </div>
);

LayoutContent.propTypes = {
  children: PropTypes.node,
};

export default LayoutContent;
