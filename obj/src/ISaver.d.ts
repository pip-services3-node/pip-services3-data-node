/** @module core */
/**
 * Interface for data processing components that save data items.
 */
export interface ISaver<T> {
    /**
     * Saves given data items.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              a list of items to save.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    save(correlation_id: string, items: T[], callback?: (err?: any) => void): void;
}
