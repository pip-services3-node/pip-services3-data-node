"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module persistence */
/** @hidden */
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const MemoryPersistence_1 = require("./MemoryPersistence");
/**
 * Abstract persistence component that stores data in memory
 * and implements a number of CRUD operations over data items with unique ids.
 * The data items must implement [[https://rawgit.com/pip-services-node/pip-services3-commons-node/master/doc/api/interfaces/data.iidentifiable.html IIdentifiable interface]].
 *
 * In basic scenarios child classes shall only override [[getPageByFilter]],
 * [[getListByFilter]] or [[deleteByFilter]] operations with specific filter function.
 * All other operations can be used out of the box.
 *
 * In complex scenarios child classes can implement additional operations by
 * accessing cached items via this._items property and calling [[save]] method
 * on updates.
 *
 * @see [[MemoryPersistence]]
 *
 * ### Configuration parameters ###
 *
 * - options:
 *     - max_page_size:       Maximum number of items returned in a single page (default: 100)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>     (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/log.ilogger.html ILogger]] components to pass log messages
 *
 * ### Examples ###
 *
 *     class MyMemoryPersistence extends IdentifiableMemoryPersistence<MyData, string> {
 *
 *         private composeFilter(filter: FilterParams): any {
 *             filter = filter || new FilterParams();
 *             let name = filter.getAsNullableString("name");
 *             return (item) => {
 *                 if (name != null && item.name != name)
 *                     return false;
 *                 return true;
 *             };
 *         }
 *
 *         public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
 *                 callback: (err: any, page: DataPage<MyData>) => void): void {
 *             super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
 *         }
 *
 *     }
 *
 *     let persistence = new MyMemoryPersistence();
 *
 *     persistence.create("123", { id: "1", name: "ABC" }, (err, item) => {
 *         persistence.getPageByFilter(
 *             "123",
 *             FilterParams.fromTuples("name", "ABC"),
 *             null,
 *             (err, page) => {
 *                 console.log(page.data);          // Result: { id: "1", name: "ABC" }
 *
 *                 persistence.deleteById("123", "1", (err, item) => {
 *                     ...
 *                 });
 *             }
 *         )
 *     });
 */
