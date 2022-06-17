import React, { Fragment } from 'react';
import spinner from './loading.svg';
// import spinner from './unnamed.gif';

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{  margin: 'auto', display: 'block' }}
      alt='Loading...'
    />
  </Fragment>
);
