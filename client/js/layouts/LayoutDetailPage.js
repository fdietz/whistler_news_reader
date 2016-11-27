import React, { PropTypes } from 'react';

const LayoutDetailPage = ({ children }) => (
  <div className="layout-detail-page">
    {children}
  </div>
);

LayoutDetailPage.propTypes = {
  children: PropTypes.node,
};

export default LayoutDetailPage;
