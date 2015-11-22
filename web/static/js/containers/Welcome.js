import React, {Component, PropTypes} from "react";

export default class Welcome extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div>
        <h2>Welcome</h2>
        {this.props.children}
      </div>
    );
  }
}
