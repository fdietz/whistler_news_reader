import React, {Component, PropTypes} from "react";
import imageArrowDown from "../../assets/images/arrow-down.svg";
import imageArrowUp from "../../assets/images/arrow-up.svg";
import imageProfile from "../../assets/images/profile.jpg";

export default class Sidebar extends Component {

  render() {
    let currentUser = "";

    return (
      <div className="sidebar">
        <div className="sidebar-content">
          <h4 className="sidebar-nav-header">Home</h4>
          <ul className="sidebar-nav-list">
            <li className="active">
              <a href="test"># general</a>
            </li>
          </ul>

          <h4 className="sidebar-nav-header">Subscriptions</h4>
          <ul className="sidebar-nav-list"></ul>
        </div>
      </div>
    );
  }
}
