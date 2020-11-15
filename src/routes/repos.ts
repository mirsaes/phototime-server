import express from "express";
import { Repo } from "../repo";

class RepoResponse {
    public info: Repo;
    public items?: any[];
}

export default function(app: express.Application) {
    /**
     * @swagger
     * /repos:
     *  get:
     *      description: returns list of repos configured on this server
     *      tags:
     *      - Repos
     *      produces:
     *      - application/json
     *      responses:
     *          200:
     *              description: repos blah
     */
    app.get("/repos", (req, res) => {
        let repos: any[] = [];
        console.log("repos");
        repos = app.phototime.getCachedRepos();
        console.log(repos);
        // res.end(JSON.stringify(repos));
        res.json(repos);
    });

    /**
     * @swagger
     * /repo/{repoid}:
     *  get:
     *      description: get ccontents of repo or some subpath of repo
     *      tags:
     *      - Repos
     *      parameters:
     *          - in: path
     *            name: repoid
     *            required: true
     *            description: the repo id
     *      produces:
     *        - application/json
     *      responses:
     *          200:
     *              description: la de *** da
     */
    app.get("/repo/*", (req, res) => {
        // everything following /repo is the path
        // but return nothing if contains ..
        // console.log req.url
        let pathUrl = req.url.replace("/repo/", "");
        console.log("pathUrl=" + pathUrl);
        // can this ever happen?
        if (pathUrl.indexOf("..") !== -1) {
            res.send("404");
        }

        // ensure repos are cached
        const cachedRepos = app.phototime.getCachedRepos();

        // verify pathUrl is one of the repos
        pathUrl = pathUrl.split("?")[0];

        const repo = app.phototime.getParentRepo(pathUrl);
        if (!repo) {
            res.send("404");
        } else {
            // have path to folder/file
            // if folder (which it should be given its a repo)
            // then iterate over items in folder
            const resRepo = new RepoResponse();
            resRepo.info = repo;

            console.log(repo);
            resRepo.items = app.phototime.getRepoItems(repo.id);

            res.json(resRepo);
        }
    });
}
