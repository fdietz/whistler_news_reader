import React, {Component, PropTypes} from "react";
// import imageArrowDown from "../../assets/images/arrow-down.svg";
// import imageArrowUp from "../../assets/images/arrow-up.svg";
// import imageProfile from "../../assets/images/profile.jpg";

export default class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onAddFeedClick: PropTypes.func.isRequired
  };

  render() {
    const { feeds, onAddFeedClick } = this.props;

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">Whistler</div>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <button onClick={onAddFeedClick}
              className="btn btn--blue add-subscription">Add Feed</button>
          </div>

          <h4 className="sidebar-nav-header">Home</h4>
          <ul className="sidebar-nav-list">
            <li className="sidebar-nav-list-item active">
              <a href="test">Today</a>
            </li>
            <li className="sidebar-nav-list-item">
              <a href="test">All</a>
            </li>
          </ul>

          <h4 className="sidebar-nav-header">Subscriptions</h4>
          <ul className="sidebar-nav-list">
            {feeds.map(function(feed, i) {
              return (<li className="sidebar-nav-list-item" key={i}>
                        <a href="">{feed.title}</a>
                      </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}
