import React, { PropTypes, Component } from "react";

import {
  ArrowDownSVGIcon,
  ArrowUpSVGIcon
} from "../components/SVGIcon";

import DropdownTrigger from "../components/DropdownTrigger";
import DropdownContent from "../components/DropdownContent";
import Dropdown from "../components/Dropdown";

class EntryContentToolbar extends Component {

  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onOPMLImportClick = this.onOPMLImportClick.bind(this);
    this.onSignOutClick = this.onSignOutClick.bind(this);
  }

  onSignOutClick(event) {
    event.preventDefault();
    this.props.userActions.requestSignOut();
  }

  onOPMLImportClick(event) {
    event.preventDefault();
    this.props.modalsActions.openOpmlImportModal();
  }

  render() {
    const { currentUser } = this.props;

    return (
      <div className="toolbar mx-l-auto">
        <Dropdown>
          <DropdownTrigger className="mr1">
            <div className="user-email">{currentUser.email}</div>
            <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down"/>
            <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up"/>
          </DropdownTrigger>
          <DropdownContent>
            <ul className="dropdown__list">
              <li className="dropdown__list-item">
                <a href="#" onClick={this.onOPMLImportClick}>OPML Import</a>
              </li>
              <li className="dropdown__list-item">
                <a href="#" onClick={this.onSignOutClick}>Logout</a>
              </li>
            </ul>
          </DropdownContent>
        </Dropdown>
        <div className="avatar-header">
          <img src={currentUser.image_url}/>
        </div>
  </div>
    );
  }
}

export default EntryContentToolbar;
