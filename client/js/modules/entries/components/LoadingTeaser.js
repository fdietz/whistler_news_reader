import React, { PropTypes } from 'react';

import { Link } from 'react-router';

import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import Teaser from '../../../components/Teaser';
import Icon from '../../../components/Icon';

import { EarthSVGIcon } from '../../../components/SVGIcon';

const LoadingTeaser = function render({ toolbar }) {
  return (
    <LayoutContainer>
      <LayoutHeader>
        {toolbar}
      </LayoutHeader>
      <LayoutContent>
        <Teaser>
          <EarthSVGIcon size="xxlarge" color="gray" />
          <h1>Welcome to whistle'r news reader</h1>
          <h2>Loading...</h2>
          <span className="spinner spinner-blink">
            <Icon name="spinner_white" size="small" />
          </span>
        </Teaser>
      </LayoutContent>
    </LayoutContainer>
  );
};

LoadingTeaser.propTypes = {
  toolbar: PropTypes.node
};

export default LoadingTeaser;
