import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import classNames from 'classnames';

import { renderErrorsFor } from '../../../utils';

import * as UserActions from '../actions';
import * as RandomImagesActions from '../../randomImages/actions';

class SignIn extends Component {

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

    const { email, password } = this.refs;

    userActions.requestSignIn(email.value, password.value);
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
      <div className="panel-container">
        <div className={cls} style={style} />
        <div className="panel">
          <header>
            <div className="logo">
              whistl'er news reader
            </div>
          </header>
          <form onSubmit={this.handleSubmit}>
            {renderErrorsFor(errors, 'base')}

            <label className="field-label">
              Email
              <input
                ref="email"
                className="field"
                type="Email"
                placeholder="Email"
                focus
                placeholder="yourmail@mail.com"
    />
              {renderErrorsFor(errors, 'email')}
            </label>

            <label className="field-label">
              Password
              <input
                ref="password"
                className="field"
                type="password"
                placeholder="Password"
                placeholder="password"
    />
              {renderErrorsFor(errors, 'password')}
            </label>

            <div className="button-bar mt2">
              <Link to="/sign_up">Create new account</Link>
              <button type="submit" className="btn btn-primary block ml2">Login</button>
              </div>
          </form>
        </div>

        {image &&
          <div className="credits">
            <div>{image.alt}</div>
          <a href="https://unsplash.com/" className="gray-2">unsplash.com</a>
          </div>
        }

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

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
