import express from "express";
import { Repo } from "../repo";

export interface ExtractedURLRepo {
    pathUrl: string;
    repo: Repo;
}

export class RouteUtil {
    /**
     *
     * @param routePrefix - prefix on url to ignore
     * @returns exracted item url or null if invalid
     */
    public static extractItemURL(app: express.Application, routePrefix: string, url: string): ExtractedURLRepo {
        const pathUrl = decodeURIComponent(url.replace(routePrefix, "")).split("?")[0];
        // can this ever happen?
        if (pathUrl.indexOf("..") !== -1) {
            return null;
        }

        // verify pathUrl is one of the repos
        console.log("TODO: verify pathUrl starts with one of the repos");
        console.log(`processing request for route=${routePrefix}. pathUrl=${pathUrl}`);
        // ensure repos are cached
        const cachedRepos = app.phototime.getCachedRepos();
        const repo = app.phototime.getParentRepo(pathUrl);
        if (!repo) {
            return null;
        }
        return { pathUrl, repo};
    }
}
