import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { requestSetCurrentUser } from '../actions';
import AuthToken from '../../../utils/AuthToken';

class AuthenticatedContainer extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    sidebar: PropTypes.node,
    mainApp: PropTypes.node,
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (AuthToken.getToken()) {
      if (!currentUser) dispatch(requestSetCurrentUser());
    } else {
      dispatch(push('/sign_up'));
    }
  }

  render() {
    if (!this.props.currentUser) return false;

    return (
      <div className="authenticated-container">
        {this.props.sidebar}
        {this.props.mainApp}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.current,
});

export default connect(mapStateToProps)(AuthenticatedContainer);
