"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module persistence */
/** @hidden */
const fs = require('fs');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
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
class JsonFilePersister {
    /**
     * Creates a new instance of the persistence.
     *
     * @param path  (optional) a path to the file where data is stored.
     */
    constructor(path) {
        this._path = path;
    }
    /**
     * Gets the file path where data is stored.
     *
     * @returns the file path where data is stored.
     */
    get path() {
        return this._path;
    }
    /**
     * Sets the file path where data is stored.
     *
     * @param value     the file path where data is stored.
     */
    set path(value) {
        this._path = value;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._path = config.getAsStringWithDefault("path", this._path);
    }
    /**
     * Loads data items from external JSON file.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param callback          callback function that receives loaded items or error.
     */
    load(correlation_id, callback) {
        if (this._path == null) {
            callback(new pip_services3_commons_node_1.ConfigException(null, "NO_PATH", "Data file path is not set"), null);
            return;
        }
        if (!fs.existsSync(this._path)) {
            callback(null, []);
            return;
        }
        try {
            let json = fs.readFileSync(this._path, "utf8");
            let list = pip_services3_commons_node_3.JsonConverter.toNullableMap(json);
            let arr = pip_services3_commons_node_4.ArrayConverter.listToArray(list);
            callback(null, arr);
        }
        catch (ex) {
            let err = new pip_services3_commons_node_2.FileException(correlation_id, "READ_FAILED", "Failed to read data file: " + this._path)
                .withCause(ex);
            callback(err, null);
        }
    }
    /**
     * Saves given data items to external JSON file.
     *
     * @param correlation_id    (optional) transaction id to trace execution through call chain.
     * @param items             list if data items to save
     * @param callback          callback function that error or null for success.
     */
    save(correlation_id, items, callback) {
        try {
            let json = pip_services3_commons_node_3.JsonConverter.toJson(items);
            fs.writeFileSync(this._path, json);
            if (callback)
                callback(null);
        }
        catch (ex) {
            let err = new pip_services3_commons_node_2.FileException(correlation_id, "WRITE_FAILED", "Failed to write data file: " + this._path)
                .withCause(ex);
            if (callback)
                callback(err);
            else
                throw err;
        }
    }
}
exports.JsonFilePersister = JsonFilePersister;
//# sourceMappingURL=JsonFilePersister.js.map