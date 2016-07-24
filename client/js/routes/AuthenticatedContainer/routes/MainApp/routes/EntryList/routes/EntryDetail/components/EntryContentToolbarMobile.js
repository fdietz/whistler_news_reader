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
  EllipsisSVGIcon
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

const EntryContentToolbarMobile = ({
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
    <div className="toolbar toolbar--titled show-small-screen-only">
      <Button
        type="header"
        onClick={onGoBackClick}
        title="Go back"
        className="btn-logo">
        <GoBackSVGIcon color="light-gray" size="small" />
      </Button>

      <header>
      </header>

      <div className="right">
        <span className={spinnerCls}>
          <Icon name="spinner" size="small" />
        </span>

        <Button
          type="header"
          onClick={onOpenExternalClick}
          disabled={!entry}
          title="Open story in new browser tab or window">
          <EarthSVGIcon color="light-gray" size="small" />
        </Button>

        <Dropdown className="west">
          <DropdownTrigger className={shareDropdownCls}>
            <EllipsisSVGIcon color="light-gray" size="small" />
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
                  className="dropdown-label content">Readability optimized (beta)</label>
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
            {entry &&
              <ul className="dropdown__list">
                <li className="dropdown__list-separator" />
                <li className="dropdown__list-item">
                  <MailLink {...entry} iconColor="light-gray" />
                </li>
                <li className="dropdown__list-item">
                  <TwitterLink {...entry} iconColor="light-gray" />
                </li>
                <li className="dropdown__list-item">
                  <FacebookLink {...entry} iconColor="light-gray" />
                </li>
                <li className="dropdown__list-item">
                  <GooglePlusLink {...entry} iconColor="light-gray" />
                </li>
                <li className="dropdown__list-item">
                  <PinterestLink {...entry} iconColor="light-gray" />
                </li>
              </ul>
            }
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
};

EntryContentToolbarMobile.propTypes = {
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

export default EntryContentToolbarMobile;
