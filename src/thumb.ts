import exec from "child_process";
// requires imagemagic cli tools to be installed..
import im from "imagemagick";
import { Util } from "./util";

export class Thumb {
    public done: boolean;
    public raw: boolean;
    public srcFile: string;
    public destFile: string;
    // ?
    public processDest: string;
    public resizeWidth: number;

    constructor(srcFile: string, destFile: string) {
        // console.log @srcFile
        this.done = false;
        this.raw = false;
        this.srcFile = srcFile;
        this.destFile = destFile;
        this.resizeWidth = 800;
    }

    // #im.readMetadata(filePath, (err, metadata) ->
    // #	console.log 'metadata for: ' + filePath
    // #	if err
    // #		console.log err
    // #		return
    // #	console.log metadata
    // #)
    // # return final destFile

    public isDone() {
        return this.done;
    }

    public init() {
        const orig = this.srcFile;
        let dest = this.destFile;

        if (Util.doesFileExist(dest)) {
            this.done = true;
            this.processDest = dest;
            return dest;
        }

        const destNodes = dest.split("/");
        // splice modifies array
        const destNodeExt = destNodes.splice(destNodes.length - 1, 1)[0];
        destNodes.push(destNodeExt);
        // really last node name
        const extNodes = destNodeExt[0].split(".");
        const ext: string = "." + extNodes[extNodes.length - 1];
        // console.log ext
        Util.mymakeDirs(destNodes);

        if (ext in [".cr2", ".CR2"]) {
            // console.log "yikes its raw"
            dest = `${dest}.jpg`;

            if (Util.doesFileExist(dest)) {
                this.processDest = dest;
                this.done = true;
                return dest;
            }

            this.raw = true;
        }

        this.processDest = dest;
        return;
    }

    public getDest() {
        return this.processDest;
    }

    public make2() {
        const orig = this.srcFile;
        const dest = this.processDest;
        const me = this;
        const resizeWidth = this.resizeWidth;

        if (this.raw) {
            // create thumbnail for raw file
            exec.exec(`dcraw -c ${orig} | convert - -resize ${resizeWidth} ${dest}`,
                (err, stderr, stdout) => {
                    me.done = true;
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("ok");
                    }
                }
            );
            return;
        }

        const resizeOptions: im.Options = {
            dstPath: dest,
            srcPath: orig,
            // depth: 16,
            width: resizeWidth
        };
        // not raw
        im.resize(resizeOptions,
            (err, result) => {
                me.done = true;
                if (err) {
                    console.log (err);
                } else {
                    console.log("ok");
                }
            }
        );

        return;
    }

    public make() {
        const orig = this.srcFile;
        let dest = this.destFile;

        if (Util.doesFileExist(dest)) {
            return dest;
        }

        const destNodes = dest.split("/");
        // splice modifies array
        const destNodeExt = destNodes.splice(destNodes.length - 1, 1)[0];
        destNodes.push(destNodeExt);
        // really last node name
        const extNodes = destNodeExt[0].split(".");
        const ext = "." + extNodes[extNodes.length - 1];
        console.log(ext);
        if (ext in [".cr2", ".CR2"]) {
            Util.mymakeDirs(destNodes);
            console.log("yikes its raw");
            dest = `${dest}.jpg`;

            if (Util.doesFileExist(dest)) {
                return dest;
            }

            console.log("starting resize", orig, dest);
            exec.exec(`dcraw -c ${orig} | convert - -resize ${this.resizeWidth} ${dest}`,
                (err, stderr, stdout) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("ok");
                    }
                }
            );
        } else {
            console.log("starting resize", orig, dest);
            // #destNodes = destNodes.splice destNodes.length-2, 1
            Util.mymakeDirs(destNodes);

            const resizeOptions: im.Options = {
                dstPath: dest,
                srcPath: orig,
                // depth: 16,
                width: 800
            };

            im.resize(resizeOptions,
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("ok");
                    }
                }
            );
        }
        return dest;
    }
}
