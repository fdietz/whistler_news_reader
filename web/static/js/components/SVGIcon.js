import React, { PropTypes } from "react";
import SVGComponent from "./SVGComponent";

const COLORS = {
  white: "#FAFAFF",
  gray: "#8CA2C1",
  "light-gray": "#98B0D2",
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

export const ArrowDownBoldSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M15.483 8.563c-0.407 0.418-4.695 4.503-4.695 4.503-0.218 0.223-0.503 0.334-0.788 0.334s-0.571-0.111-0.788-0.334c0 0-4.288-4.085-4.696-4.503s-0.435-1.169 0-1.616c0.436-0.446 1.043-0.481 1.576 0l3.908 3.748 3.907-3.747c0.534-0.481 1.142-0.446 1.576 0 0.436 0.446 0.409 1.198 0 1.615z"></path>
    </SVGComponent>
  );
};
ArrowDownBoldSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowUpSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M6.581 12.399c-0.271 0.268-0.708 0.268-0.979 0s-0.271-0.701 0-0.97l3.908-3.828c0.271-0.268 0.709-0.268 0.979 0l3.908 3.829c0.271 0.269 0.271 0.702 0 0.97s-0.708 0.268-0.979 0l-3.419-3.141-3.418 3.14z"></path>
    </SVGComponent>
  );
};
ArrowUpSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowUpBoldSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M15.483 11.437c-0.407-0.418-4.695-4.502-4.695-4.502-0.218-0.223-0.503-0.335-0.788-0.335s-0.571 0.112-0.788 0.335c0 0-4.288 4.084-4.696 4.502s-0.435 1.17 0 1.616c0.436 0.445 1.043 0.481 1.576 0l3.908-3.747 3.907 3.747c0.534 0.481 1.142 0.445 1.576 0 0.436-0.447 0.409-1.199 0-1.616z"></path>
    </SVGComponent>
  );
};
ArrowUpBoldSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowRightSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M7.601 13.418c-0.268 0.271-0.268 0.709 0 0.979 0.267 0.271 0.701 0.271 0.969 0l3.83-3.907c0.268-0.271 0.268-0.709 0-0.979l-3.83-3.908c-0.268-0.271-0.701-0.271-0.969 0s-0.268 0.708-0.001 0.978l3.141 3.419-3.14 3.418z"></path>
    </SVGComponent>
  );
};
ArrowRightSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowRightBoldSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M8.563 4.516c0.418 0.408 4.502 4.696 4.502 4.696 0.224 0.218 0.335 0.503 0.335 0.788s-0.111 0.57-0.335 0.788c0 0-4.084 4.288-4.502 4.695-0.418 0.408-1.169 0.436-1.616 0s-0.481-1.042 0-1.575l3.748-3.908-3.747-3.908c-0.481-0.534-0.446-1.141 0-1.576s1.198-0.408 1.615 0z"></path>
    </SVGComponent>
  );
};
ArrowRightBoldSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowLeftBoldSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M11.437 4.516c-0.418 0.408-4.502 4.696-4.502 4.696-0.223 0.218-0.334 0.503-0.334 0.788s0.111 0.57 0.334 0.788c0 0 4.084 4.288 4.502 4.695 0.418 0.408 1.17 0.436 1.616 0s0.48-1.042-0.001-1.575l-3.747-3.908 3.747-3.908c0.481-0.534 0.446-1.141 0.001-1.576-0.447-0.435-1.199-0.408-1.616 0z"></path>
    </SVGComponent>
  );
};

ArrowLeftBoldSVGIcon.propTypes = { color: PropTypes.string };

export const ArrowLeftSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M12.399 13.418c0.268 0.271 0.268 0.709 0 0.979s-0.701 0.271-0.969 0l-3.83-3.907c-0.268-0.271-0.268-0.709 0-0.979l3.83-3.908c0.268-0.271 0.701-0.271 0.969 0s0.268 0.708 0 0.979l-3.14 3.418 3.14 3.418z"></path>
    </SVGComponent>
  );
};

ArrowLeftSVGIcon.propTypes = { color: PropTypes.string };

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

