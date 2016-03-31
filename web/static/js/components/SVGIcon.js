import React, { PropTypes } from "react";
import SVGComponent from "./SVGComponent";

const COLORS = {
  white: "#FAFAFF",
  gray: "#798ca7",
  black: "#555"
};

export const CrossSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={COLORS[color]} d="M14.349 13.152l-2.758-3.152 2.758-3.152c0.469-0.469 0.469-1.229 0-1.697s-1.229-0.468-1.697 0l-2.652 3.031-2.651-3.030c-0.469-0.469-1.229-0.469-1.697 0s-0.468 1.229 0 1.697l2.757 3.151-2.758 3.152c-0.468 0.469-0.468 1.227 0 1.695s1.229 0.469 1.697 0l2.652-3.029 2.651 3.029c0.469 0.469 1.229 0.469 1.697 0s0.469-1.226 0.001-1.695z"></path>
    </SVGComponent>
  );
};

CrossSVGIcon.propTypes = { color: PropTypes.string };
