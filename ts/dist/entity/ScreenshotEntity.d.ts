import { BuggieEntityBase } from '../BuggieEntityBase';
import type { BuggieSDK } from '../BuggieSDK';
import type { Control } from '../types';
import type { Screenshot, ScreenshotCreateData } from '../BuggieTypes';
declare class ScreenshotEntity extends BuggieEntityBase<Screenshot> {
    constructor(client: BuggieSDK, entopts: any);
    make(this: ScreenshotEntity): ScreenshotEntity;
    create(this: any, reqdata?: ScreenshotCreateData, ctrl?: Control): Promise<ScreenshotEntity>;
}
export { ScreenshotEntity };
