import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import classNames from 'classnames';

import { renderErrorsFor } from '../../../utils';
import * as UserActions from '../actions';
import * as RandomImagesActions from '../../randomImages/actions';

class SignUp extends Component {

  static propTypes = {
    errors: PropTypes.array,
    randomImages: PropTypes.object,

    // actions
    userActions: PropTypes.object.isRequired,
    randomImagesActions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { randomImagesActions } = this.props;
    randomImagesActions.requestFetchRandomImages();
  }

  handleSubmit(e) {
    const { userActions } = this.props;
    e.preventDefault();

    const data = {
      name: this.nameRef.value,
      email: this.emailRef.value,
      password: this.passwordRef.value,
      password_confirmation: this.passwordConfirmationRef.value,
    };

    userActions.requestSignUp(data);
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
          <form onSubmit={this.handleSubmit} id="sign_up_form">

            <label className="field-label" htmlFor="name">
              Name
              <input
                ref={(r) => { this.nameRef = r; }}
                className="field"
                id="name"
                type="text"
                placeholder="Name"
                autoFocus />
              {renderErrorsFor(errors, 'name')}
            </label>

            <label className="field-label" htmlFor="email">
              Email
              <input
                ref={(r) => { this.emailRef = r; }}
                className="field"
                id="email"
                type="email"
                placeholder="Email" />
              {renderErrorsFor(errors, 'email')}
            </label>

            <label className="field-label" htmlFor="password">
              Password
              <input
                ref={(r) => { this.passwordRef = r; }}
                className="field"
                id="password"
                type="password"
                placeholder="Password" />
              {renderErrorsFor(errors, 'password')}
            </label>

            <label className="field-label" htmlFor="password_confirm">
              Password confirmation
              <input
                ref={(r) => { this.passwordConfirmationRef = r; }}
                className="field"
                id="password_confirm"
                type="password"
                placeholder="Confirm password" />
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

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    randomImagesActions: bindActionCreators(RandomImagesActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
