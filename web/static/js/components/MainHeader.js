import React, {Component} from "react";

export default class MainHeader extends Component {
  render() {
    return (
      <div className="main-header">
        <div className="left">
          <h2>Whistler</h2>
        </div>
        <div className="right">
          <div className="search">
            <input className="search" type="search" placeholder="Search..."/>
          </div>
        </div>
      </div>
    );
  }
}
