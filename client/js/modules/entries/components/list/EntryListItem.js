import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import DateTimeHelper from '../../../../utils/DateTimeHelper';
import BackgroundImage from '../../../../components/BackgroundImage';

class EntryListItem extends Component {

  static propTypes = {
    entry: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    className: PropTypes.string,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      entry,
      isSelected = false,
      onClick,
      className,
    } = this.props;

    const cls = classNames('entry-list__item', className, {
      selected: isSelected,
      unread: entry.unread,
    });

    const date = new Date(entry.published);
    const relativeDateTime = DateTimeHelper.timeDifference(date);

    return (
      <div className={cls} onClick={() => onClick(entry)}>
        <div className="entry-media">
          <BackgroundImage imageUrl={entry.image_url} />
        </div>
        <div className="entry-content">
          <div className="entry-title">{entry.title}</div>
          <div className="entry-summary">{entry.summary}</div>
          <div className="meta">
            <div className="feed-title">{entry.subscription_title}</div>
            <span className="published">{relativeDateTime}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default EntryListItem;
