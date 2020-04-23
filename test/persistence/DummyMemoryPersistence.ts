import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableMemoryPersistence } from '../../src/persistence/IdentifiableMemoryPersistence';
import { Dummy } from '../Dummy';
import { IDummyPersistence } from '../IDummyPersistence';
import { syncBuiltinESMExports } from 'module';

export class DummyMemoryPersistence
    extends IdentifiableMemoryPersistence<Dummy, string>
    implements IDummyPersistence {


    public constructor() {
        super();
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<Dummy>) => void): void {

        filter = filter != null ? filter : new FilterParams();
        let key = filter.getAsNullableString("key");

        super.getPageByFilter(correlationId, (item) => {
            if (key != null && item.key != key)
                return false;
            return true;
        }, paging, null, null, callback);
    }

    public getSortedPage(correlationId: string, sort: any, callback: (err: any, page: DataPage<Dummy>) => void): void {
        super.getPageByFilter(correlationId, null, null, sort, null, callback);
    }

    public getSortedList(correlationId: string, sort: any, callback: (err: any, page: Dummy[]) => void): void {
        super.getListByFilter(correlationId, null, sort, null, callback);
    }
}