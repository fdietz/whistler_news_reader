import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import DateTimeHelper from '../../../../utils/DateTimeHelper';
import Image from '../../../../components/Image';

class EntryGridItem extends Component {

  static propTypes = {
    entry: PropTypes.shape({
      published: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      unread: PropTypes.bool.isRequired,
      summary: PropTypes.string,
      content: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    className: PropTypes.string,
  };

  extractUrl(str) {
    let m;
    const urls = [];
    const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

    while (m = rex.exec(str)) {
      urls.push(m[1]);
    }

    return urls[0];
  }

  render() {
    const { entry, isSelected = false, onClick, className } = this.props;

    let cls = classNames('item', className, {
      selected: isSelected,
      unread: entry.unread,
    });

    const date = new Date(entry.published);
    const relativeDateTime = DateTimeHelper.timeDifference(date);
    const imageUrl = this.extractUrl(entry.content);

    return (
      <div className={cls} onClick={onClick}>
        {imageUrl &&
          <Image imageUrl={imageUrl} className="entry-grid__image" />
        }
        <div className="entry-grid__caption">
          <div className="entry-title">{entry.title}</div>
          <div className="meta">
            <div className="feed-title">{entry.subscription_title}</div>
            <span className="circle"></span>
            <span className="published">{relativeDateTime}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default EntryGridItem;
