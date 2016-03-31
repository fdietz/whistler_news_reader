import React, { PropTypes } from "react";
import SVGComponent from "./SVGComponent";

const COLORS = {
  white: "#FAFAFF",
  gray: "#798ca7",
  black: "#555"
};

function mapColor(color) {
  return COLORS[color] || color;
}

export const CrossSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M14.349 13.152l-2.758-3.152 2.758-3.152c0.469-0.469 0.469-1.229 0-1.697s-1.229-0.468-1.697 0l-2.652 3.031-2.651-3.030c-0.469-0.469-1.229-0.469-1.697 0s-0.468 1.229 0 1.697l2.757 3.151-2.758 3.152c-0.468 0.469-0.468 1.227 0 1.695s1.229 0.469 1.697 0l2.652-3.029 2.651 3.029c0.469 0.469 1.229 0.469 1.697 0s0.469-1.226 0.001-1.695z"></path>
    </SVGComponent>
  );
};
CrossSVGIcon.propTypes = { color: PropTypes.string };

export const HouseSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M18.77 10.3l-8.024-8.031c-0.41-0.426-1.081-0.426-1.491 0l-8.025 8.031c-0.411 0.425-0.258 0.774 0.34 0.774h1.673v6.168c0 0.445 0.019 0.809 0.824 0.809h3.895v-6.188h4.075v6.188h4.089c0.614 0 0.631-0.363 0.631-0.809v-6.168h1.672c0.597 0 0.751-0.348 0.341-0.774z"></path>
    </SVGComponent>
  );
};
HouseSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowDownSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M13.418 7.601c0.271-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-3.907 3.83c-0.271 0.268-0.709 0.268-0.979 0l-3.908-3.83c-0.27-0.268-0.27-0.701 0-0.969s0.708-0.268 0.979 0l3.418 3.14 3.418-3.14z"></path>
    </SVGComponent>
  );
};
ArrowDownSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowRightSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M7.601 13.418c-0.268 0.271-0.268 0.709 0 0.979 0.267 0.271 0.701 0.271 0.969 0l3.83-3.907c0.268-0.271 0.268-0.709 0-0.979l-3.83-3.908c-0.268-0.271-0.701-0.271-0.969 0s-0.268 0.708-0.001 0.978l3.141 3.419-3.14 3.418z"></path>
    </SVGComponent>
  );
};
ArrowRightSVGIcon.propTypes = { color: PropTypes.string };

export const ListSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M16 9h-12c-0.552 0-1 0.448-1 1s0.448 1 1 1h12c0.553 0 1-0.448 1-1s-0.447-1-1-1zM4 7h12c0.553 0 1-0.448 1-1s-0.447-1-1-1h-12c-0.552 0-1 0.448-1 1s0.448 1 1 1zM16 13h-12c-0.552 0-1 0.447-1 1s0.448 1 1 1h12c0.553 0 1-0.447 1-1s-0.447-1-1-1z"></path>
    </SVGComponent>
  );
};
ListSVGIcon.propTypes = { color: PropTypes.string };

export const PlusSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M15.199 9h-4.2v-4.2c0-0.552-0.447-0.6-1-0.6-0.552 0-1 0.047-1 0.6v4.2h-4.199c-0.553 0-0.6 0.448-0.6 1s0.047 1 0.6 1h4.199v4.2c0 0.552 0.448 0.6 1 0.6 0.553 0 1-0.048 1-0.6v-4.2h4.2c0.553 0 0.601-0.448 0.601-1s-0.048-1-0.601-1z"></path>
    </SVGComponent>
  );
};
PlusSVGIcon.propTypes = { color: PropTypes.string };
