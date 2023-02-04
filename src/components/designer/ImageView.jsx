import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentStore from 'src/helpers/componentStore';
import { SectionMapper } from '../../mapper/SectionMapper';
import { LabelDesigner } from 'components/designer/Label.jsx';
import { CellDesigner } from 'components/designer/Cell.jsx';

export class ImageViewDesigner extends Component {

  constructor(props) {
    super(props);
    this.metadata = props.metadata;
    this.mapper = new SectionMapper();
    this.storeLabelRef = this.storeLabelRef.bind(this);
    this.deleteControl = this.deleteControl.bind(this);
  }

   getJsonDefinition() {
    const labelJsonDefinition = this.labelControl && this.labelControl.getJsonDefinition();
    return Object.assign({}, this.props.metadata, {}, { label: labelJsonDefinition });
  }

  storeLabelRef(ref) {
    this.labelControl = ref;
  }

  displayLabel() {
    const { metadata: { label, id } } = this.props;
    const data = Object.assign({}, label, { id });
    return (
      <LabelDesigner
        metadata={ data }
        ref={ this.storeLabelRef }
        showDeleteButton={ false }
      />
    );
  }

  deleteControl(event) {
    this.props.deleteControl();
    this.props.clearSelectedControl(event);
  }

  showDeleteButton() {
    if (this.props.showDeleteButton) {
      return (
        <button className="remove-control-button" onClick={this.deleteControl}>
          <i aria-hidden="true" className="fa fa-trash"></i>
        </button>
      );
    }
    return null;
  }

  stopEventPropagation(event) {
    this.props.dispatch();
    event.stopPropagation();
  }

  render() {
    const { metadata } = this.props;
    return (
        <div
          className="control-wrapper-content"
          onClick={(event) => {
            this.stopEventPropagation(event);
            this.props.onSelect(event, metadata);
          }}
        >
          {this.showDeleteButton()}
          {this.displayLabel()}
        </div>
    );
  }
}

ImageViewDesigner.propTypes = {
  clearSelectedControl: PropTypes.func.isRequired,
  deleteControl: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
  metadata: PropTypes.shape({
    displayType: PropTypes.string,
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.object,
    properties: PropTypes.shape({
      location: PropTypes.shape({
        row: PropTypes.number,
        column: PropTypes.number,
      }),
    }),
    type: PropTypes.string.isRequired,
  }),
  onSelect: PropTypes.func.isRequired,
  showDeleteButton: PropTypes.bool,
};

const descriptor = {
  control: ImageViewDesigner,
  designProperties: {
    displayName: 'Image View',
    isTopLevelComponent: true,
  },
  metadata: {
    attributes: [
      {
        name: 'type',
        dataType: 'text',
        defaultValue: 'imageView',
      },
      {
        name: 'value',
        dataType: 'text',
        defaultValue: 'ImageView',
      },
      {
        name: 'label',
        dataType: 'complex',
        attributes: [
          {
            name: 'type',
            dataType: 'text',
            defaultValue: 'label',
          },
          {
            name: 'value',
            dataType: 'text',
            defaultValue: 'ImageView',
          },
        ],
      },
      {
        name: 'properties',
        dataType: 'complex',
        attributes: [
          {
            name: 'position',
            elementType: 'dropdown',
            defaultValue: 'left',
            options: [
              'left',
              'center',
              'right',
            ],
          },
          {
            name: 'maxWidth',
            elementType: 'number',
            defaultValue: 100,
          },
          {
            name: 'maxHeight',
            elementType: 'number',
            defaultValue: 100,
          },
        ],
      },
    ],
  },
};

ComponentStore.registerDesignerComponent('imageView', descriptor);
