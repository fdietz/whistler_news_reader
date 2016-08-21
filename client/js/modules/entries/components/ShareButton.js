import React, { PropTypes } from 'react';

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

export const TwitterLink = ({ title, url, iconColor = 'gray' }) => {
  const href = `https://twitter.com/intent/tweet/?text=${title}&url=${url}`;
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      <TwitterSVGIcon color={iconColor} />
      Twitter
    </a>);
};

TwitterLink.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  iconColor: PropTypes.string
};

export const FacebookLink = ({ url, iconColor = 'gray' }) => {
  const href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  return (
    <a
      href={href}
      target="_blank" rel="noreferrer noopener"
      onClick={openWindow.bind(this, href)}>
      <FacebookSVGIcon color={iconColor} />
      Facebook
    </a>
  );
};

FacebookLink.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  iconColor: PropTypes.string
};

export const GooglePlusLink = ({ url, iconColor = 'gray' }) => {
  const href = `https://plus.google.com/share?url=${url}`;
  return (
    <a
      href={href}
      target="_blank" rel="noreferrer noopener"
      onClick={openWindow.bind(this, href)}
  >
      <GooglePlusSVGIcon color={iconColor} />
      Google
    </a>
  );
};

GooglePlusLink.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  iconColor: PropTypes.string
};

export const PinterestLink = ({ title, url, iconColor = 'gray' }) => {
  const href = `http://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      <PinterestSVGIcon color={iconColor} />
      Pinterest
    </a>
  );
};

PinterestLink.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  iconColor: PropTypes.string
};

export const MailLink = ({ title, url, iconColor = 'gray' }) => {
  const href = `mailto:?&subject=${title}&body=${url}`;
  return (
    <a href={href} target="_blank" rel="noreferrer noopener">
      <MailSVGIcon color={iconColor} />
      Mail
    </a>
  );
};

MailLink.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  iconColor: PropTypes.string
};
