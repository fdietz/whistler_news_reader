import React, { PropTypes } from 'react';

import { Link } from 'react-router';

import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import Teaser from '../../../components/Teaser';

import { EarthSVGIcon } from '../../../components/SVGIcon';

const WelcomeTeaser = function render({ toolbar }) {
  return (
    <LayoutContainer>
      <LayoutHeader>
        {toolbar}
      </LayoutHeader>
      <LayoutContent>
        <Teaser>
          <EarthSVGIcon size="xxlarge" color="gray" />
          <h1>Welcome to whistle'r news reader</h1>
          <h2>This is exciting!</h2>
          <p>
            Let's get started and
            <Link to={{ pathname: '/opml_import', state: { modal: true } }}>import</Link>
            or
            <Link to={{ pathname: '/feeds/new', state: { modal: true } }}>subscribe</Link>
            to new feeds.
          </p>
        </Teaser>
      </LayoutContent>
    </LayoutContainer>
  );
};

WelcomeTeaser.propTypes = {
  toolbar: PropTypes.node
};

export default WelcomeTeaser;
