import React from 'react';

import LayoutHeader from 'layouts/LayoutHeader';
import LayoutContent from 'layouts/LayoutContent';
import Teaser from 'components/Teaser';

import { EarthSVGIcon } from 'components/SVGIcon';

const NoArticleSelectedTeaser = function render() {
  return (
    <div className="layout-master-container hide-small-screen">
      <LayoutHeader />
      <LayoutContent>
        <Teaser>
          <EarthSVGIcon size="xxlarge" color="gray" />
          <h2>Moin moin from Hamburg</h2>
          <p>Have a nice day!</p>
        </Teaser>
      </LayoutContent>
    </div>
  );
};

export default NoArticleSelectedTeaser;
