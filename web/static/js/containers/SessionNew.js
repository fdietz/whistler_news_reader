import React, {Component, PropTypes}   from "react";
import { connect }          from "react-redux";
import { Link }             from "react-router";

import { setDocumentTitle, renderErrorsFor } from "../utils";
import { requestSignIn } from "../redux/modules/user";

class SessionNew extends Component {

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
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
          <form onSubmit={this.handleSubmit}>
            <label className="field-label">
              Email
              <input ref="email" className="field" type="Email" placeholder="Email" focus={true} placeholder="yourmail@mail.com"/>
              {renderErrorsFor(errors, "email")}
            </label>
            <label className="field-label">
              Password
              <input ref="password" className="field" type="password" placeholder="Password" placeholder="password"/>
              {renderErrorsFor(errors, "password")}
            </label>

            <div className="button-bar mt2">
              <Link to="/sign_up">Create new account</Link>
              <button type="submit" className="btn btn-primary block ml2">Login</button>
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

export default connect(mapStateToProps)(SessionNew);
