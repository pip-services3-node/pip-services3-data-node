/** @module core */
import { SortParams } from 'pip-services3-commons-node';

/**
 * Interface for data processing components that can query a list of data items.
 */
export interface IQuerableReader<T> {
    /**
     * Gets a list of data items using a query string.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param query             (optional) a query string
     * @param sort              (optional) sort parameters
     * @param callback          callback function that receives list of items or error.
     */
    getListByQuery(correlation_id: string, query: string, sort: SortParams, callback: (err: any, items: T[]) => void): void;
}
