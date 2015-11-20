import React, {Component, PropTypes} from "react";
// import imageArrowDown from "../../assets/images/arrow-down.svg";
// import imageArrowUp from "../../assets/images/arrow-up.svg";
// import imageProfile from "../../assets/images/profile.jpg";

export default class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired
  };

  render() {
    const { feeds } = this.props;

    return (
      <div className="sidebar">
        <div className="sidebar-content">
          <h4 className="sidebar-nav-header">Home</h4>
          <ul className="sidebar-nav-list">
            <li className="active">
              <a href="test">Today</a>
            </li>
            <li>
              <a href="test">All</a>
            </li>
          </ul>

          <h4 className="sidebar-nav-header">Subscriptions</h4>
          <ul className="sidebar-nav-list">
            {feeds.map(function(feed, i) {
              return (<li key={i}><a href="">{feed.title}</a></li>);
            })}
          </ul>
        </div>
      </div>
    );
  }
}
