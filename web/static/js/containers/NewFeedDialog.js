import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions as RouterActions } from 'react-router-redux';
import ReactDOM from 'react-dom';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import Icon from '../components/Icon';
import Autocomplete from '../components/Autocomplete';

import { getSortedCategories, getSortedFeeds } from '../redux/selectors';
import { reduceErrorsToString } from '../utils/ErrorHelper';
import { renderErrorsFor } from '../utils';

import * as EntriesActions from '../redux/modules/entries';
import * as SubscriptionsActions from '../redux/modules/subscriptions';
import * as CategoriesActions from '../redux/modules/categories';
import * as FeedFormActions from '../redux/modules/feedForm';
import * as FeedsActions from '../redux/modules/feeds';

class NewFeedDialog extends Component {

  static propTypes = {
    feedForm: PropTypes.object.isRequired,
    feeds: PropTypes.object.isRequired,
    sortedFeeds: PropTypes.array.isRequired,
    sortedCategories: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    // actions
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    feedFormActions: PropTypes.object.isRequired,
    feedsActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleAutocompleteOnChange = debounce(this.handleAutocompleteOnChange.bind(this), 100);
    this.handleAutocompleteOnSelect = this.handleAutocompleteOnSelect.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.feedUrl).focus();
    }, 0);
  }

  handleChange() {
    const { feedFormActions } = this.props;

    feedFormActions.feedFormUpdate({
      categoryId: ReactDOM.findDOMNode(this.refs.categoryId).value
    });
  }

  close(event) {
    const { feedFormActions } = this.props;

    if (event) event.preventDefault();
    feedFormActions.feedFormReset();
    this.props.onClose();
  }

  handleAutocompleteOnChange(value) {
    const { feedsActions, feedFormActions } = this.props;

    if (value.length > 2 && !value.startsWith('http')) {
      feedsActions.requestSearchFeeds(value);
    }

    feedFormActions.feedFormUpdate({
      searchTerm: value,
      isFeedUrl: value.startsWith('http'),
      feedExists: false
    });
  }

  handleAutocompleteOnSelect(value) {
    const { feedFormActions, feedsActions } = this.props;

    feedFormActions.feedFormUpdate({
      searchTerm: value.title,
      feedExists: true,
      selectedFeed: value
    });

    feedsActions.resetSearchFeeds({});
  }

  submitForm(event) {
    const { feedForm } = this.props;
    event.preventDefault();

    if (!feedForm.feedExists) {
      this.createFeed(feedForm.searchTerm);
    } else {
      this.createSubscription(feedForm.selectedFeed.id, feedForm.categoryId);
    }
  }

  createFeed(searchTerm, categoryId) {
    const { feedFormActions } = this.props;

    feedFormActions.requestCreateFeed({ feed_url: searchTerm })
      .then((response) => {
        if (!response.error) {
          this.createSubscription(response.id, categoryId);
        }
      });
  }

  createSubscription(feedId, categoryId) {
    const { subscriptionsActions, routerActions, feedFormActions, entriesActions } = this.props;

    subscriptionsActions.requestCreateSubscription({ feed_id: feedId, category_id: categoryId })
      .then((response) => {
        if (response.error) {
          feedFormActions.feedFormUpdate(response.payload);
        } else {
          const subscription = response.payload;
          this.props.onClose();
          entriesActions.requestRefreshEntries({ subscription_id: subscription.id }).then(() =>
            routerActions.push(`/subscriptions/${subscription.id}`)
          );
        }
      });
  }

  render() {
    const { feedForm, sortedCategories, feeds, sortedFeeds } = this.props;

    const inputCls = classNames('field block col-12', {
      'input-icon-spinner': feeds.isLoading,
      'is-success': feedForm.feedExists || feedForm.isFeedUrl
    });

    return (
      <div className="modal-content">
        <form onSubmit={this.submitForm} className="form-prominent sm-col-6">
          <h1>Add new subscription</h1>

          {feedForm.errors &&
            <div className="sm-col-12 mb2">
              {renderErrorsFor(feedForm.errors, 'base')}
              {renderErrorsFor(feedForm.errors, 'feed_id')}
            </div>
          }

          <label className="field-label">
            Website address or feed title

            <Autocomplete
              placeholder="Enter Website address or feed title here"
              ref="value"
              items={sortedFeeds}
              inputClassName={inputCls}
              autoFocus
              getItemValue={(item) => item.title}
              onSelect={this.handleAutocompleteOnSelect}
              onChange={this.handleAutocompleteOnChange}
            />

            <div className="hint">
              Website address must start with http://
            </div>

            {renderErrorsFor(feedForm.errors, 'feed_url')}
          </label>


          <label className="field-label mb3">
            Select category
            <select
              className="field block"
              ref="categoryId"
              onChange={(event) => this.handleChange(event)}
              value={feedForm.category_id}>

              <option value="">Select ...</option>
              {sortedCategories.map((category) => {
                return <option value={category.id} key={category.id}>{category.title}</option>;
              })}
            </select>
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary bg-blue white btn-large with-icon"
              disabled={!feedForm.feedExists && !feedForm.isFeedUrl}
              onClick={this.submitForm}>
                {feedForm.isLoading && <Icon name="spinner_white" size="small"/>}
                Add Subscription
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    feedForm: state.feedForm,
    sortedCategories: getSortedCategories(state),
    sortedFeeds: getSortedFeeds(state),
    feeds: state.feeds
  };
}

function mapDispatchToProps(dispatch) {
  return {
    entriesActions: bindActionCreators(EntriesActions, dispatch),
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    feedsActions: bindActionCreators(FeedsActions, dispatch),
    feedFormActions: bindActionCreators(FeedFormActions, dispatch),
    routerActions: bindActionCreators(RouterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewFeedDialog);
