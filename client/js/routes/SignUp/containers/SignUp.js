import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';

import { renderErrorsFor } from 'utils';
import { requestSignUp } from 'redux/modules/user';
import { requestFetchRandomImages } from 'redux/modules/randomImages';

class SignUp extends Component {

  static propTypes = {
    errors: PropTypes.array,
    randomImages: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this._handleSubmit = this._handleSubmit.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(requestFetchRandomImages());
  }

  _handleSubmit(e) {
    e.preventDefault();

    const { dispatch } = this.props;

    const data = {
      name: this.refs.name.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      password_confirmation: this.refs.passwordConfirmation.value,
    };

    dispatch(requestSignUp(data));
  }

  randomImage() {
    const { randomImages } = this.props;
    if (!this.currentImageIndex) {
      this.currentImageIndex = Math.floor(Math.random() * randomImages.items.length);
    }
    return randomImages.items[this.currentImageIndex];
  }

  render() {
    const { errors } = this.props;

    const image = this.randomImage();
    let style;
    if (image) {
      style = { backgroundImage: `url(${image.url})` };
    }

    const cls = classNames('image', {
      'fade-in': image,
    });
    return (
      <div className="panel-container" >
        <div className={cls} style={style} />
        <div className="panel">
          <header>
            <div className="logo">
              whistl'er news reader
            </div>
          </header>
          <form onSubmit={this._handleSubmit} id="sign_up_form">

            <label className="field-label">
              Name
              <input ref="name" className="field" id="name" type="text" placeholder="Name" focus />
              {renderErrorsFor(errors, 'name')}
            </label>

            <label className="field-label">
              Email
              <input ref="email" className="field" id="email" type="email" placeholder="Email" />
              {renderErrorsFor(errors, 'email')}
            </label>

            <label className="field-label">
              Password
              <input ref="password" className="field" id="password" type="password" placeholder="Password" />
              {renderErrorsFor(errors, 'password')}
            </label>

            <label className="field-label">
              Password confirmation
              <input ref="passwordConfirmation" className="field" id="password_confirm" type="password" placeholder="Confirm password" />
              {renderErrorsFor(errors, 'password_confirmation')}
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
  errors: state.user.errors,
  randomImages: state.randomImages,
});

export default connect(mapStateToProps)(SignUp);