export const CogSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M16.785 10c0-1.048 0.645-1.875 1.615-2.443-0.176-0.584-0.406-1.145-0.691-1.672-1.090 0.285-1.971-0.142-2.711-0.882-0.742-0.741-0.969-1.623-0.684-2.711-0.527-0.285-1.086-0.518-1.672-0.692-0.568 0.971-1.595 1.616-2.642 1.616s-2.073-0.645-2.642-1.616c-0.586 0.174-1.145 0.407-1.672 0.691 0.284 1.089 0.058 1.971-0.683 2.712s-1.623 1.167-2.711 0.883c-0.285 0.526-0.517 1.087-0.692 1.671 0.971 0.568 1.616 1.395 1.616 2.443 0 1.047-0.645 2.074-1.616 2.643 0.175 0.585 0.407 1.145 0.692 1.672 1.089-0.285 1.97-0.058 2.711 0.683s0.967 1.622 0.683 2.711c0.527 0.285 1.087 0.518 1.672 0.692 0.569-0.972 1.595-1.616 2.642-1.616s2.075 0.645 2.643 1.616c0.586-0.175 1.145-0.407 1.672-0.692-0.285-1.089-0.059-1.97 0.684-2.711 0.74-0.74 1.621-1.167 2.711-0.883 0.285-0.527 0.516-1.087 0.691-1.672-0.971-0.569-1.616-1.396-1.616-2.443zM10 13.653c-2.017 0-3.652-1.636-3.652-3.653s1.635-3.653 3.652-3.653c2.018 0 3.653 1.636 3.653 3.653s-1.635 3.653-3.653 3.653z"></path>
    </SVGComponent>
  );
};
CogSVGIcon.propTypes = { color: PropTypes.string };

export const TrashSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M3.389 7.912l1.102 9.709c0.059 0.461 2.285 1.977 5.509 1.979 3.224-0.002 5.451-1.518 5.51-1.979l1.102-9.709c-1.684 0.942-4.201 1.388-6.612 1.388s-4.928-0.446-6.611-1.388zM13.167 1.912l-0.859-0.953c-0.331-0.471-0.691-0.559-1.392-0.559h-1.832c-0.7 0-1.060 0.088-1.392 0.559l-0.858 0.953c-2.57 0.449-4.434 1.64-4.434 2.518v0.171c0 1.546 3.402 2.8 7.6 2.8s7.6-1.254 7.6-2.8v-0.171c0-0.878-1.863-2.069-4.433-2.518zM12.069 4.139l-1.252-1.339h-1.634l-1.252 1.339h-1.7c0 0 1.862-2.22 2.111-2.521 0.19-0.23 0.385-0.318 0.637-0.318h2.043c0.252 0 0.446 0.088 0.637 0.318 0.248 0.301 2.111 2.521 2.111 2.521h-1.701z"></path>
    </SVGComponent>
  );
};
TrashSVGIcon.propTypes = { color: PropTypes.string };

export const CheckmarkSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M8.295 17c-0.435 0-0.847-0.203-1.111-0.553l-3.574-4.718c-0.465-0.614-0.344-1.488 0.27-1.953s1.488-0.344 1.953 0.27l2.351 3.104 5.912-9.491c0.407-0.653 1.267-0.853 1.921-0.446 0.653 0.406 0.853 1.267 0.445 1.92l-6.983 11.21c-0.243 0.391-0.662 0.636-1.121 0.656-0.021 0.001-0.042 0.001-0.063 0.001z"></path>
    </SVGComponent>
  );
};
CheckmarkSVGIcon.propTypes = { color: PropTypes.string };

export const CycleSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M5.516 14.224c-2.262-2.433-2.222-6.245 0.127-8.611 0.962-0.968 2.164-1.546 3.414-1.736l-0.069-2.077c-1.754 0.213-3.452 0.996-4.797 2.35-3.149 3.172-3.186 8.29-0.123 11.532l-1.741 1.753 5.51 0.301-0.015-5.834-2.306 2.322zM12.162 2.265l0.015 5.834 2.307-2.323c2.262 2.433 2.223 6.245-0.127 8.611-0.962 0.969-2.164 1.546-3.415 1.736l0.069 2.076c1.755-0.213 3.453-0.996 4.798-2.351 3.148-3.171 3.187-8.29 0.122-11.531l1.741-1.753-5.51-0.299z"></path>
    </SVGComponent>
  );
};
CycleSVGIcon.propTypes = { color: PropTypes.string };

export const ResizeEnlargeSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M11.613 2.112l2.404 1.946-3.030 2.93 2 2 2.932-3.032 1.992 2.457v-6.301h-6.298zM6.988 10.988l-2.931 3.030-1.97-2.431v6.3h6.3l-2.431-1.969 3.031-2.931-1.999-1.999z"></path>
    </SVGComponent>
  );
};
ResizeEnlargeSVGIcon.propTypes = { color: PropTypes.string };

