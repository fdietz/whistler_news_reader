import React, { PropTypes, Component, cloneElement } from "react";
import ReactDOM from "react-dom";

import classNames from "classnames";

import DropdownTrigger from "./DropdownTrigger";
import DropdownContent from "./DropdownContent";

class Dropdown extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    onHide: PropTypes.func,
    onShow: PropTypes.func
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
    event.preventDefault();
    this.toggle();
  }

  componentDidMount() {
    window.addEventListener("click", this.onWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.onWindowClick);
  }

  render() {
    const { className, children, style } = this.props;
    const { active } = this.state;
    const cls = classNames("dropdown", className);

    const clonedChildren = React.Children.map(children, child => {
      if (child.type === DropdownTrigger) {
        return cloneElement(child, {
          active: active,
          onClick: this.toggleActive
        });
      } else if (child.type === DropdownContent) {
        return cloneElement(child, {
          active: active,
          ref: "dropdownContent"
        });
      }
      return child;
    });

    return (
      <div className={cls} ref="dropdown" style={style}>
        {clonedChildren}
      </div>
    );
  }

  hide() {
    this.setState({ active: false });
    if (this.props.onHide) this.props.onHide();
  }

  show() {
    this.setState({ active: true });
    if (this.props.onShow) this.props.onShow();
  }

  toggle() {
    if (this.state.active) {
      this.hide();
    } else {
      this.show();
    }
  }

  onWindowClick(event) {
    const dropdown = this.refs.dropdown;
    const dropdownContent = ReactDOM.findDOMNode(this.refs.dropdownContent);

    // click outside
    if (this.state.active && !dropdown.contains(event.target)) {
      this.hide();
    }

    // click inside
    if (this.state.active && dropdownContent && dropdownContent.contains(event.target)) {
      this.hide();
    }
  }
}

export default Dropdown;
