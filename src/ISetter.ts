/** @module core */

/**
 * Interface for data processing components that can set (create or update) data items.
 */
export interface ISetter<T> {
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    set(correlation_id: string, item: T, callback?: (err: any, item: T) => void): void;
}