export const ResizeShrinkSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M4.1 14.1l-3.1 2.9 2 2 2.9-3.1 2 2.1v-5.9h-5.9l2.1 2zM19 3l-2-2-2.9 3.1-2-2.1v5.9h5.9l-2.1-2 3.1-2.9z"></path>
    </SVGComponent>
  );
};
ResizeShrinkSVGIcon.propTypes = { color: PropTypes.string };

export const EarthSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M10 0.399c-5.294 0-9.6 4.308-9.6 9.601 0 5.294 4.306 9.601 9.6 9.601s9.6-4.307 9.6-9.601c0-5.293-4.306-9.601-9.6-9.601zM18.188 10c0 1.873-0.636 3.601-1.696 4.981-0.3-0.235-0.618-0.868-0.318-1.524 0.302-0.66 0.381-2.188 0.312-2.782-0.066-0.594-0.375-2.026-1.215-2.040-0.837-0.013-1.412-0.289-1.91-1.283-1.033-2.067 1.939-2.465 0.906-3.61-0.289-0.321-1.783 1.324-2.002-0.868-0.015-0.157 0.135-0.392 0.335-0.635 3.244 1.090 5.588 4.156 5.588 7.761zM8.875 1.894c-0.195 0.38-0.712 0.536-1.027 0.823-0.683 0.618-0.977 0.533-1.346 1.127s-1.566 1.449-1.566 1.879c0 0.429 0.604 0.937 0.906 0.838 0.302-0.1 1.098-0.094 1.566 0.070 0.469 0.166 3.915 0.331 2.816 3.244-0.348 0.926-1.872 0.77-2.278 2.304-0.061 0.225-0.271 1.186-0.286 1.5-0.024 0.486 0.344 2.318-0.125 2.318-0.471 0-1.737-1.639-1.737-1.936s-0.329-1.339-0.329-2.23-1.517-0.877-1.517-2.062c0-1.070 0.823-1.602 0.638-2.113-0.182-0.51-1.627-0.528-2.229-0.59 1.052-2.732 3.529-4.76 6.514-5.172zM7.425 17.77c0.492-0.259 0.542-0.595 0.988-0.613 0.51-0.022 0.925-0.199 1.499-0.325 0.511-0.111 1.423-0.629 2.228-0.695 0.677-0.056 2.015 0.035 2.375 0.689-1.296 0.86-2.848 1.362-4.515 1.362-0.9 0-1.765-0.148-2.575-0.418z"></path>
    </SVGComponent>
  );
};
EarthSVGIcon.propTypes = { color: PropTypes.string };

export const ShareSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M15 13c-0.688 0-1.318 0.233-1.824 0.622l-5.219-3.131c0.025-0.16 0.043-0.324 0.043-0.491 0-0.168-0.018-0.331-0.043-0.491l5.219-3.131c0.506 0.389 1.136 0.622 1.824 0.622 1.656 0 3-1.343 3-3s-1.344-3-3-3-3 1.343-3 3c0 0.167 0.018 0.331 0.044 0.491l-5.219 3.132c-0.506-0.39-1.137-0.623-1.825-0.623-1.657 0-3 1.343-3 3s1.343 3 3 3c0.688 0 1.319-0.233 1.825-0.622l5.219 3.131c-0.026 0.16-0.044 0.323-0.044 0.491 0 1.656 1.344 3 3 3s3-1.344 3-3-1.344-3-3-3z"></path>
    </SVGComponent>
  );
};
ShareSVGIcon.propTypes = { color: PropTypes.string };

export const TwitterSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M19.2 4.293c-0.678 0.301-1.405 0.503-2.169 0.595 0.78-0.467 1.379-1.207 1.66-2.088-0.729 0.432-1.537 0.747-2.396 0.916-0.689-0.734-1.67-1.192-2.756-1.192-2.085 0-3.775 1.69-3.775 3.774 0 0.296 0.033 0.584 0.098 0.86-3.137-0.157-5.919-1.66-7.78-3.944-0.326 0.557-0.513 1.206-0.513 1.898 0 1.31 0.667 2.465 1.68 3.142-0.619-0.020-1.201-0.189-1.71-0.472 0 0.016 0 0.031 0 0.047 0 1.829 1.302 3.354 3.028 3.702-0.316 0.086-0.65 0.132-0.995 0.132-0.243 0-0.479-0.023-0.71-0.067 0.48 1.5 1.875 2.591 3.526 2.621-1.292 1.013-2.919 1.616-4.688 1.616-0.305 0-0.605-0.018-0.9-0.053 1.67 1.071 3.654 1.696 5.787 1.696 6.943 0 10.74-5.752 10.74-10.741 0-0.163-0.003-0.326-0.011-0.488 0.738-0.532 1.377-1.197 1.884-1.954z"></path>
    </SVGComponent>
  );
};
TwitterSVGIcon.propTypes = { color: PropTypes.string };

