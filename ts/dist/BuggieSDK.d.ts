import { IssueEntity } from './entity/IssueEntity';
import { ProjectEntity } from './entity/ProjectEntity';
import { ReportEntity } from './entity/ReportEntity';
import { ScreenshotEntity } from './entity/ScreenshotEntity';
import { WidgetConfigEntity } from './entity/WidgetConfigEntity';
export type * from './BuggieTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { BuggieEntityBase } from './BuggieEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
type DirectResult = {
    ok: false;
    err: any;
    status?: undefined;
    headers?: undefined;
    data?: undefined;
} | {
    ok: boolean;
    status: number;
    headers: any;
    data: any;
    err?: any;
};
declare class BuggieSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<DirectResult>;
    _rawRequest(fetchargs?: any): Promise<DirectResult>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Issue(entopts?: Record<string, any>): IssueEntity;
    Project(entopts?: Record<string, any>): ProjectEntity;
    Report(entopts?: Record<string, any>): ReportEntity;
    Screenshot(entopts?: Record<string, any>): ScreenshotEntity;
    WidgetConfig(entopts?: Record<string, any>): WidgetConfigEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): BuggieSDK;
    tester(testopts?: any, sdkopts?: any): BuggieSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof BuggieSDK;
export { stdutil, config, BaseFeature, BuggieEntityBase, BuggieSDK, SDK, };
export type { DirectResult };
