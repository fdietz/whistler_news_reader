import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { pushState } from "redux-router";

// TODO: consider using react-modal instead
export default class ModalWrapper extends Component {

  static propTypes = {
    returnTo: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
  }

  closeModal(event) {
    const { dispatch, returnTo } = this.props;
    // event.preventDefault();
    // event.stopPropagation();
    // dispatch(pushState(null, returnTo));
  }

  render() {
    // using React.cloneElements instead of only this.props.children
    // because we need to pass props down to the modal component
    return (
      <div className="modal-backdrop" onClick={(event) => this.closeModal(event)}>
        <div className="modal modal-right">
          <Link className="modal-close-link" to={this.props.returnTo}>Back</Link>
          {React.cloneElement(this.props.children, {
            dispatch: this.props.dispatch, returnTo: this.props.returnTo })}
        </div>
      </div>
    );
  }
}
