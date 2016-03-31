import React, { PropTypes } from "react";

const SIZES = {
  small: { width: 16, height: 16 },
  medium: { width: 24, height: 24 },
  large: { width: 32, height: 32 },
  xlarge: { width: 48, height: 48 }
};

const SVGComponent = ({ size = "small", children }) => {
  const dimensions = SIZES[size];

  return (
    <svg width={dimensions.width} height={dimensions.height} viewBox="0 0 20 20">
      {children}
    </svg>
  );
};

SVGComponent.propTypes = {
  size: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default SVGComponent;
