import React, {Component} from "react";

class TopHeader extends Component {
  render() {
    return (
      <div className="top-header">
        <div className="top-header__left">

          <a className="btn btn--primary" href="#">Mark all</a>
        </div>
        <h1 className="top-header__centered">News</h1>
        <div className="top-header__right">
          <a className="btn btn--secondary" href="">Feeds</a>
          <a className="btn btn--secondary" href="">Add Feed</a>
        </div>
      </div>
    );
  }
}

export default TopHeader;
