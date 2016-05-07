import React, { PropTypes, Component, cloneElement } from 'react';
import { Link } from 'react-router';
import Modal from 'react-modal';

import { CrossSVGIcon } from 'components/SVGIcon';

import { customModalStyles } from 'utils/ModalHelper';

class ModalWrapper extends Component {

  static propTypes = {
    returnTo: PropTypes.string,
    routerActions: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
  }

  close() {
    const { routerActions } = this.props;
    routerActions.push(this.props.returnTo);
  }

  render() {
    const { children } = this.props;
    const clonedChildren = React.Children.map(children, child => {
      return cloneElement(child, { onClose: this.close });
    });

    return (
      <Modal
        isOpen
        onRequestClose={this.close}
        style={customModalStyles}
    >

        <div className="modal-header">
          <div className="logo">whistle'r</div>
          <a className="modal-close-link" onClick={this.close}>
            <CrossSVGIcon color="white" size="medium" />
          </a>
        </div>

        {clonedChildren}
      </Modal>
    );
  }
}

export default ModalWrapper;