export const FacebookSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M15 4.129h-2.856c-0.338 0-0.715 0.444-0.715 1.039v2.062h3.571v2.94h-3.571v8.83h-3.372v-8.829h-3.057v-2.941h3.057v-1.73c0-2.481 1.722-4.5 4.086-4.5h2.857v3.129z"></path>
    </SVGComponent>
  );
};
FacebookSVGIcon.propTypes = { color: PropTypes.string };

export const GooglePlusSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M1.99 5.589c0 1.493 0.499 2.572 1.482 3.205 0.805 0.519 1.74 0.597 2.226 0.597 0.118 0 0.212-0.005 0.278-0.009 0 0-0.154 1.003 0.59 1.996l-0.034-0.001c-1.289 0-5.494 0.27-5.494 3.727 0 3.517 3.862 3.695 4.636 3.695 0.061 0 0.096-0.001 0.096-0.001 0.009 0 0.064 0.002 0.158 0.002 0.497 0 1.782-0.062 2.976-0.643 1.548-0.751 2.334-2.059 2.334-3.885 0-1.765-1.196-2.815-2.070-3.583-0.533-0.468-0.994-0.872-0.994-1.265 0-0.4 0.336-0.701 0.762-1.082 0.688-0.616 1.338-1.493 1.338-3.151 0-1.458-0.189-2.436-1.354-3.056 0.122-0.062 0.551-0.107 0.764-0.137 0.631-0.086 1.554-0.184 1.554-0.699v-0.099h-4.598c-0.046 0.001-4.65 0.172-4.65 4.389zM9.413 14.602c0.088 1.406-1.115 2.444-2.921 2.575-1.834 0.135-3.345-0.691-3.433-2.097-0.042-0.675 0.254-1.336 0.835-1.863 0.59-0.533 1.398-0.862 2.279-0.928 0.104-0.006 0.207-0.011 0.31-0.011 1.697 0 2.847 0.998 2.93 2.324zM8.212 4.626c0.451 1.587-0.23 3.246-1.315 3.552-0.125 0.035-0.254 0.053-0.384 0.053-0.995 0-1.98-1.006-2.345-2.392-0.204-0.779-0.188-1.459 0.046-2.114 0.23-0.643 0.643-1.079 1.163-1.225 0.125-0.036 0.255-0.053 0.385-0.053 1.2 0 1.972 0.498 2.45 2.179zM15.961 8.082v-3h-1.9v3h-3v1.9h3v3h1.9v-3h3v-1.9h-3z"></path>
    </SVGComponent>
  );
};
GooglePlusSVGIcon.propTypes = { color: PropTypes.string };

export const PinterestSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M8.616 13.228c-0.525 2.753-1.166 5.393-3.066 6.772-0.586-4.162 0.861-7.287 1.533-10.605-1.146-1.93 0.138-5.812 2.556-4.855 2.975 1.177-2.576 7.173 1.15 7.922 3.891 0.782 5.479-6.75 3.067-9.199-3.486-3.538-10.148-0.082-9.328 4.981 0.199 1.238 1.478 1.614 0.511 3.322-2.231-0.494-2.897-2.254-2.811-4.6 0.138-3.839 3.45-6.527 6.772-6.899 4.202-0.471 8.145 1.542 8.688 5.494 0.613 4.46-1.895 9.291-6.389 8.943-1.217-0.093-1.728-0.696-2.683-1.276z"></path>
    </SVGComponent>
  );
};
PinterestSVGIcon.propTypes = { color: PropTypes.string };

export const MailSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M1.594 5.286c0.488 0.263 7.249 3.894 7.501 4.029s0.577 0.2 0.905 0.2c0.329 0 0.655-0.065 0.906-0.201s7.012-3.766 7.5-4.029c0.489-0.262 0.951-1.085 0.054-1.085h-16.919c-0.897 0-0.436 0.823 0.053 1.086zM18.613 7.286c-0.555 0.29-7.367 3.851-7.707 4.029s-0.577 0.201-0.906 0.201c-0.328 0-0.565-0.023-0.905-0.201s-7.153-3.74-7.707-4.029c-0.391-0.204-0.388 0.035-0.388 0.219s0 7.335 0 7.335c0 0.42 0.559 0.96 0.992 0.96h16.017c0.434 0 0.991-0.54 0.991-0.959 0 0 0-7.151 0-7.335s0.004-0.424-0.387-0.22z"></path>
    </SVGComponent>
  );
};
MailSVGIcon.propTypes = { color: PropTypes.string };

