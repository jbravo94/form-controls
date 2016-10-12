import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { CellDesigner } from 'components/designer/Cell.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Cell', () => {
  let eventData;
  const testContext = {
    type: 'someType',
    data: {
      id: 123,
      properties: {
        location: {
          row: 0,
          column: 0,
        },
      },
    },
  };
  const fakeComponent = () => (<span>TestComponent</span>);
  before(() => {
    eventData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify(testContext),
      },
    };
    window.componentStore.registerDesignerComponent('someType', {
      control: fakeComponent,
    });
    sinon.stub(React, 'cloneElement', e => e);
  });

  after(() => {
    window.componentStore.deRegisterDesignerComponent('someType');
    React.cloneElement.restore();
  });

  it('should be a drop target', () => {
    const cellDesigner = shallow(<CellDesigner onChange={() => {}} />);

    const cell = cellDesigner.find('.cell0');
    expect(cell).to.have.prop('onDrop');

    sinon.spy(eventData, 'preventDefault');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(eventData.preventDefault);
    eventData.preventDefault.restore();
  });

  it('Should call appropriate processDrop when a component is dropped', () => {
    const cellDesigner = shallow(<CellDesigner onChange={() => {}} />);
    const cell = cellDesigner.find('.cell0');

    const cellDesignerInstance = cellDesigner.instance();

    sinon.spy(cellDesignerInstance, 'processDrop');
    cell.props().onDrop(eventData);
    sinon.assert.calledOnce(cellDesignerInstance.processDrop);
    sinon.assert.calledWith(cellDesignerInstance.processDrop, testContext);
    cellDesignerInstance.processDrop.restore();
  });

  it('should render the dropped component', () => {
    const cellDesigner = mount(<CellDesigner onChange={() => {}} >TestComponent</CellDesigner>);
    const cell = cellDesigner.find('.cell0');

    cell.props().onDrop(eventData);

    expect(cellDesigner.text()).to.eql('TestComponent');
  });

  it('Should render multiple copies of child component when components get dropped on it', () => {
    const otherComponent = () => (<span>otherComponent</span>);
    const otherContext = { type: 'otherType',
      data: {
        id: 123,
        properties: {
          location: {
            row: 0,
            column: 0,
          },
        },
      },
    };
    window.componentStore.registerDesignerComponent('otherType', {
      control: otherComponent,
    });
    const otherData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify(otherContext),
      },
    };
    const cellDesigner = mount(<CellDesigner onChange={() => {}} >TestComponent</CellDesigner>);
    const cell = cellDesigner.find('.cell0');
    expect(cellDesigner.text()).to.eql('cell0');

    cell.props().onDrop(eventData);
    expect(cellDesigner.text()).to.eql('TestComponent');

    cell.props().onDrop(otherData);
    expect(cellDesigner.text()).to.eql('TestComponent' + 'TestComponent');

    window.componentStore.deRegisterDesignerComponent('otherType');
  });

  it('should remove the dropped component when moved to different cell', () => {
    const cellDesigner = mount(<CellDesigner onChange={() => {}} />);
    const cell = cellDesigner.find('.cell0');

    cell.props().onDrop(eventData);

    cellDesigner.instance().processMove(testContext);

    expect(cellDesigner.text()).to.eql('cell0');
  });

  it('should remove only the dragged out component', () => {
    const otherComponent = () => (<span>otherComponent</span>);
    const otherContext = { type: 'someType',
      data: {
        id: 345,
        properties: {
          location: {
            row: 0,
            column: 0,
          },
        },
      },
    };
    window.componentStore.registerDesignerComponent('someType', {
      control: otherComponent,
    });
    const otherData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify(otherContext),
      },
    };
    const cellDesigner = mount(<CellDesigner onChange={() => {}} >Wrapper</CellDesigner>);
    const cell = cellDesigner.find('.cell0');

    cell.props().onDrop(eventData);
    cell.props().onDrop(otherData);

    cellDesigner.instance().processMove(testContext);

    expect(cellDesigner.text()).to.eql('Wrapper');
  });

  it('should update the components location to that of cells when dropped', () => {
    const cellDesigner = mount(
        <CellDesigner location={ { column: 10, row: 1 } } onChange={() => {}}>
          TestComponent
        </CellDesigner>
    );
    const cell = cellDesigner.find('.cell22');

    cell.props().onDrop(eventData);
    const cellDefinition = cellDesigner.instance().getCellDefinition();
    expect(cellDesigner.text()).to.eql('TestComponent');
    expect(cellDefinition[0].properties.location).to.deep.eql({ row: 1, column: 10 });
  });
});
