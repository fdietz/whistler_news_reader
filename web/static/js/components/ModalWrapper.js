import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

// TODO: consider using react-modal instead
export default class ModalWrapper extends Component {

  static propTypes = {
    returnTo: PropTypes.string.required,
    dispatch: PropTypes.func.required,
    children: PropTypes.node
  }

  render() {
    const styles = {
      position: "fixed",
      top: "20%",
      right: "20%",
      bottom: "20%",
      left: "20%",
      padding: 20,
      overflow: "auto",
      background: "#fff"
    };

    // using React.cloneElements instead of only this.props.children
    // because we need to pass props down to the modal component
    return (
      <div style={styles}>
        <p><Link to={this.props.returnTo}>Back</Link></p>
        {React.cloneElement(this.props.children, {
          dispatch: this.props.dispatch, returnTo: this.props.returnTo })}
      </div>
    );
  }
}
