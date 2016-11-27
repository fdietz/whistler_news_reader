import React from 'react';

import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import Teaser from '../../../components/Teaser';

import { EarthSVGIcon } from '../../../components/SVGIcon';

const NoArticleSelectedTeaser = function render() {
  return (
    <LayoutContainer>
      <LayoutHeader />
      <LayoutContent>
        <Teaser>
          <EarthSVGIcon size="xxlarge" color="gray" />
          <h2>Moin moin from Hamburg</h2>
          <p>Have a nice day!</p>
        </Teaser>
      </LayoutContent>
    </LayoutContainer>
  );
};

export default NoArticleSelectedTeaser;
