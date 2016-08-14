import React, { PropTypes } from 'react';

const FeedEntrySubheader = ({ subscription_title, author, published }) => {
  return (
    <div className="feed-entry-content__subheader">
      {subscription_title}
      {author &&
        <span> / by {author}</span>
      }
      {(subscription_title || author) && published &&
        <span> / </span>
      }
      {published}
    </div>
  );
};

FeedEntrySubheader.propTypes = {
  subscription_title: PropTypes.string.isRequired,
  author: PropTypes.string,
  published: PropTypes.string
};

export default FeedEntrySubheader;
