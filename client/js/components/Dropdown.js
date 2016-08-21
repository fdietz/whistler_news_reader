import React, { PropTypes, Component, cloneElement } from 'react';

import classNames from 'classnames';

import DropdownTrigger from './DropdownTrigger';
import DropdownContent from './DropdownContent';

class Dropdown extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    onHide: PropTypes.func,
    onShow: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };

    this.toggleActive = this.toggleActive.bind(this);
    this.onWindowClick = this.onWindowClick.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onWindowClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  }

  onWindowClick(event) {
    const dropdown = this.dropdownRef;
    const dropdownContent = this.dropdownContentRef;

    // click outside
    if (this.state.active && !dropdown.contains(event.target)) {
      this.hide();
    }

    // click inside
    if (this.state.active && dropdownContent && dropdownContent.contains(event.target)) {
      this.hide();
    }
  }

  toggleActive(event) {
    event.preventDefault();
    this.toggle();
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

  render() {
    const { className, children, style } = this.props;
    const { active } = this.state;
    const cls = classNames('dropdown', className);

    const clonedChildren = React.Children.map(children, child => {
      if (child.type === DropdownTrigger) {
        return cloneElement(child, {
          active,
          onClick: this.toggleActive,
        });
      } else if (child.type === DropdownContent) {
        return cloneElement(child, {
          active,
          ref: (r) => { this.dropdownContentRef = r; },
        });
      }
      return child;
    });

    return (
      <div className={cls} ref={(r) => { this.dropdownRef = r; }} style={style}>
        {clonedChildren}
      </div>
    );
  }

}

export default Dropdown;
