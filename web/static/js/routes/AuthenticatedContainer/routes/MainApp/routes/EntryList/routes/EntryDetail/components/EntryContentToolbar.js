import React, { PropTypes } from 'react';
import classNames from 'classnames';

import {
  ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon,
  ArrowDownSVGIcon,
  ArrowUpSVGIcon,
  EarthSVGIcon,
  GoBackSVGIcon,
  TextSVGIcon,
  ShareSVGIcon,
  NewspaperSVGIcon,
  PopupSVGIcon,
} from 'components/SVGIcon';

import Icon from 'components/Icon';
import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import DropdownTrigger from 'components/DropdownTrigger';
import DropdownContent from 'components/DropdownContent';
import Dropdown from 'components/Dropdown';

import {
  MailLink,
  TwitterLink,
  FacebookLink,
  GooglePlusLink,
  PinterestLink,
} from './ShareButton';

const EntryContentToolbar = ({
  entry,
  showSpinner,
  currentViewMode,
  hasPreviousEntry,
  hasNextEntry,
  onPreviousEntryClick,
  onNextEntryClick,
  onOpenExternalClick,
  onGoBackClick,
  onChangeViewModeClick,
}) => {
  const shareDropdownCls = classNames('btn btn-header', {
    disabled: !entry,
  });

  const spinnerCls = classNames({
    spinner: true,
    hide: !showSpinner,
  });

  return (
    <div className="toolbar hide-small-screen">
      <Button
        type="header"
        onClick={onGoBackClick}
        title="Go back"
        className="show-small-screen-only mr1">
        <GoBackSVGIcon color="light-gray" size="small" />
      </Button>

      <ButtonGroup className="btn-group-rounded">
        <Button
          type="header"
          onClick={onPreviousEntryClick}
          disabled={!hasPreviousEntry}
          title="Select previous story">
          <ArrowLeftBoldSVGIcon color="light-gray" size="small" />
        </Button>
        <Button
          type="header"
          onClick={onNextEntryClick}
          disabled={!hasNextEntry}
          title="Select next story">
          <ArrowRightBoldSVGIcon color="light-gray" size="small" />
        </Button>
      </ButtonGroup>

      <Dropdown className="ml1 mr1">
        <DropdownTrigger className="btn btn-header">
          <NewspaperSVGIcon color="light-gray" size="small" />
          <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down" />
          <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up" />
        </DropdownTrigger>
        <DropdownContent>
          <ul className="dropdown__list">
            <li
              className="dropdown__list-item"
              onClick={onChangeViewModeClick.bind(this, 'normal')}>
              <input
                type="radio"
                id="list"
                name="currrent_view_mode"
                checked={currentViewMode === 'normal'}
                readOnly
                className="dropdown-field media" />
              <label
                htmlFor="list"
                className="dropdown-label content">Feed Article</label>
            </li>
            <li
              className="dropdown__list-item"
              onClick={onChangeViewModeClick.bind(this, 'article')}>
              <input
                type="radio"
                id="article"
                name="currrent_view_mode"
                checked={currentViewMode === 'article'}
                readOnly
                className="dropdown-field media" />
              <label
                htmlFor="article"
                className="dropdown-label content">Readability optimized article (experimental)</label>
            </li>
            <li
              className="dropdown__list-item"
              onClick={onChangeViewModeClick.bind(this, 'website')}>
              <input
                type="radio"
                id="website"
                name="currrent_view_mode"
                checked={currentViewMode === 'website'}
                readOnly
                className="dropdown-field media" />
              <label
                htmlFor="website"
                className="dropdown-label content">Embed Website</label>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>

      <Button
        type="header"
        onClick={onOpenExternalClick}
        disabled={!entry}
        title="Open story in new browser tab or window">
        <EarthSVGIcon color="light-gray" size="small" />
      </Button>
      <Dropdown className="ml1">
        <DropdownTrigger className={shareDropdownCls}>
          <ShareSVGIcon color="light-gray" size="small" />
          <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down" />
          <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up" />
        </DropdownTrigger>
        <DropdownContent>
        {entry &&
          <ul className="dropdown__list">
            <li className="dropdown__list-item">
              <MailLink {...entry} />
            </li>
            <li className="dropdown__list-item">
              <TwitterLink {...entry} />
            </li>
            <li className="dropdown__list-item">
              <FacebookLink {...entry} />
            </li>
            <li className="dropdown__list-item">
              <GooglePlusLink {...entry} />
            </li>
            <li className="dropdown__list-item">
              <PinterestLink {...entry} />
            </li>
          </ul>
        }
        </DropdownContent>
      </Dropdown>

      <span className={spinnerCls}>
        <Icon name="spinner" size="small" />
      </span>
    </div>
  );
};

EntryContentToolbar.propTypes = {
  entry: PropTypes.object,
  currentViewMode: PropTypes.string.isRequired,
  hasPreviousEntry: PropTypes.bool.isRequired,
  hasNextEntry: PropTypes.bool.isRequired,
  onPreviousEntryClick: PropTypes.func.isRequired,
  onNextEntryClick: PropTypes.func.isRequired,
  onOpenExternalClick: PropTypes.func.isRequired,
  onGoBackClick: PropTypes.func.isRequired,
  onChangeViewModeClick: PropTypes.func.isRequired,
};

export default EntryContentToolbar;
