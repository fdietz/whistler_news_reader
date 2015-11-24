import React, {Component, PropTypes} from "react";
import { Link } from "react-router";

// import imageArrowDown from "../../assets/images/arrow-down.svg";
// import imageArrowUp from "../../assets/images/arrow-up.svg";
// import imageProfile from "../../assets/images/profile.jpg";

class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onAddFeedClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { feeds, onAddFeedClick } = this.props;

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">whistle'r</div>
          <div className="sublogo">news reader</div>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <button onClick={onAddFeedClick}
              className="btn btn--blue add-subscription">Add Feed</button>
          </div>

          <h4 className="sidebar-nav-header">Home</h4>
          <ul className="sidebar-nav-list">
            <li className="sidebar-nav-list-item active">
              <Link to="/today">Today</Link>
            </li>
            <li className="sidebar-nav-list-item">
              <Link to="/all">All</Link>
            </li>
          </ul>

          <h4 className="sidebar-nav-header">Subscriptions</h4>
          <ul className="sidebar-nav-list">
            {feeds.map(function(feed, i) {
              let feedLink = `/feeds/${feed.id}`
              return (<li className="sidebar-nav-list-item" key={i}>
                        <Link to={feedLink}>{feed.title}</Link>
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

export default Sidebar;
