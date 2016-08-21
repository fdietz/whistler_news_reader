import React, { PropTypes } from 'react';

const FeedEntryHeader = ({ url, title }) => (
  <div className="feed-entry-content__header">
    <h2 className="title">
      <a href={url} target="_blank" rel="noreferrer noopener">{title}</a>
    </h2>
  </div>
);

FeedEntryHeader.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default FeedEntryHeader;
