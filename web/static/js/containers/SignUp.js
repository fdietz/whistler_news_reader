import React, {Component, PropTypes} from "react";
import { connect } from "react-redux";
import { Link } from "react-router";

import { setDocumentTitle, renderErrorsFor } from "../utils";
import { requestSignUp } from "../redux/modules/user";

class SignUp extends Component {

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log("======")
    setDocumentTitle("Sign up");
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { dispatch } = this.props;

    const data = {
      first_name: this.refs.firstName.value,
      last_name: this.refs.lastName.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      password_confirmation: this.refs.passwordConfirmation.value
    };

    dispatch(requestSignUp(data));
  }

  render() {
    const { errors } = this.props;

    return (
      <div className="view-container registrations new">
        <main>
          <header>
            <div className="logo" />
          </header>
          <form onSubmit={this._handleSubmit}>
            <div className="field">
              <input ref="firstName" type="text" placeholder="First name" required={true} />
              {renderErrorsFor(errors, "first_name")}
            </div>
            <div className="field">
              <input ref="lastName" type="text" placeholder="Last name" required={true} />
              {renderErrorsFor(errors, "last_name")}
            </div>
            <div className="field">
              <input ref="email" type="email" placeholder="Email" required={true} />
              {renderErrorsFor(errors, "email")}
            </div>
            <div className="field">
              <input ref="password" type="password" placeholder="Password" required={true} />
              {renderErrorsFor(errors, "password")}
            </div>
            <div className="field">
              <input ref="passwordConfirmation" type="password" placeholder="Confirm password" required={true} />
              {renderErrorsFor(errors, "password_confirmation")}
            </div>
            <button type="submit">Sign up</button>
          </form>
          <Link to="/sign_in">Sign in</Link>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.user.errors
});

export default connect(mapStateToProps)(SignUp);