/** @module persistence */
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { ICleanable } from 'pip-services3-commons-node';
import { CompositeLogger } from 'pip-services3-components-node';
import { ILoader } from '../ILoader';
import { ISaver } from '../ISaver';
/**
 * Abstract persistence component that stores data in memory.
 *
 * This is the most basic persistence component that is only
 * able to store data items of any type. Specific CRUD operations
 * over the data items must be implemented in child classes by
 * accessing <code>this._items</code> property and calling [[save]] method.
 *
 * The component supports loading and saving items from another data source.
 * That allows to use it as a base class for file and other types
 * of persistence components that cache all data in memory.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>       (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/log.ilogger.html ILogger]] components to pass log messages
 *
 * ### Example ###
 *
 *     class MyMemoryPersistence extends MemoryPersistence<MyData> {
 *
 *         public getByName(correlationId: string, name: string, callback: (err, item) => void): void {
 *             let item = _.find(this._items, (d) => d.name == name);
 *             callback(null, item);
 *         });
 *
 *         public set(correlatonId: string, item: MyData, callback: (err) => void): void {
 *             this._items = _.filter(this._items, (d) => d.name != name);
 *             this._items.push(item);
 *             this.save(correlationId, callback);
 *         }
 *
 *     }
 *
 *     let persistence = new MyMemoryPersistence();
 *
 *     persistence.set("123", { name: "ABC" }, (err) => {
 *         persistence.getByName("123", "ABC", (err, item) => {
 *             console.log(item);                   // Result: { name: "ABC" }
 *         });
 *     });
 */
export declare class MemoryPersistence<T> implements IReferenceable, IOpenable, ICleanable {
    protected _logger: CompositeLogger;
    protected _items: T[];
    protected _loader: ILoader<T>;
    protected _saver: ISaver<T>;
    protected _opened: boolean;
    /**
     * Creates a new instance of the persistence.
     *
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    constructor(loader?: ILoader<T>, saver?: ISaver<T>);
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references: IReferences): void;
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen(): boolean;
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId: string, callback?: (err: any) => void): void;
    private load;
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId: string, callback?: (err: any) => void): void;
    /**
     * Saves items to external data source using configured saver component.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    save(correlationId: string, callback?: (err: any) => void): void;
    /**
     * Clears component state.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    clear(correlationId: string, callback?: (err?: any) => void): void;
}
