import { ServerRespond } from './DataStreamer';
/**
 * This file is responsible for processing the raw stock data from the server
 */

//Adjust this interface to properly determine the structure of the object from the generateRow function
export interface Row {
  price_abc: number, 
  price_def: number, 
  ratio: number,
  timestamp: Date, 
  upper_bound: number, 
  lower_bound: number, 
  trigger_alert: number | undefined, 
}

//Update the function to properly process raw server data
export class DataManipulator {
  //find the prices, compute the ratio, then determine the trigger alert
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2; 
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2; 
    const ratio = priceABC / priceDEF; 
    const upperBound = 1 + 0.05; 
    const lowerBound = 1 - 0.05;
    return { 
      price_abc: priceABC, 
      price_def: priceDEF, 
      ratio, 
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
      serverRespond[0].timestamp : serverRespond[1].timestamp, 
      upper_bound: upperBound, 
      lower_bound: lowerBound, 
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined, 
    }; 
    }
  }

  /**
   * We can now access serverRespond as an array whose first element is the ABC stock and the second element is the DEF stock 
   * and the return value is now a single Row object rather than an array
   */