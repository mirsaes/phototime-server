import { RepoDefinition } from "./repo-definition";

export interface LaunchConfig {
    repos: RepoDefinition[];
    root: string;
    thumbs: string; // relative to root
    trash: string; // relative to root
    webapp?: string;
    webapp2?: string;
}
