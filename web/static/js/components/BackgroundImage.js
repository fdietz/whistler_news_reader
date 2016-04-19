import React, { PropTypes, Component } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";

class BackgroundImage extends Component {

  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = { loaded: false };

    this.onImageLoad = this.onImageLoad.bind(this);
  }

  componentDidMount() {
    const { imageUrl } = this.props;
    const img = new window.Image();
    img.onload = () => this.onImageLoad();
    img.src = imageUrl;
  }

  onImageLoad() {
    const imgTag = ReactDOM.findDOMNode(this.refs.img);
    const { imageUrl } = this.props;
    imgTag.style.backgroundImage = `url(${imageUrl})`;

    this.setState({ loaded: true });
  }

  render() {
    const { className, style, ...rest } = this.props;

    const cls = classNames("background-image", className, {
      "image-loaded": this.state.loaded
    });

    return (
      <div ref="img" className={cls} style={style} {...rest}/>
    );
  }
}

export default BackgroundImage;
