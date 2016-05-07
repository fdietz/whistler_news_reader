import React from 'react';

import {
  MailSVGIcon,
  TwitterSVGIcon,
  FacebookSVGIcon,
  GooglePlusSVGIcon,
  PinterestSVGIcon,
} from 'components/SVGIcon';

const popupOptions = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600';

const openWindow = (href) => {
  window.open(href, '', popupOptions);
  return false;
};

export const TwitterLink = ({ title, url, ...rest }) => {
  const href = `https://twitter.com/intent/tweet/?text=${title}&url=${url}`;
  return (
    <a href={href} target="_blank" {...rest}>
      <TwitterSVGIcon color="gray" />
      Twitter
    </a>);
};

export const FacebookLink = ({ title, url, ...rest }) => {
  const href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  return (
    <a
      href={href}
      target="_blank"
      onClick={openWindow.bind(this, href)}
  >
      <FacebookSVGIcon color="gray" />
      Facebook
    </a>
  );
};

export const GooglePlusLink = ({ title, url, ...rest }) => {
  const href = `https://plus.google.com/share?url=${url}`;
  return (
    <a
      href={href}
      target="_blank"
      onClick={openWindow.bind(this, href)}
  >
      <GooglePlusSVGIcon color="gray" />
      Google
    </a>
  );
};

export const PinterestLink = ({ title, url, ...rest }) => {
  const href = `http://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
  return (
    <a href={href} target="_blank" {...rest}>
      <PinterestSVGIcon color="gray" />
      Pinterest
    </a>
  );
};

export const MailLink = ({ title, url, ...rest }) => {
  const href = `mailto:?&subject=${title}&body=${url}`;
  return (
    <a href={href} target="_blank" {...rest}>
      <MailSVGIcon color="gray" />
      Mail
    </a>
  );
};
