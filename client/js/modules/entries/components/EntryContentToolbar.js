import React, { PropTypes } from 'react';
import classNames from 'classnames';

import {
  ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon,
  ArrowDownSVGIcon,
  ArrowUpSVGIcon,
  EarthSVGIcon,
  GoBackSVGIcon,
  ShareSVGIcon,
  NewspaperSVGIcon,
  EllipsisSVGIcon
} from '../../../components/SVGIcon';

import Icon from '../../../components/Icon';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';
import DropdownTrigger from '../../../components/DropdownTrigger';
import DropdownContent from '../../../components/DropdownContent';
import Dropdown from '../../../components/Dropdown';

import {
  MailLink,
  TwitterLink,
  FacebookLink,
  GooglePlusLink,
  PinterestLink,
} from './ShareButton';

const EntryContentToolbar = ({
  isMobile,
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

  const toolbarCls = classNames('toolbar', {
    'toolbar--titled': isMobile,
    'show-small-screen-only': isMobile,
    'hide-small-screen': !isMobile
  });

  const dropdownCls = classNames('dropdown', {
    west: isMobile,
    'ml1 mr1': !isMobile
  });

  return (
    <div className={toolbarCls}>
      <Button
        type="header"
        onClick={onGoBackClick}
        title="Go back"
        className="show-small-screen-only mr1">
        <GoBackSVGIcon color="light-gray" size="small" />
      </Button>

      {!isMobile &&
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
      }

      <div className="right">
        {isMobile &&
          <span className={spinnerCls}>
            <Icon name="spinner" size="small" />
          </span>
        }

        {isMobile &&
          <Button
            type="header"
            onClick={onOpenExternalClick}
            disabled={!entry}
            title="Open story in new browser tab or window">
            <EarthSVGIcon color="light-gray" size="small" />
          </Button>
        }

        <Dropdown className={dropdownCls}>
          <DropdownTrigger className="btn btn-header">
            {isMobile && <EllipsisSVGIcon color="light-gray" size="small" />}
            {!isMobile && <NewspaperSVGIcon color="light-gray" size="small" />}
            {!isMobile && <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down" />}
            {!isMobile && <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up" />}
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
              {isMobile && entry &&
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
            </ul>
          </DropdownContent>
        </Dropdown>

        {!isMobile &&
          <Button
            type="header"
            onClick={onOpenExternalClick}
            disabled={!entry}
            title="Open story in new browser tab or window">
            <EarthSVGIcon color="light-gray" size="small" />
          </Button>
        }
        {!isMobile &&
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
        }
      </div>
      <span className={spinnerCls}>
        <Icon name="spinner" size="small" />
      </span>
    </div>
  );
};

EntryContentToolbar.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  entry: PropTypes.object,
  currentViewMode: PropTypes.string.isRequired,
  hasPreviousEntry: PropTypes.bool.isRequired,
  hasNextEntry: PropTypes.bool.isRequired,
  onPreviousEntryClick: PropTypes.func.isRequired,
  onNextEntryClick: PropTypes.func.isRequired,
  onOpenExternalClick: PropTypes.func.isRequired,
  onGoBackClick: PropTypes.func.isRequired,
  onChangeViewModeClick: PropTypes.func.isRequired,
  showSpinner: PropTypes.bool.isRequired,
};

export default EntryContentToolbar;
