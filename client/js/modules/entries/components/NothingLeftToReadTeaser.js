import React from 'react';

import { Link } from 'react-router';
import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import Teaser from '../../../components/Teaser';

import { CheckmarkSVGIcon } from '../../../components/SVGIcon';

const NothingLeftToReadTeaser = function render({ toolbar, onRefresh }) {
  console.log(">", toolbar)
  return (
    <div className="layout-master-container">
      <LayoutHeader>{toolbar}</LayoutHeader>
      <LayoutContent>
        <Teaser>
          <CheckmarkSVGIcon size="xxlarge" color="gray" />
          <h2>Nothing left to read here</h2>
          <p>
            You can try to <a href="#" onClick={onRefresh}>refresh</a> or <Link to={{ pathname: '/feeds/new', state: { modal: true } }}>subscribe</Link> to new feeds.
          </p>
        </Teaser>
      </LayoutContent>
    </div>
  );
};

export default NothingLeftToReadTeaser;
