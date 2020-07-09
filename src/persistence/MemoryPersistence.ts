const _ = require('lodash');

/** @module persistence */
import { IReferenceable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IOpenable } from 'pip-services3-commons-node';
import { ICleanable } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
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
 * ### Configuration parameters ###
 * 
 * - options:
 *     - max_page_size:       Maximum number of items returned in a single page (default: 100)
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
export class MemoryPersistence<T> implements IConfigurable, IReferenceable, IOpenable, ICleanable {
    protected _logger: CompositeLogger = new CompositeLogger();
    protected _items: T[] = [];
    protected _loader: ILoader<T>;
    protected _saver: ISaver<T>;
    protected _opened: boolean = false;
    protected _maxPageSize: number = 100;

    /**
     * Creates a new instance of the persistence.
     * 
     * @param loader    (optional) a loader to load items from external datasource.
     * @param saver     (optional) a saver to save items to external datasource.
     */
    public constructor(loader?: ILoader<T>, saver?: ISaver<T>) {
        this._loader = loader;
        this._saver = saver;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._maxPageSize = config.getAsIntegerWithDefault("options.max_page_size", this._maxPageSize);
    }

    /**
	 * Sets references to dependent components.
	 * 
	 * @param references 	references to locate the component dependencies. 
     */
    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
    }

    /**
	 * Checks if the component is opened.
	 * 
	 * @returns true if the component has been opened and false otherwise.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
	 * Opens the component.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public open(correlationId: string,  callback?: (err: any) => void): void {
        this.load(correlationId, (err) => {
            this._opened = true;
            if (callback) callback(err);
        });
    }

    private load(correlationId: string, callback?: (err: any) => void): void {
        if (this._loader == null) {
            if (callback) callback(null);
            return;
        }
            
        this._loader.load(correlationId, (err: any, items: T[]) => {
            if (err == null) {
                this._items = items;
                this._logger.trace(correlationId, "Loaded %d items", this._items.length);
            }
            if (callback) callback(err);
        });
    }

    /**
	 * Closes component and frees used resources.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public close(correlationId: string, callback?: (err: any) => void): void {
        this.save(correlationId, (err) => {
            this._opened = false;
            
            if (callback) callback(err);
        });
    }

    /**
     * Saves items to external data source using configured saver component.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param callback          (optional) callback function that receives error or null for success.
     */
    public save(correlationId: string, callback?: (err: any) => void): void {
        if (this._saver == null) {
            if (callback) callback(null);
            return;
        }

        let task = this._saver.save(correlationId, this._items, (err: any) => {
            if (err == null)
                this._logger.trace(correlationId, "Saved %d items", this._items.length);

            if (callback) callback(err);
        });
    }

    /**
	 * Clears component state.
	 * 
	 * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    public clear(correlationId: string, callback?: (err?: any) => void): void {
        this._items = [];
        this._logger.trace(correlationId, "Cleared items");
        this.save(correlationId, callback);
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
    protected getPageByFilter(correlationId: string, filter: any, 
        paging: PagingParams, sort: any, select: any, 
        callback: (err: any, page: DataPage<T>) => void): void {
        
        let items = this._items;

        // Filter and sort
        if (_.isFunction(filter))
            items = _.filter(items, filter);
        if (_.isFunction(sort))
            items = _.sortBy(items, sort);

        // Extract a page
        paging = paging != null ? paging : new PagingParams();
        let skip = paging.getSkip(-1);
        let take = paging.getTake(this._maxPageSize);

        let total = null;
        if (paging.total)
            total = items.length;
        
        if (skip > 0)
            items = _.slice(items, skip);
        items = _.take(items, take);
        
        this._logger.trace(correlationId, "Retrieved %d items", items.length);
        
        let page = new DataPage<T>(items, total);
        callback(null, page);
    }

    /**
     * Gets a number of items retrieved by a given filter.
     * 
     * This method shall be called by a public getCountByFilter method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items
     * @param callback          callback function that receives a data page or error.
     */
    protected getCountByFilter(correlationId: string, filter: any, 
        callback: (err: any, count: number) => void): void {
        
        let items = this._items;

        // Filter and sort
        if (_.isFunction(filter))
            items = _.filter(items, filter);

        this._logger.trace(correlationId, "Counted %d items", items.length);
        
        callback(null, items.length);
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
    protected getListByFilter(correlationId: string, filter: any, sort: any, select: any,
        callback: (err: any, items: T[]) => void): void {
        
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
     * Gets a random item from items that match to a given filter.
     * 
     * This method shall be called by a public getOneRandom method from child class that
     * receives FilterParams and converts them into a filter function.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param filter            (optional) a filter function to filter items.
     * @param callback          callback function that receives a random item or error.
     */
    protected getOneRandom(correlationId: string, filter: any, callback: (err: any, item: T) => void): void {
        let items = this._items;

        // Apply filter
        if (_.isFunction(filter))
            items = _.filter(items, filter);

        let item: T = items.length > 0 ? _.sample(items) : null;
        
        if (item != null)
            this._logger.trace(correlationId, "Retrieved a random item");
        else
            this._logger.trace(correlationId, "Nothing to return as random item");
                        
        callback(null, item);
    }

    /**
     * Creates a data item.
     * 
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param item              an item to be created.
     * @param callback          (optional) callback function that receives created item or error.
     */
    public create(correlationId: string, item: T, callback?: (err: any, item: T) => void): void {
        item = _.clone(item);

        this._items.push(item);
        this._logger.trace(correlationId, "Created item %s", item['id']);

        this.save(correlationId, (err) => {
            if (callback) callback(err, item)
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
    protected deleteByFilter(correlationId: string, filter: any, callback?: (err: any) => void): void {
        let deleted = 0;
        for (let index = this._items.length - 1; index>= 0; index--) {
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
            if (callback) callback(err)
        });
    }

}
