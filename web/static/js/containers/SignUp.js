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
      name: this.refs.name.value,
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

            <label className="field-label">
              Name
              <input ref="name" className="field" type="text" placeholder="Name" focus={true}/>
              {renderErrorsFor(errors, "name")}
            </label>

            <label className="field-label">
              Email
              <input ref="email" className="field" type="email" placeholder="Email"/>
              {renderErrorsFor(errors, "email")}
            </label>

            <label className="field-label">
              Password
              <input ref="password" className="field" type="password" placeholder="Password"/>
              {renderErrorsFor(errors, "password")}
            </label>

            <label className="field-label">
              Password confirmation
              <input ref="passwordConfirmation" className="field" type="password" placeholder="Confirm password"/>
              {renderErrorsFor(errors, "password_confirmation")}
            </label>

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
