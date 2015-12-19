import React, {Component} from "react";
import { connect } from "react-redux";

class Patterns extends Component {
  render() {
    return (
      <div className="container">
        <h1>Pattern Library</h1>

        <h2>Typography</h2>
        <div className="example">
          <h1>Hamburger 1</h1>
          <h2>Hamburger 2</h2>
          <h3>Hamburger 3</h3>
          <h4>Hamburger 4</h4>
          <h5>Hamburger 5</h5>
          <h6>Hamburger 6</h6>
        </div>

        <h2>Lists</h2>
        <div className="example">
          <ul>
            <li>Half-Smoke</li>
            <li>Kielbasa</li>
            <li>Bologna</li>
          </ul>
          <ol>
            <li>Prosciutto</li>
            <li>Andouille</li>
            <li>Bratwurst</li>
            <li>Chorizo</li>
          </ol>
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

        <div className="example">
          <button className="btn btn-outline m1 blue">Button</button>
          <button className="btn btn-outline m1 black">Button</button>
          <button className="btn btn-outline m1 silver">Button</button>
        </div>

        <div className="example">
          <button type="button" className="btn btn-big btn-primary m1">Burgers</button>
          <button type="button" className="btn btn-primary m1">Fries</button>
          <button type="button" className="btn btn-narrow btn-primary m1">Onion Rings</button>
          <button type="button" className="btn btn-small btn-primary m1">Shakes</button>
        </div>

        <h2>Forms</h2>
        <div className="example">
          <form>
            <label htmlFor="search">Search</label>
            <input id="search" type="text" className="field ml1"/>
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
              <input type="checkbox" checked/> Remember me
            </label>
            <button type="submit" className="btn btn-primary">Sign In</button>
            <button type="reset" className="btn btn-primary bg-gray ml1">Cancel</button>
          </form>
        </div>

        <div className="example">
          <label>Normal</label>
          <input type="text" className="block col-12 mb1 field"/>
          <label>Disabled</label>
          <input type="text" className="block col-12 mb1 field" disabled value="This is disabled"/>
          <label>Read Only</label>
          <input type="text" className="block col-12 mb1 field" readOnly value="This is read-only"/>
          <label>Required</label>
          <input type="text" className="block col-12 mb1 field" required/>
          <label>.is-focused</label>
          <input type="text" className="block col-12 mb1 field is-focused"/>
          <label>.is-disabled</label>
          <input type="text" className="block col-12 mb1 field is-disabled"/>
          <label>.is-read-only</label>
          <input type="text" className="block col-12 mb1 field is-read-only"/>
          <label>Success</label>
          <input type="text" className="block col-12 mb1 field is-success"/>
          <label>Warning</label>
          <input type="text" className="block col-12 mb1 field is-warning"/>
          <label>Error</label>
          <input type="text" className="block col-12 mb1 field is-error"/>
        </div>

      </div>
    );
  }
}

export default connect()(Patterns);
