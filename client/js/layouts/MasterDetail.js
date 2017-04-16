import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Media from 'react-media';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import LayoutMasterPage from './LayoutMasterPage';
import LayoutDetailPage from './LayoutDetailPage';

export default class MasterDetail extends Component {

  static propTypes = {
    master: PropTypes.node.isRequired,
    detail: PropTypes.node,
    expandMaster: PropTypes.bool,
    pathname: PropTypes.string.isRequired
  };

  render() {
    const segment = this.props.pathname.split('/')[2];

    const cls = classNames({
      'hide-animation': !!this.props.detail
    });

    const detail = (
      <LayoutDetailPage>
        {this.props.detail}
      </LayoutDetailPage>
    );

    let divStyle = {};
    if (this.props.expandMaster) {
      divStyle = { width: '100%' };
    }

    return (
      <div className="layout-master-container">
        <LayoutMasterPage className={cls} style={divStyle}>
          {this.props.master}
        </LayoutMasterPage>
        <Media query="(max-width: 40em)">
          {
            matches => {
              if (matches) {
                return (<ReactCSSTransitionGroup
                  component="div"
                  className="slide-animation-container"
                  transitionName="slide-left"
                  transitionEnterTimeout={200}
                  transitionLeaveTimeout={200}>
                  {this.props.detail && React.cloneElement(detail, {
                    key: segment
                  })}
                </ReactCSSTransitionGroup>);
              } else if (this.props.detail) {
                return detail;
              }

              return null;
            }
          }
        </Media>
      </div>
    );
  }
}
