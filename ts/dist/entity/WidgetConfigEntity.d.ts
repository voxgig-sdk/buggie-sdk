import { BuggieEntityBase } from '../BuggieEntityBase';
import type { BuggieSDK } from '../BuggieSDK';
import type { Control } from '../types';
import type { WidgetConfig, WidgetConfigLoadMatch } from '../BuggieTypes';
declare class WidgetConfigEntity extends BuggieEntityBase<WidgetConfig> {
    constructor(client: BuggieSDK, entopts: any);
    make(this: WidgetConfigEntity): WidgetConfigEntity;
    load(this: any, reqmatch?: WidgetConfigLoadMatch, ctrl?: Control): Promise<WidgetConfigEntity>;
}
export { WidgetConfigEntity };
