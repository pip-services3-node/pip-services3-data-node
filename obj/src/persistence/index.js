"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module persistence
 *
 * Todo: Rewrite this description.
 *
 * @preferred
 * Contains various persistence implementations (InMemory and File –persistences). These are
 * "abstract" persistences, which only connect to data sources and do not implement the operations
 * and methods for working the data. The classes that extend these persistences must implement this
 * logic on their own.
 *
 * Identifiable Persistences work with Identifiable objects, which have primary keys. A few standard
 * operations are defined by default for these objects: reading arrays and data pages; searching for
 * an object by its id; and creating, updating, and deleting records of objects.
 */
var MemoryPersistence_1 = require("./MemoryPersistence");
exports.MemoryPersistence = MemoryPersistence_1.MemoryPersistence;
var IdentifiableMemoryPersistence_1 = require("./IdentifiableMemoryPersistence");
exports.IdentifiableMemoryPersistence = IdentifiableMemoryPersistence_1.IdentifiableMemoryPersistence;
var FilePersistence_1 = require("./FilePersistence");
exports.FilePersistence = FilePersistence_1.FilePersistence;
var IdentifiableFilePersistence_1 = require("./IdentifiableFilePersistence");
exports.IdentifiableFilePersistence = IdentifiableFilePersistence_1.IdentifiableFilePersistence;
var JsonFilePersister_1 = require("./JsonFilePersister");
exports.JsonFilePersister = JsonFilePersister_1.JsonFilePersister;
//# sourceMappingURL=index.js.map