import React, { PropTypes } from 'react';

const Icon = ({ name, children, size = 'medium' }) => {
  const iconClassName = `svg-entypo-icon-${name}`;
  const iconClassSize = `svg-icon-${size}`;
  const cls = `${iconClassName} ${iconClassSize}`;

  return (
    <span className={cls}>
      {children}
    </span>
  );
};

Icon.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default Icon;
