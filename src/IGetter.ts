/** @module core */
import { IIdentifiable } from 'pip-services3-commons-node';

/**
 * Interface for data processing components that can get data items.
 */
export interface IGetter<T extends IIdentifiable<K>, K> {
    /**
     * Gets a data items by its unique id.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of item to be retrieved.
     * @param callback          callback function that receives an item or error.
     */
    getOneById(correlation_id: string, id: K, callback: (err: any, item: T) => void): void;
}
