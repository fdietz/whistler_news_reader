import React, { Component, PropTypes } from 'react';

export default class ClickOutside extends Component {

  static propTypes = {
    children: PropTypes.node,
    onClickOutside: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick(e) {
    const { onClickOutside } = this.props;
    const el = this.containerRef;

    if (!el.contains(e.target)) onClickOutside(e);
  }

  render() {
    const { children } = this.props;
    return <div {...this.props} ref={(c) => { this.containerRef = c; }}>{children}</div>;
  }

}
