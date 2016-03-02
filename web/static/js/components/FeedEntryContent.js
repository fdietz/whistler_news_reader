import React, {Component, PropTypes} from "react";

class FeedEntryContent extends Component {

  static propTypes = {
    entry: PropTypes.object,
    onEntryShown: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.initTimer();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry.id !== this.props.entry.id) {
      this.initTimer();
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  initTimer() {
    if (this.timeout) clearTimeout(this.timeout);

    if (this.props.entry.unread) {
      this.timeout = setTimeout(() => {
        if (this.props.onEntryShown) this.props.onEntryShown(this.props.entry);
      }, 2000);
    }
  }

  rawContent() {
    return { __html: this.props.entry.content };
  }

  render() {
    return (
      <div className="item-content">
        <div className="header">
          <h2 className="title">
            <a href={this.props.entry.url} target="_blank">{this.props.entry.title}</a>
          </h2>
        </div>
        <div className="subheader">
          {this.props.entry.feed.title} by {this.props.entry.author} / {this.props.entry.published}
        </div>
        <div className="item-content-content" dangerouslySetInnerHTML={this.rawContent()}/>
      </div>
    );
  }
}

export default FeedEntryContent;
