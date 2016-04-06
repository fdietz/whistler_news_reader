import React, { PropTypes, Component } from "react";
import classNames from "classnames";

class Dropdown extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const {children, className} = this.props;
    const cls = classNames("dropdown", className);

    return (

    <div className={cls}>
      {children}
    </div>
    );
  }
}

export default Dropdown;
