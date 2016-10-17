import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

class BackgroundImage extends Component {

  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = { loaded: false, error: false };

    this.onImageLoad = this.onImageLoad.bind(this);
  }

  componentDidMount() {
    const { imageUrl } = this.props;
    const img = new window.Image();
    img.onload = () => this.onImageLoad();
    img.onerror = () => this.setState({ error: true });
    img.src = imageUrl;
  }

  onImageLoad() {
    const imgTag = this.imgRef;
    const { imageUrl } = this.props;
    imgTag.style.backgroundImage = `url(${imageUrl})`;

    this.setState({ loaded: true });
  }

  render() {
    const { className, style } = this.props;

    const cls = classNames('background-image', className, {
      'image-loaded': this.state.loaded,
      'image-load-error': this.state.error
    });

    return (
      <div ref={(r) => { this.imgRef = r; }} className={cls} style={style} />
    );
  }
}

export default BackgroundImage;
