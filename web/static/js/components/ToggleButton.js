import React, { PropTypes, Component } from "react";
import classNames from "classnames";

import { ArrowDownSVGIcon, ArrowUpSVGIcon } from "./SVGIcon";

class ToggleButton extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = { toggled: false };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ toggled: !this.state.toggled });
  }

  render() {
    const {children, className} = this.props;
    const { toggled } = this.state;
    const cls = classNames("btn", "btn-toggle", className);

    return (
      <div className={cls} onClick={this.toggle}>
        {children}
        {!toggled && <ArrowDownSVGIcon/>}
        {toggled && <ArrowUpSVGIcon/>}
      </div>
    );
  }
}

export default ToggleButton;
