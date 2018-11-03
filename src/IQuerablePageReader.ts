/** @module core */
import { DataPage } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { SortParams } from 'pip-services3-commons-node';

/**
 * Interface for data processing components that can query a page of data items.
 */
export interface IQuerablePageReader<T> {
    /**
     * Gets a page of data items using a query string.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param query             (optional) a query string
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sort parameters
     * @param callback          callback function that receives list of items or error.
     */
    getPageByQuery(correlation_id: string, query: string, paging: PagingParams, sort: SortParams, 
        callback: (err: any, page: DataPage<T>) => void): void;
}
