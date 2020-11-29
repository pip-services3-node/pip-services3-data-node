import { IIdentifiable } from 'pip-services3-commons-node';
import { AnyValueMap } from 'pip-services3-commons-node';
import { MemoryPersistence } from './MemoryPersistence';
import { IWriter } from '../IWriter';
import { IGetter } from '../IGetter';
import { ISetter } from '../ISetter';
import { ILoader } from '../ILoader';
import { ISaver } from '../ISaver';
/**
 * Abstract persistence component that stores data in memory
 * and implements a number of CRUD operations over data items with unique ids.
 * The data items must implement [[https://pip-services3-node.github.io/pip-services3-commons-node/interfaces/data.iidentifiable.html IIdentifiable interface]].
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
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>     (optional) [[https://pip-services3-node.github.io/pip-services3-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
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
export declare class IdentifiableMemoryPersistence<T extends IIdentifiable<K>, K> extends MemoryPersistence<T> implements IWriter<T, K>, IGetter<T, K>, ISetter<T> {
    /**
     * Creates a new instance of the persistence.
     *
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    constructor(loader?: ILoader<T>, saver?: ISaver<T>);
    /**
     * Gets a list of data items retrieved by given unique ids.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be retrieved
     * @param callback         callback function that receives a data list or error.
     */
    getListByIds(correlationId: string, ids: K[], callback: (err: any, items: T[]) => void): void;
    /**
     * Gets a data item by its unique id.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be retrieved.
     * @param callback          callback function that receives data item or error.
     */
    getOneById(correlationId: string, id: K, callback: (err: any, item: T) => void): void;
    /**
     * Creates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @param callback          (optional) callback function that receives created item or error.
     */
    create(correlationId: string, item: T, callback?: (err: any, item: T) => void): void;
    /**
     * Sets a data item. If the data item exists it updates it,
     * otherwise it create a new data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              a item to be set.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    set(correlationId: string, item: T, callback?: (err: any, item: T) => void): void;
    /**
     * Updates a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be updated.
     * @param callback          (optional) callback function that receives updated item or error.
     */
    update(correlationId: string, item: T, callback?: (err: any, item: T) => void): void;
    /**
     * Updates only few selected fields in a data item.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of data item to be updated.
     * @param data              a map with fields to be updated.
     * @param callback          callback function that receives updated item or error.
     */
    updatePartially(correlationId: string, id: K, data: AnyValueMap, callback?: (err: any, item: T) => void): void;
    /**
     * Deleted a data item by it's unique id.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param id                an id of the item to be deleted
     * @param callback          (optional) callback function that receives deleted item or error.
     */
    deleteById(correlationId: string, id: K, callback?: (err: any, item: T) => void): void;
    /**
     * Deletes multiple data items by their unique ids.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param ids               ids of data items to be deleted.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    deleteByIds(correlationId: string, ids: K[], callback?: (err: any) => void): void;
}
