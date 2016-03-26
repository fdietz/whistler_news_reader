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
      <div className="panel-container">
        <div className="panel">
          <header>
            <div className="logo">
              whistl'er news reader
            </div>
          </header>
          <form onSubmit={this._handleSubmit}>
            <input ref="firstName" className="field mb1" type="text" placeholder="First name" focus={true}/>
            {renderErrorsFor(errors, "first_name")}

            <input ref="lastName" className="field mb1" type="text" placeholder="Last name"/>
            {renderErrorsFor(errors, "last_name")}

            <input ref="email" className="field mb1" type="email" placeholder="Email"/>
            {renderErrorsFor(errors, "email")}

            <input ref="password" className="field mb1" type="password" placeholder="Password"/>
            {renderErrorsFor(errors, "password")}

            <input ref="passwordConfirmation" className="field mb1" type="password" placeholder="Confirm password"/>
            {renderErrorsFor(errors, "password_confirmation")}

            <div className="button-bar mt2">
              <Link to="/sign_in">Login</Link>
              <button type="submit" className="btn btn-primary block ml2">Register</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.user.errors
});

export default connect(mapStateToProps)(SignUp);
