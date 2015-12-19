import React, {Component} from "react";
import { connect } from "react-redux";

class Patterns extends Component {
  render() {
    return (
      <div className="container">
        <h1>Pattern Library</h1>

        <h2>Forms</h2>
        <div className="example">
          <form>
            <label htmlFor="search">Search</label>
            <input id="search" type="text" className="field"/>
            <button className="btn btn-primary ml1">Go</button>
          </form>
        </div>

        <div className="example">
          <form className="sm-col-6">
            <label>Email Address</label>
            <input type="text" className="block col-12 mb1 field"/>
            <label>Password</label>
            <input type="password" className="block col-12 mb1 field"/>
            <label>Select</label>
            <select className="block col-12 mb1 field">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
              <option>Option 4</option>
              <option>Option 5</option>
            </select>
            <label className="block col-12 mb2">
              <input type="checkbox" checked/>
              Remember me
            </label>
            <button type="submit" className="btn btn-primary">Sign In</button>
            <button type="reset" className="btn btn-primary bg-gray ml1">Cancel</button>
          </form>
        </div>

        <div className="example">
          <label>Normal</label>
          <input type="text" className="block col-12 field"/>
          <label>Disabled</label>
          <input type="text" className="block col-12 field" disabled value="This is disabled"/>
          <label>Read Only</label>
          <input type="text" className="block col-12 field" readOnly value="This is read-only"/>
          <label>Required</label>
          <input type="text" className="block col-12 field" required/>
          <label>.is-focused</label>
          <input type="text" className="block col-12 field is-focused"/>
          <label>.is-disabled</label>
          <input type="text" className="block col-12 field is-disabled"/>
          <label>.is-read-only</label>
          <input type="text" className="block col-12 field is-read-only"/>
          <label>Success</label>
          <input type="text" className="block col-12 field is-success"/>
          <label>Warning</label>
          <input type="text" className="block col-12 field is-warning"/>
          <label>Error</label>
          <input type="text" className="block col-12 field is-error"/>
        </div>

        <h2>Buttons</h2>
        <div className="example">
          <button className="btn">Button</button>
          <a href="#!" className="btn">Link Button</a>
          <input type="button" className="btn" value="Input Button"/>
        </div>

        <div className="example">
          <button className="btn btn-primary m1">Button</button>
          <a href="#!" className="btn btn-primary m1">Link Button</a>
          <input type="button" className="btn btn-primary m1" value="Input Button"/>
        </div>

        <div className="example">
          <button className="btn btn-primary m1 bg-blue">Button</button>
          <button className="btn btn-primary m1 bg-black">Button</button>
          <button className="btn btn-primary m1 bg-red">Button</button>
          <button className="btn btn-primary m1 bg-gray">Button</button>
          <button className="btn btn-primary m1 black bg-gray-2">Button</button>
        </div>

      </div>
    );
  }
}

export default connect()(Patterns);
