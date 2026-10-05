import { BuggieEntityBase } from '../BuggieEntityBase';
import type { BuggieSDK } from '../BuggieSDK';
import type { Control } from '../types';
import type { Report, ReportCreateData } from '../BuggieTypes';
declare class ReportEntity extends BuggieEntityBase<Report> {
    constructor(client: BuggieSDK, entopts: any);
    make(this: ReportEntity): ReportEntity;
    create(this: any, reqdata?: ReportCreateData, ctrl?: Control): Promise<ReportEntity>;
}
export { ReportEntity };