class IdentifiableMemoryPersistence extends MemoryPersistence_1.MemoryPersistence {
    /**
     * Creates a new instance of the persistence.
     *
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    constructor(loader, saver) {
        super(loader, saver);
        this._maxPageSize = 100;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
    }
    /**
     * Gets a page of data items retrieved by a given filter and sorted according to sort parameters.
     *
     * This method shall be called by a public getPageByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items
     * @param paging            (optional) paging parameters
     * @param sort              (optional) sorting parameters
     * @param select            (optional) projection parameters (not used yet)
     * @param callback          callback function that receives a data page or error.
     */
    getPageByFilter(correlationId, filter, paging, sort, select, callback) {
        let items = this._items;
        // Filter and sort
        if (_.isFunction(filter))
            items = _.filter(items, filter);
        if (_.isFunction(sort))
            items = _.sortBy(items, sort);
        // Extract a page
        paging = paging != null ? paging : new pip_services3_commons_node_1.PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);
        let total = null;
        if (paging.total)
            total = items.length;
        if (skip > 0)
            items = _.slice(items, skip);
        items = _.take(items, take);
        this._logger.trace(correlationId, "Retrieved %d items", items.length);
        let page = new pip_services3_commons_node_2.DataPage(items, total);
        callback(null, page);
    }
    /**
     * Gets a list of data items retrieved by a given filter and sorted according to sort parameters.
     *
     * This method shall be called by a public getListByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param correlationId    (optional) transaction id to trace execution through call chain.
     * @param filter           (optional) a filter function to filter items
     * @param paging           (optional) paging parameters
     * @param sort             (optional) sorting parameters
     * @param select           (optional) projection parameters (not used yet)
     * @param callback         callback function that receives a data list or error.
     */
    getListByFilter(correlationId, filter, sort, select, callback) {
        let items = this._items;
        // Apply filter
        if (_.isFunction(filter))
            items = _.filter(items, filter);
        // Apply sorting
        if (_.isFunction(sort))
            items = _.sortBy(items, sort);
        this._logger.trace(correlationId, "Retrieved %d items", items.length);
        callback(null, items);
    }
    /**
     * Gets a list of data items retrieved by given unique ids.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @param callback         callback function that receives a data list or error.
     */
    getListByIds(correlationId, ids, callback) {
        let filter = (item) => {
            return _.indexOf(ids, item.id) >= 0;
        };
        this.getListByFilter(correlationId, filter, null, null, callback);
    }
    /**
     * Gets a random item from items that match to a given filter.
     *
     * This method shall be called by a public getOneRandom method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items.
     * @param callback          callback function that receives a random item or error.
     */
    getOneRandom(correlationId, filter, callback) {
        let items = this._items;
        // Apply filter
        if (_.isFunction(filter))
            items = _.filter(items, filter);
        let item = items.length > 0 ? _.sample(items) : null;
        if (item != null)
            this._logger.trace(correlationId, "Retrieved a random item");
        else
            this._logger.trace(correlationId, "Nothing to return as random item");
        callback(null, item);
    }
    /**
     * Gets a data item by its unique id.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @param callback          callback function that receives data item or error.
     */
    getOneById(correlationId, id, callback) {
        let items = this._items.filter((x) => { return x.id == id; });
        let item = items.length > 0 ? items[0] : null;
        if (item != null)
            this._logger.trace(correlationId, "Retrieved item %s", id);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", id);
        callback(null, item);
    }
    /**
     * Creates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @param callback          (optional) callback function that receives created item or error.
     */
    create(correlationId, item, callback) {
        item = _.clone(item);
        if (item.id == null)
            pip_services3_commons_node_3.ObjectWriter.setProperty(item, "id", pip_services3_commons_node_4.IdGenerator.nextLong());
        this._items.push(item);
        this._logger.trace(correlationId, "Created item %s", item.id);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err, item);
        });
    }
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    set(correlationId, item, callback) {
        item = _.clone(item);
        if (item.id == null)
            pip_services3_commons_node_3.ObjectWriter.setProperty(item, "id", pip_services3_commons_node_4.IdGenerator.nextLong());
        let index = this._items.map((x) => { return x.id; }).indexOf(item.id);
        if (index < 0)
            this._items.push(item);
        else
            this._items[index] = item;
        this._logger.trace(correlationId, "Set item %s", item.id);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err, item);
        });
    }
    /**
     * Updates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    update(correlationId, item, callback) {
        let index = this._items.map((x) => { return x.id; }).indexOf(item.id);
        if (index < 0) {
            this._logger.trace(correlationId, "Item %s was not found", item.id);
            callback(null, null);
            return;
        }
        item = _.clone(item);
        this._items[index] = item;
        this._logger.trace(correlationId, "Updated item %s", item.id);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err, item);
        });
    }
    /**
     * Updates only few selected fields in a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @param callback          callback function that receives updated item or error.
     */
    updatePartially(correlationId, id, data, callback) {
        let index = this._items.map((x) => { return x.id; }).indexOf(id);
        if (index < 0) {
            this._logger.trace(correlationId, "Item %s was not found", id);
            callback(null, null);
            return;
        }
        let item = this._items[index];
        item = _.extend(item, data.getAsObject());
        this._items[index] = item;
        this._logger.trace(correlationId, "Partially updated item %s", id);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err, item);
        });
    }
    /**
     * Deleted a data item by it's unique id.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @param callback          (optional) callback function that receives deleted item or error.
     */
    deleteById(correlationId, id, callback) {
        var index = this._items.map((x) => { return x.id; }).indexOf(id);
        var item = this._items[index];
        if (index < 0) {
            this._logger.trace(correlationId, "Item %s was not found", id);
            callback(null, null);
            return;
        }
        this._items.splice(index, 1);
        this._logger.trace(correlationId, "Deleted item by %s", id);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err, item);
        });
    }
    /**
     * Deletes data items that match to a given filter.
     *
     * This method shall be called by a public deleteByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    deleteByFilter(correlationId, filter, callback) {
        let deleted = 0;
        for (let index = this._items.length - 1; index >= 0; index--) {
            let item = this._items[index];
            if (filter(item)) {
                this._items.splice(index, 1);
                deleted++;
            }
        }
        if (deleted == 0) {
            callback(null);
            return;
        }
        this._logger.trace(correlationId, "Deleted %s items", deleted);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
    /**
     * Deletes multiple data items by their unique ids.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    deleteByIds(correlationId, ids, callback) {
        let filter = (item) => {
            return _.indexOf(ids, item.id) >= 0;
        };
        this.deleteByFilter(correlationId, filter, callback);
    }
}
exports.IdentifiableMemoryPersistence = IdentifiableMemoryPersistence;
//# sourceMappingURL=IdentifiableMemoryPersistence.js.map