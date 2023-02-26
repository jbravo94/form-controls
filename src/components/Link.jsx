/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { IntlShape } from 'react-intl';
import classNames from 'classnames';

export class Link extends Component {

  render() {
    const { intl, enabled, metadata: { label: { value: name}, link: { value: url } } } = this.props;

    return (
      <a class="fa link" href={url} target="_blank">
              {name}
              <i class="fa fa-external-link"></i>
            </a>
      /*
      <div className={classNames('form-field-wrap clearfix')}>
        <div className="form-field-content-wrap">
          <div className="label-wrap fl">
            Link
          </div>
          <div className={classNames('obs-control-field')}>
            <a class="fa link" href={url} target="_blank">
              {name}
              <i class="fa fa-external-link"></i>
            </a>
          </div>
        </div>
      </div>
      */
    );
    
  }
}

Link.propTypes = {
  intl: IntlShape,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.object,
    link: PropTypes.object,
    translationKey: PropTypes.string,
    properties: PropTypes.object,
  }),
};

Link.defaultProps = {
};

ComponentStore.registerComponent('link', Link);
/* eslint-enable react/prefer-stateless-function */
