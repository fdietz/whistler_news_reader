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

  render() {
    const { children } = this.props;
    return <div {...this.props} ref="container">{children}</div>;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleClick(e) {
    const { onClickOutside } = this.props;
    const el = this.refs.container;

    if (!el.contains(e.target)) onClickOutside(e);
  }
}
