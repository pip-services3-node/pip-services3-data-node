# <img src="https://uploads-ssl.webflow.com/5ea5d3315186cf5ec60c3ee4/5edf1c94ce4c859f2b188094_logo.svg" alt="Pip.Services Logo" width="200"> <br/> Persistence components for Node.js

This module is a part of the [Pip.Services](http://pipservices.org) polyglot microservices toolkit. It contains generic interfaces for data access components as well as abstract implementations for in-memory and file persistence.

The persistence components come in two kinds. The first kind is a basic persistence that can work with any object types and provides only minimal set of operations. 
The second kind is so called "identifieable" persistence with works with "identifable" data objects, i.e. objects that have unique ID field. The identifiable persistence provides a full set or CRUD operations that covers most common cases.

This module contains the following packages:
- **Core** - generic interfaces for data access components. 
- **Persistence** - in-memory and file persistence components, as well as JSON persister class.

<a name="links"></a> Quick links:
* [Memory persistence](https://www.pipservices.org/recipies/memory-persistence)
* [API Reference](https://pip-services3-node.github.io/pip-services3-data-node/globals.html)
* [Change Log](CHANGELOG.md)
* [Get Help](https://www.pipservices.org/community/help)
* [Contribute](https://www.pipservices.org/community/contribute)

## Use

Install the NPM package as
```bash
npm install pip-services3-data-node --save
```

For example, you need to implement persistence for a data object defined as following.

```typescript
import { IIdentifiable } from 'pip-services3-commons-node';

export class MyObject implements IIdentifiable {
  public id: string;
  public key: string;
  public value: number;
}
```

Our persistence component shall implement the following interface with a basic set of CRUD operations.

```typescript
export interface IMyPersistence {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MyObject>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: MyObject) => void): void;
    getOneByKey(correlationId: string, key: string, callback: (err: any, item: MyObject) => void): void;
    create(correlationId: string, item: MyObject, callback?: (err: any, item: MyObject) => void): void;
    update(correlationId: string, item: MyObject, callback?: (err: any, item: MyObject) => void): void;
    deleteById(correlationId: string, id: string, callback?: (err: any, item: MyObject) => void): void;
}
```

To implement in-memory persistence component you shall inherit `IdentifiableMemoryPersistence`. 
Most CRUD operations will come from the base class. You only need to override `getPageByFilter` method with a custom filter function.
And implement a `getOneByKey` custom persistence method that doesn't exist in the base class.

```typescript
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

export class MyMemoryPersistence extends IdentifableMemoryPersistence {
  public constructor() {
    super();
  }

  private composeFilter(filter: FilterParams): any {
    filter = filter || new FilterParams();
    
    let id = filter.getAsNullableString("id");
    let tempIds = filter.getAsNullableString("ids");
    let ids = tempIds != null ? tempIds.split(",") : null;
    let key = filter.getAsNullableString("key");

    return (item) => {
        if (id != null && item.id != id)
            return false;
        if (ids != null && ids.indexOf(item.id) < 0)
            return false;
        if (key != null && item.key != key)
            return false;
        return true;
    };
  }
  
  public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<MyObject>) => void): void {
      super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
  }  
  
  public getOneByKey(correlationId: string, key: string, callback: (err: any, item: MyObject) => void): void {
    let item = _.find(this._items, (item) => item.key == key);
    
    if (item != null) {
      this._logger.trace(correlationId, "Found object by key=%s", key);
    } else {
      this._logger.trace(correlationId, "Cannot find by key=%s", key);
    }
    
    callback(null, item);
  }

}
```

It is easy to create file persistence by adding a persister object to the implemented in-memory persistence component.

```typescript
import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';

export class MyFilePersistence extends MyMemoryPersistence {
  protected _persister: JsonFilePersister<MyObject>;

  constructor(path?: string) {
      super();
      this._persister = new JsonFilePersister<MyObject>(path);
      this._loader = this._persister;
      this._saver = this._persister;
  }

  public configure(config: ConfigParams) {
      super.configure(config);
      this._persister.configure(config);
  }
}
```

## Develop

For development you shall install the following prerequisites:
* Node.js 10+
* Visual Studio Code or another IDE of your choice
* Docker
* Typescript

Install dependencies:
```bash
npm install
```

Compile the code:
```bash
tsc
```

Run automated tests:
```bash
npm test
```

Generate API documentation:
```bash
./docgen.ps1
```

Before committing changes run dockerized build and test as:
```bash
./build.ps1
./test.ps1
./clear.ps1
```

## Contacts

The Node.js version of Pip.Services is created and maintained by:
- **Volodymyr Tkachenko**
- **Sergey Seroukhov**

The documentation is written by:
- **Mark Makarychev**
