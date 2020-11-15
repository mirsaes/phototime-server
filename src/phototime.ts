import path from "path";
import { LaunchConfig } from "./launch-config";
import { PhototimeConfig } from "./phototime-config";
import { Repo } from "./repo";
import { RepoDefinition } from "./repo-definition";
import { Thumb } from "./thumb";
import { Util } from "./util";

import fs from "fs";
import { ImageMetadata } from "./image-metadata";

// TODO: refile
const folderThumb = "/thumbs/folder.jpg";

export class Phototime {
    public config: PhototimeConfig;
    public appConfig: LaunchConfig;
    public cachedRepos: any[];
    public activeThumbTasks: Thumb[] = [];
    public thumbTasks: Thumb[] = [];

    constructor(config: PhototimeConfig, appConfig: LaunchConfig) {
        this.config = config;
        this.appConfig = appConfig;
        this.cachedRepos = [];

        setTimeout(() => { this.processThumbs(); }, 1000);
    }

    public pathToId(apath: string): string {
        // replace backslash slash with forward slash
        let idPath = apath.replace(/\\/g, "/");

        // replace escaped space char with space
        // idPath = idPath.replace(/\%20/g, " ");
        idPath = decodeURIComponent(idPath);

        // remove trailing forward slash
        while (idPath[idPath.length - 1] === "/") {
            idPath = idPath.substring(0, idPath.length - 2);
        }
        return idPath;
    }

    public getRepos(): any[] {
        const repos: Repo[] = [];

        // for (let repoIdx = 0; repoIdx < this.appConfig.repos.length; ++repoIdx) {

        for (const repo of this.appConfig.repos) {
            // const repo = this.appConfig.repos[repoIdx];
            console.debug(repo);
            repos.push({
                id: this.pathToId(repo.path),
                label: repo.label,
                thumb: "/thumb/repo.png"
            });
        }
        return repos;
    }
    public getParentRepo(apath: string): Repo {
        const repos = this.cachedRepos;
        if (!repos || !repos.length) {
            console.log("no repos");
            return;
        }

        const aid = this.pathToId(apath);

        let bestRepo;
        console.log("aid:" + aid);

        // maybe need  a set of repos .. or something rather than looping
        // not sure why i did it this way
        for (const repo of repos) {
            console.log("repo id:" + repo.id);
            if (aid.indexOf(repo.id) >= 0) {
                if (!bestRepo || bestRepo.id.length < repo.id.length) {
                    bestRepo = repo;
                }
            }
        }

        return bestRepo;
    }

    public getRepoItems(parentId: string) {
        const dir = parentId;
        console.log("getRepoItems dir=" + dir);
        console.log ("extensions=" + this.config.extensions);

        const items = fs.readdirSync(dir);

        // items = []

        // keep folders and files with proper extensions
        const folderItems: any[] = [];
        let fileItems: any[] = [];
        for (const item of items) {
            const itemStats = fs.statSync(dir + "/" + item);
            if (itemStats.isDirectory()) {
                const fullIdPath = parentId + "/" + item;
                folderItems.push({id: fullIdPath, type: "folder", thumb: folderThumb, label: item});
                continue;
            }

            if (!itemStats.isFile) {
                continue;
            }

            console.log("adding item:" + item);
            fileItems.push(item);
        }
        // check extensions
        console.log("fileItems prefilter: " + fileItems.length);
        fileItems = Util.removeJunk(fileItems, this.config.extensions);
        // fileItems = removeJunk app, fileItems
        const keepItems = folderItems;
        console.log("proces fileItems");
        for (const fileItem of fileItems) {
            const fullIdPath = parentId + "/" + fileItem;
            const thumbUrl = this.getThumbUrl(fullIdPath);
            keepItems.push({id: fullIdPath, type: "file", thumb: thumbUrl, label: fileItem});
        }
        return keepItems;
    }

    public getThumbUrl(filePath: string) {
        const fullPath = filePath.replace(":", "/");
        // /thumbs/path/to/file
        // spawn thumb creator..? to create thumb for file
        // 256x256, 8 bit?

        let thumbFullPath = this.config.thumbs + "/" + fullPath;
        thumbFullPath = thumbFullPath.replace("//", "/");

        const imfilepath = filePath;

        const thumb = new Thumb(imfilepath, thumbFullPath);
        // finalThumbUrl = thumb.make()
        thumb.init();

        const finalThumbUrl = thumb.getDest();

        // console.log 'thumb.getDest=', finalThumbUrl
        // if finalThumbUrl has different extension add new extension onto filePath
        if (finalThumbUrl.substring(finalThumbUrl.length - 4) !== filePath.substring(filePath.length - 4)) {
            filePath += finalThumbUrl.substring(finalThumbUrl.length - 4);
        }
        const thumbUrl = filePath.replace(":", "/");
        // console.log ".... thumbUrl=" + thumbUrl

        if (!thumb.isDone()) {
            // console.log 'need to add this to queue'
            this.addThumbTask(thumb);
        }

        return "/thumbs/" + thumbUrl;
    }

