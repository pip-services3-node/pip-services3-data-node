import { IConfigurable } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { ILoader } from '../ILoader';
import { ISaver } from '../ISaver';
/**
 * Persistence component that loads and saves data from/to flat file.
 *
 * It is used by [[FilePersistence]], but can be useful on its own.
 *
 * ### Configuration parameters ###
 *
 * - path:          path to the file where data is stored
 *
 * ### Example ###
 *
 *     let persister = new JsonFilePersister("./data/data.json");
 *
 *     persister.save("123", ["A", "B", "C"], (err) => {
 *         ...
 *         persister.load("123", (err, items) => {
 *             console.log(items);                      // Result: ["A", "B", "C"]
 *         });
 *     });
 */
export declare class JsonFilePersister<T> implements ILoader<T>, ISaver<T>, IConfigurable {
    private _path;
    /**
     * Creates a new instance of the persistence.
     *
     * @param path  (optional) a path to the file where data is stored.
     */
    constructor(path?: string);
    /**
     * Gets the file path where data is stored.
     *
     * @returns the file path where data is stored.
     */
    /**
    * Sets the file path where data is stored.
    *
    * @param value     the file path where data is stored.
    */
    path: string;
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Loads data items from external JSON file.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param callback          callback function that receives loaded items or error.
     */
    load(correlation_id: string, callback: (err: any, data: T[]) => void): void;
    /**
     * Saves given data items to external JSON file.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param items             list if data items to save
     * @param callback          callback function that error or null for success.
     */
    save(correlation_id: string, items: T[], callback?: (err: any) => void): void;
}
