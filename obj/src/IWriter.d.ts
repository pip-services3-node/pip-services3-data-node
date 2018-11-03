/**
 * Interface for data processing components that can create, update and delete data items.
 */
export interface IWriter<T, K> {
    /**
     * Creates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @param callback          (optional) callback function that receives created item or error.
     */
    create(correlation_id: string, item: T, callback?: (err: any, item: T) => void): void;
    /**
     * Updates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    update(correlation_id: string, item: T, callback?: (err: any, item: T) => void): void;
    /**
     * Deleted a data item by it's unique id.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @param callback          (optional) callback function that receives deleted item or error.
     */
    deleteById(correlation_id: string, id: K, callback?: (err: any, item: T) => void): void;
}
