export function twitterUrl(articleUrl) {
  const text = 'Share';
  return `https://twitter.com/intent/tweet/?text=${text}&url=${articleUrl}`;
}

export function facebookUrl(articleUrl) {
  const text = 'Share';
  return `https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`;
}
