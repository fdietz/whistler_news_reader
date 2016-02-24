import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class Header extends Component {

  static PropTypes = {
    currentUser: PropTypes.object.isRequired,
    onSignOutClick: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.handleSignOutClick = this.handleSignOutClick.bind(this);
  }

  renderCurrentUser() {
    const { currentUser } = this.props;

    if (!currentUser) {
      return false;
    }

    const fullName = [currentUser.first_name, currentUser.last_name].join(' ');

    return (
      <a className="current-user">
        {currentUser.email} - {fullName}
      </a>
    );
  }

  renderSignOutLink() {
    if (!this.props.currentUser) {
      return false;
    }

    return (
      <a href="#" onClick={this.handleSignOutClick}><i className="fa fa-sign-out"/> Sign out</a>
    );
  }

  handleSignOutClick(e) {
    e.preventDefault();

    this.props.onSignOutClick();
  }

  render() {
    const { currentUser } = this.props;

    return (
      <header className="main-header">
        <Link to="/"><i className="fa fa-columns"/>Home</Link>
        <ul className="inline">
          <li>
            {this.renderCurrentUser()}
          </li>
          <li>
            {this.renderSignOutLink()}
          </li>
        </ul>
      </header>
    );
  }
}
