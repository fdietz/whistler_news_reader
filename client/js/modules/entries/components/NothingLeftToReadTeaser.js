import React, { PropTypes } from 'react';

import { Link } from 'react-router';
import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import Teaser from '../../../components/Teaser';

import { CheckmarkSVGIcon } from '../../../components/SVGIcon';

const NothingLeftToReadTeaser = function render({ toolbar, onRefresh }) {
  return (
    <LayoutContainer>
      <LayoutHeader>{toolbar}</LayoutHeader>
      <LayoutContent>
        <Teaser>
          <CheckmarkSVGIcon size="xxlarge" color="gray" />
          <h2>Nothing left to read here</h2>
          <p>
            You can try to <a onClick={onRefresh}>refresh</a> or
            <Link to={{ pathname: '/feeds/new', state: { modal: true } }}>subscribe</Link>
            to new feeds.
          </p>
        </Teaser>
      </LayoutContent>
    </LayoutContainer>
  );
};

NothingLeftToReadTeaser.propTypes = {
  toolbar: PropTypes.node,
  onRefresh: PropTypes.func
};

export default NothingLeftToReadTeaser;
