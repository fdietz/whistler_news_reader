import React, { PropTypes, Component } from "react";
import classNames from "classnames";

class DropdownContent extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    active: PropTypes.bool
  };

  render() {
    const { children, className, style, active } = this.props;

    const cls = classNames("dropdown__content", className, {
      hidden: !active
    });

    return (
      <div className={cls} style={style}>
        {children}
      </div>
    );
  }
}

export default DropdownContent;
