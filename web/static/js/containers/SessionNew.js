import React, {Component, PropTypes}   from "react";
import { connect }          from "react-redux";
import { Link }             from "react-router";

import { setDocumentTitle, renderErrorsFor } from "../utils";
import requestSignIn from "../redux/modules/user";

class SessionNew extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentDidMount() {
    setDocumentTitle("SessionNew");
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.refs;
    const { dispatch } = this.props;

    dispatch(requestSignIn(email.value, password.value));
  }

  renderError() {
    const { error } = this.props;

    if (!error) return false;

    return (
      <div className="error">
        {error}
      </div>
    );
  }

  render() {
    return (
      <div className="view-container sessions new">
        <main>
          <header>
            <div className="logo" />
          </header>
          <form onSubmit={::this._handleSubmit}>
            {::this._renderError()}
            <div className="field">
              <input ref="email" type="Email" placeholder="Email" required="true" defaultValue="yourmail@mail.com"/>
            </div>
            <div className="field">
              <input ref="password" type="password" placeholder="Password" required="true" defaultValue="abc123"/>
            </div>
            <button type="submit">Sign in</button>
          </form>
          <Link to="/sign_up">Create new account</Link>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.user.errors,
});

export default connect(mapStateToProps)(SessionNew);
