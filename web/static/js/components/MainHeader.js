import React, {Component} from "react";

import imageProfile from "../../assets/images/profile.jpg";

export default class MainHeader extends Component {
  render() {
    return (
      <div className="main-header">
        <div className="left">
        </div>
        <div className="right">
          <div className="avatar">
            <img src={imageProfile}/>
          </div>
        </div>
      </div>
    );
  }
}
