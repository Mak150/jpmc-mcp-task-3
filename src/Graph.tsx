import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';
/**
 * The Graph file determines how the Graph component of our App will 
 * be rendered and reactive to state changes. 
 */
interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  /**
   * Here, I need to modify the schema object to configure the perspective table 
   * view of the graph. 
   */
  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;
//Adjust the object to include ratio, stock prices, bounds, trigger alert, and time stamp fields 
    const schema = {
      price_abc: 'float', 
      price_def: 'float', 
      ratio: 'float',
      timestamp: 'date', 
      upper_bound: 'float', 
      lower_bound: 'float', 
      trigger_alert: 'float', 
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Adjust and add more attributes to appropriately configure the graph 
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg', 
        price_def: 'avg', 
        ratio: 'avg',
        timestamp: 'distinct count', 
        upper_bound: 'avg', 
        lower_bound: 'avg', 
        trigger_alert: 'avg', 
      }));
    }
  }

  //This method should update when the graph gets new data 
  componentDidUpdate() {
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

export default Graph;
