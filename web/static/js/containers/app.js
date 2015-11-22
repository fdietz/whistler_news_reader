import React, { Component, PropTypes } from "react";

import { connect } from "react-redux";

import Sidebar from "../components/Sidebar";
import ModalWrapper from "../components/ModalWrapper";

class App extends Component {
  static propTypes = {
    feeds: PropTypes.array.required,
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal
    )) {
      // save the old children
      this.previousChildren = this.props.children;
    }
  }

  render() {
    const { feeds, location, dispatch } = this.props;
    const isModal = (
      location.state &&
      location.state.modal &&
      this.previousChildren
    );

    return (
      <div className="layout-container">
        <Sidebar location={location}/>

          {isModal ?
            this.previousChildren :
            this.props.children
          }

          {isModal && (
            <ModalWrapper isOpen={true} returnTo={location.state.returnTo} dispatch={dispatch}>
              {this.props.children}
            </ModalWrapper>
          )}

      </div>
    );
  }
}

// export default App;
export default connect((state) => ({ feeds: state.feeds }))(App);