export const GoBackSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M4.983 15l0.001-3.228 14.816 0.001v-3.553h-14.817l0.001-3.22-4.784 5z"></path>
    </SVGComponent>
  );
};
GoBackSVGIcon.propTypes = { color: PropTypes.string };

export const MenuSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M16 9h-12c-0.552 0-1 0.448-1 1s0.448 1 1 1h12c0.553 0 1-0.448 1-1s-0.447-1-1-1zM4 7h12c0.553 0 1-0.448 1-1s-0.447-1-1-1h-12c-0.552 0-1 0.448-1 1s0.448 1 1 1zM16 13h-12c-0.552 0-1 0.447-1 1s0.448 1 1 1h12c0.553 0 1-0.447 1-1s-0.447-1-1-1z"></path>
    </SVGComponent>
  );
};
MenuSVGIcon.propTypes = { color: PropTypes.string };

export const EllipsisSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
    <path fill={mapColor(color)} d="M3 7.8c-1.215 0-2.2 0.985-2.2 2.2s0.985 2.2 2.2 2.2 2.2-0.985 2.2-2.2c0-1.215-0.985-2.2-2.2-2.2zM10 7.8c-1.215 0-2.2 0.985-2.2 2.2s0.985 2.2 2.2 2.2 2.199-0.985 2.199-2.2c0-1.215-0.984-2.2-2.199-2.2zM17 7.8c-1.215 0-2.2 0.985-2.2 2.2s0.985 2.2 2.2 2.2 2.2-0.985 2.2-2.2c0-1.215-0.985-2.2-2.2-2.2z"></path>
    </SVGComponent>
  );
};
EllipsisSVGIcon.propTypes = { color: PropTypes.string };

export const ExportSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
    <path fill={mapColor(color)} d="M15 15.8h-13v-9h2.595c0 0 0.689-0.896 2.17-2h-5.765c-0.552 0-1 0.448-1 1v11c0 0.553 0.448 1 1 1h15c0.553 0 1-0.447 1-1v-3.746l-2 1.645v1.101zM13.362 8.85v3.55l6.638-5.201-6.638-4.999v3.13c-8.062 0.001-8.062 7.97-8.062 7.97 2.282-3.748 3.686-4.45 8.062-4.45z"></path>
    </SVGComponent>
  );
};
ExportSVGIcon.propTypes = { color: PropTypes.string };

export const TextSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M7.223 10.87h5.6v-1.8h-5.6v1.8zM15 1h-10c-1.1 0-2 0.9-2 2v14c0 1.1 0.9 2 2 2h10c1.1 0 2-0.9 2-2v-14c0-1.1-0.9-2-2-2zM15 17h-10v-14h10v14zM12.8 5.169h-5.6v1.75h5.6v-1.75zM12.8 13.020h-5.6v1.75h5.6v-1.75z"></path>
    </SVGComponent>
  );
};
TextSVGIcon.propTypes = { color: PropTypes.string };

export const NewspaperSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M16 1h-12c-1.1 0-2 0.9-2 2v14c0 1.1 0.9 2 2 2h12c1.101 0 2-0.9 2-2v-14c0-1.1-0.899-2-2-2zM16 17h-12v-14h12v14zM11 12h-5v1h5v-1zM14 8h-4v1h4v-1zM10 7h4v-2h-4v2zM9 5h-3v4h3v-4zM8 10h-2v1h2v-1zM9 11h5v-1h-5v1zM14 14h-8v1h8v-1zM12 13h2v-1h-2v1z"></path>
    </SVGComponent>
  );
};
NewspaperSVGIcon.propTypes = { color: PropTypes.string };

export const PopupSVGIcon = ({ color = "white", ...props }) => {
  return (
    <SVGComponent {...props}>
      <path fill={mapColor(color)} d="M16 2h-8.020c-1.1 0-1.98 0.88-1.98 1.98v8.020c0 1.1 0.9 2 2 2h8c1.1 0 2-0.9 2-2v-8c0-1.1-0.9-2-2-2zM16 12h-8v-8h8v8zM4 10h-2v6c0 1.1 0.9 2 2 2h6v-2h-6v-6z"></path>
    </SVGComponent>
  );
};
PopupSVGIcon.propTypes = { color: PropTypes.string };
