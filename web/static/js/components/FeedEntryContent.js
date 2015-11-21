import React, {Component, PropTypes} from "react";

class FeedEntryContent extends Component {

  static propTypes = {
    entry: PropTypes.object//.isRequired
  };

  constructor(props) {
    super(props);
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
