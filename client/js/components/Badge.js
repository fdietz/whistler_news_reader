import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Badge = ({ count, className }) => {
  const cls = classNames('badge', className);

  return (
    <div className={cls}>{count > 99 ? '99+' : count}</div>
  );
};

Badge.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
};

export default Badge;
