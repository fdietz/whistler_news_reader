import React, { PropTypes, Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

import { CogSVGIcon, ArrowDownSVGIcon, ArrowUpSVGIcon } from "./SVGIcon";
import Button from "./Button";

class ViewSwitcherDropdown extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false
    };

    this.toggleActive = this.toggleActive.bind(this);
    this.onWindowClick = this.onWindowClick.bind(this);
  }

  toggleActive(event) {
    event.stopPropagation();
    this.toggle();
  }

  componentDidMount() {
    window.addEventListener("click", this.onWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  render() {
    const { children, className } = this.props;
    const { active } = this.state;
    const cls = classNames("dropdown-container", className);
    const dropdownCls = classNames("dropdown", {
      hidden: !active
    });

    return (
      <div className={cls} ref="dropdownContainer">
        <Button type="header" onClick={this.toggleActive}>
          <CogSVGIcon color="light-gray" size="small"/>
          {!active && <ArrowDownSVGIcon color="light-gray" size="small"/>}
          {active && <ArrowUpSVGIcon color="light-gray" size="small"/>}
        </Button>
          <div className={dropdownCls} ref="dropdown">
            {children}
          </div>
      </div>
    );
  }

  hide() {
    this.setState({ active: false });
  }

  show() {
    this.setState({ active: true });
  }

  toggle() {
    this.setState({ active: !this.state.active });
  }

  onWindowClick(event) {
    const dropdownContainer = ReactDOM.findDOMNode(this.refs.dropdownContainer);
    const dropdown = ReactDOM.findDOMNode(this.refs.dropdown);

    if (event.target !== dropdownContainer &&
        !dropdownContainer.contains(event.target) &&
        this.state.active) {
      this.hide();
    }

    if (this.state.active && dropdown.contains(event.target)) {
      this.hide();
    }
  }
}

export default ViewSwitcherDropdown;
