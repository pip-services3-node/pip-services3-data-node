/** @module core */
import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { SortParams } from 'pip-services3-commons-node';

/**
 * Interface for data processing components that can retrieve a page of data items by a filter.
 */
export interface IFilteredPageReader<T> {
    /**
     * Gets a page of data items using filter parameters.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) filter parameters
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sort parameters
     * @param callback          callback function that receives list of items or error.
     */
    getPageByFilter(correlation_id: string, filter: FilterParams, paging: PagingParams, sort: SortParams, 
        callback: (err: any, page: DataPage<T>) => void): void;
}
