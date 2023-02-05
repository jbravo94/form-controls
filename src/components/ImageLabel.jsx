/* eslint-disable react/prefer-stateless-function */
/* Needs this to attach refs as they cannot be attached to stateless functions. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { IntlShape } from 'react-intl';

export class ImageLabel extends Component {

  _getUnits(units) {
    return units ? ` ${units}` : '';
  }

  _computeImageLabelContainerStyle(position) {

    let textAlignPosition;

    switch(position) {
      case "center":
        textAlignPosition = "center";
        break;
      case "right":
        textAlignPosition = "right";
        break;
      case "left":
      default: 
        textAlignPosition = "left";
        break;
    }

    return {
      textAlign: textAlignPosition,
      padding: '15px',
    };
  }

  _computeImageLabelStyle(maxHeight, maxWidth) {

    const maxHeightPercentage = isNaN(maxHeight) ? 100 : maxHeight;
    const maxWidthPercentage = isNaN(maxWidth) ? 100 : maxWidth;

    return {
      maxHeight: maxHeightPercentage + 'vh',
      maxWidth: maxWidthPercentage + '%'
    };
  }

  render() {
    const { intl, enabled, metadata: { value, units, maxHeight, maxWidth, position } } = this.props;

    const imageUrl = `/bahmni/images/clinical_forms/${value}`;

    const disableClass = enabled ? '' : 'disabled-label';
    return (<div
      className={`image-label-container ${disableClass}`} style={this._computeImageLabelContainerStyle(position)}
    >
      <img className="image-label" src={imageUrl} style={this._computeImageLabelStyle(maxHeight, maxWidth)} />
    </div>
    );
  }
}

ImageLabel.propTypes = {
  enabled: PropTypes.bool,
  hidden: PropTypes.bool,
  intl: IntlShape,
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    units: PropTypes.string,
    value: PropTypes.string.isRequired,
    translationKey: PropTypes.string,
    maxHeight: PropTypes.number,
    maxWidth: PropTypes.number,
    position: PropTypes.string
  }),
};

ImageLabel.defaultProps = {
  hidden: false,
  enabled: true,
};

ComponentStore.registerComponent('imageLabel', ImageLabel);
/* eslint-enable react/prefer-stateless-function */
