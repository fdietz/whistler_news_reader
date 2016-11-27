import React, { PropTypes } from 'react';

const LayoutContainer = ({ children }) => (
  <div className="layout-master-container">
    {children}
  </div>
);

LayoutContainer.propTypes = {
  children: PropTypes.node,
};

export default LayoutContainer;