    public addThumbTask(thumb: Thumb) {
        this.thumbTasks.push(thumb);
    }

    public getCachedRepos() {
        if (this.cachedRepos.length === 0) {
            this.cachedRepos = this.getRepos();
        }
        return this.cachedRepos;
    }
    public getConfig(): PhototimeConfig {
        return this.config;
    }

    public processThumbs() {
        // console.log 'checking thumbs ...'
        // remove done tasks
        if (this.activeThumbTasks.length > 0) {
            // console.log 'activeThumbs=' + app.activeThumbTasks.length
            let allWorking = false;
            while (!allWorking) {
                let idx = 0;
                allWorking = true;
                for (idx = 0; idx < this.activeThumbTasks.length; ++idx) {
                    const tt = this.activeThumbTasks[idx];
                    if (tt.isDone()) {
                        allWorking = false;
                        // remove it
                        this.activeThumbTasks.splice(idx, 1);
                        break;
                    }
                }
            }
        }
        // add new tasks
        if (this.thumbTasks.length > 0) {
            // if app.activeThumbTasks.length == 4
            // 	console.log app.activeThumbTasks[0]

            while (this.activeThumbTasks.length < 4) {
                if (this.thumbTasks.length === 0) {
                    break;
                }
                // console.log 'taking thumb from waiting'
                // take one off

                const thumbTask = this.thumbTasks.splice(0, 1)[0];
                // console.log thumbTask
                thumbTask.make2();
                this.activeThumbTasks.push(thumbTask);
            }
            console.log("thumbs waiting: ", this.thumbTasks.length);
            console.log("thumbs active: ", this.activeThumbTasks.length);
        }

        // check again later
        let timeoutValMilliSeconds = 5000;
        if (this.thumbTasks.length) {
            timeoutValMilliSeconds = 1000;
        }
        setTimeout(() => {
            this.processThumbs();
        }, timeoutValMilliSeconds);

        return;
    }

    public moveToTrash(origPathUrl: string) {
        // url decode.. shouldn't have to do this because bodyParser.urlencode?
        const pathUrl = decodeURI(origPathUrl);
        const localFileUrl = pathUrl.replace(":", "/");

        let fileInTrash = path.join(this.config.trash, localFileUrl);
        // ensure destination exists
        fileInTrash = fileInTrash.replace(/\\/g, "/");
        const destNodes = fileInTrash.split("/");
        console.log(destNodes);
        Util.mymakeDirs(destNodes);
        console.log("pathUrl=" + pathUrl);
        console.log("fileInTrash=" + fileInTrash);
        // move to trash
        try {
            fs.renameSync(pathUrl, fileInTrash);
        } catch {
            // console.log 'yikes: removing folder, no backup'
            // fs.rmdirSync(pathUrl)
            try {
                fs.renameSync(pathUrl, fileInTrash + "_");
            } catch {
                // ok, maybe trying to switch between c and d, rename not allowed, copy - delete
                console.log("trying copy-del");
                const fileData = fs.readFileSync(pathUrl);
                console.log("read data... now write file: " + fileInTrash);
                // trashedFile = '"' + fileInTrash + '"'
                const trashedFile = fileInTrash;
                fs.writeFileSync(trashedFile, fileData);
                fs.unlinkSync(pathUrl);
            }
        }
    }

    public getItemInfo(repo: any, itemFullPath: string) {
        const itemStats = fs.statSync(itemFullPath);
        if (itemStats.isDirectory()) {
            const fileName = Util.lastNode(itemFullPath);
            return {id: itemFullPath, type: "folder", thumb: folderThumb, label: fileName};
        }
        if (itemStats.isFile()) {
            const thumbUrl = this.getThumbUrl(itemFullPath);
            const fileName = Util.lastNode(itemFullPath);
            return {id: itemFullPath, type: "file", thumb: thumbUrl, label: fileName};
        }
        return;
    }

    public rateItem(repo: any, itemFullPath: string, rating: number) {
        const itemStats = fs.statSync(itemFullPath);
        if (itemStats.isDirectory()) {
            // huh?
            console.log(`rating a folder, blah. ${itemFullPath}`);
        }

        if (!itemStats.isFile())
            return;
        
        // rate item
        var imageMetadata = new ImageMetadata(itemFullPath);
        imageMetadata.rateItem(rating);
    }

}
