import exec from "child_process";
import { ImageEdit } from "./image-edit";
// requires imagemagic cli tools to be installed..
import { ImageMetadata } from "./image-metadata";
import { Util } from "./util";

export class Thumb {
    public done: boolean;
    public raw: boolean;
    public srcFile: string;
    public destFile: string;
    // ?
    public processDest: string;
    public resizeWidth: number;

    public srcMetadata: any;

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
            exec.exec(`dcraw -c "${orig}" | convert - -resize ${resizeWidth} "${dest}"`,
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

        // TODO: extract exif that wish to preserve..
        // Rating, rotation?, etc
        // console.log(`identifying ${orig}`);
        // TODO: actually use exiftool, easier format
        // provides Rating       : #
        // exec.exec(`identify -verbose ${orig}`,
        // | grep Rating
        const imageMetadata = new ImageMetadata(orig);
        imageMetadata.readAll().then((metadata: any ) => {
            this.srcMetadata = metadata;
            // not raw
            const editor = new ImageEdit();

            editor.resize(orig, dest, resizeWidth).then((result) => {
                console.log("done: " + dest);
                me.done = true;
                if (this.srcMetadata && this.srcMetadata.Rating >= 0) {
                    // console.log(`TODO: set rating into thumb as well or ... ${this.srcMetadata.Rating}`);
                    // or just send metadata back with image info?
                    const thumbMetadata = new ImageMetadata(dest);
                    thumbMetadata.rateItem(metadata.Rating);
                }
            }
            );
        });
        return;
    }
}
