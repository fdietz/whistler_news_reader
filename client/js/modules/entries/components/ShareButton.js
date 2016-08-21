import React from 'react';

import {
  MailSVGIcon,
  TwitterSVGIcon,
  FacebookSVGIcon,
  GooglePlusSVGIcon,
  PinterestSVGIcon,
} from '../../../components/SVGIcon';

const popupOptions = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600';

const openWindow = (href) => {
  window.open(href, '', popupOptions);
  return false;
};

export const TwitterLink = ({ title, url, iconColor = "gray", ...rest }) => {
  const href = `https://twitter.com/intent/tweet/?text=${title}&url=${url}`;
  return (
    <a href={href} target="_blank">
      <TwitterSVGIcon color={iconColor} />
      Twitter
    </a>);
};

export const FacebookLink = ({ title, url, iconColor = "gray", ...rest }) => {
  const href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  return (
    <a
      href={href}
      target="_blank"
      onClick={openWindow.bind(this, href)}
  >
      <FacebookSVGIcon color={iconColor} />
      Facebook
    </a>
  );
};

export const GooglePlusLink = ({ title, url, iconColor = "gray", ...rest }) => {
  const href = `https://plus.google.com/share?url=${url}`;
  return (
    <a
      href={href}
      target="_blank"
      onClick={openWindow.bind(this, href)}
  >
      <GooglePlusSVGIcon color={iconColor} />
      Google
    </a>
  );
};

export const PinterestLink = ({ title, url, iconColor = "gray", ...rest }) => {
  const href = `http://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
  return (
    <a href={href} target="_blank">
      <PinterestSVGIcon color={iconColor} />
      Pinterest
    </a>
  );
};

export const MailLink = ({ title, url, iconColor = "gray", ...rest }) => {
  const href = `mailto:?&subject=${title}&body=${url}`;
  return (
    <a href={href} target="_blank">
      <MailSVGIcon color={iconColor} />
      Mail
    </a>
  );
};
