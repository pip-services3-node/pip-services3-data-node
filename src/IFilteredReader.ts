/** @module core */
import { FilterParams } from 'pip-services3-commons-node';
import { SortParams } from 'pip-services3-commons-node';

/**
 * Interface for data processing components that can retrieve a list of data items by filter.
 */
export interface IFilteredReader<T> {
    /**
     * Gets a list of data items using filter parameters.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param filter             (optional) filter parameters
     * @param sort              (optional) sort parameters
     * @param callback          callback function that receives list of items or error.
     */
    getListByFilter(correlation_id: string, filter: FilterParams, sort: SortParams, 
        callback: (err: any, items: T[]) => void): void;
}
