/** @module core */
/**
 * Interface for data processing components that load data items.
 */
export interface ILoader<T> {
    /**
     * Loads data items.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param callback          (optional) callback function that receives a list of data items or error.
     */
    load(correlation_id: string, callback: (err: any, items: T[]) => void): void;
}
