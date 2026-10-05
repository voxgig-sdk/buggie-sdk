import { BuggieEntityBase } from '../BuggieEntityBase';
import type { BuggieSDK } from '../BuggieSDK';
import type { Control } from '../types';
import type { Project, ProjectListMatch } from '../BuggieTypes';
declare class ProjectEntity extends BuggieEntityBase<Project> {
    constructor(client: BuggieSDK, entopts: any);
    make(this: ProjectEntity): ProjectEntity;
    list(this: any, reqmatch?: ProjectListMatch, ctrl?: Control): Promise<ProjectEntity[]>;
}
export { ProjectEntity };
