"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
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
class MemoryPersistence {
    /**
     * Creates a new instance of the persistence.
     *
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    constructor(loader, saver) {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._items = [];
        this._opened = false;
        this._loader = loader;
        this._saver = saver;
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        this.load(correlationId, (err) => {
            this._opened = true;
            if (callback)
                callback(err);
        });
    }
    load(correlationId, callback) {
        if (this._loader == null) {
            if (callback)
                callback(null);
            return;
        }
        this._loader.load(correlationId, (err, items) => {
            if (err == null) {
                this._items = items;
                this._logger.trace(correlationId, "Loaded %d items", this._items.length);
            }
            if (callback)
                callback(err);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        this.save(correlationId, (err) => {
            this._opened = false;
            if (callback)
                callback(err);
        });
    }
    /**
     * Saves items to external data source using configured saver component.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    save(correlationId, callback) {
        if (this._saver == null) {
            if (callback)
                callback(null);
            return;
        }
        let task = this._saver.save(correlationId, this._items, (err) => {
            if (err == null)
                this._logger.trace(correlationId, "Saved %d items", this._items.length);
            if (callback)
                callback(err);
        });
    }
    /**
     * Clears component state.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    clear(correlationId, callback) {
        this._items = [];
        this._logger.trace(correlationId, "Cleared items");
        this.save(correlationId, callback);
    }
}
exports.MemoryPersistence = MemoryPersistence;
//# sourceMappingURL=MemoryPersistence.js.map