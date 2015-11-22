import React, {Component, PropTypes} from "react";
import { connect } from "react-redux";
// import imageArrowDown from "../../assets/images/arrow-down.svg";
// import imageArrowUp from "../../assets/images/arrow-up.svg";
// import imageProfile from "../../assets/images/profile.jpg";

import { pushState } from "redux-router";
import { Link } from "react-router";
import { fetchFeeds } from "../actions";

class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    // onAddFeedClick: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onAddFeedClick = this.onAddFeedClick.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchFeeds());
  }

  onAddFeedClick() {
    const { dispatch } = this.props;

    dispatch(pushState({ modal: true, returnTo: this.props.location.pathname }, "/feeds/new"));
  }

  render() {
    const { feeds, onAddFeedClick } = this.props;

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">Whistler</div>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <button onClick={this.onAddFeedClick}
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

export default connect((state) => ({ feeds: state.feeds }))(Sidebar);
// export default Sidebar;
