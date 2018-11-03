/** @module core */
import { AnyValueMap } from 'pip-services3-commons-node';

/**
 * Interface for data processing components to update data items partially.
 */
export interface IPartialUpdater<T, K> {
    /**
     * Updates only few selected fields in a data item.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @param callback          callback function that receives updated item or error.
     */
    updatePartially(correlation_id: string, id: K, data: AnyValueMap, callback?: (err: any, item: T) => void): void;
}
