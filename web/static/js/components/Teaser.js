import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Teaser = ({ children, className }) => {
  const cls = classNames('teaser', className);
  return (
    <div className={cls}>
      {children}
    </div>
  );
};

Teaser.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Teaser;
