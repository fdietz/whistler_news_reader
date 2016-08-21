import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

class Image extends Component {

  static propTypes = {
    imageUrl: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
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
    const imgTag = this.imageRef;
    const { imageUrl } = this.props;
    imgTag.src = imageUrl;

    this.setState({ loaded: true });
  }

  render() {
    const { className, style, imageUrl } = this.props;
    const cls = classNames('image', className, {
      'image-loaded': this.state.loaded,
    });

    return (
      <img ref={(r) => { this.imageRef = r; }} alt={imageUrl} className={cls} style={style} />
    );
  }
}

export default Image;
