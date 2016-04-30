import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Button = ({ type, expand, onClick, className, children, ...rest }) => {
  const cls = classNames('btn', className, {
    'btn-expand': expand,
    [`btn-${type}`]: type,
  });

  return (
    <button onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  expand: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
