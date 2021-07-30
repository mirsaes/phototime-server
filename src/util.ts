import fs from "fs";
import mkdirp from "mkdirp";

export class Util {
    public static removeJunk(list: string[], extensions: string[]) {
        const result: string[] = [];
        for (const item of list) {
            // assuming 3 chars plus .?
            // probably should strip by last "."
            const ext = item.substr((item.length - 4), 4);
            if (extensions.indexOf(ext) >= 0) {
                result.push(item);
            }
        }
        return result;
    }

    public static isRaw(apath: string) {
        let isRaw: boolean = false;
        const lastNode = Util.lastNode(apath);
        const ext = Util.getExt(lastNode);
        console.log(`isRaw ext=${ext}`);

        if ([".crw", ".CRW", ".cr2", ".CR2", ".nef", ".NEF"].indexOf(ext) >= 0) {
            isRaw = true;
        }

        console.log(`isRaw=${isRaw}. apath=${apath}`);
        return isRaw;
    }

    public static getExt(apath: string): string {
        const lastNode = Util.lastNode(apath);
        if (lastNode && lastNode.length > 0) {
            const parts =  lastNode.split(".");
            if (parts.length >= 2) {
                return "." + parts[parts.length - 1];
            }
        }

        return "";
    }

    public static removeExt(apath: string): string  {
        const ext = this.getExt(apath);
        if (ext && ext.length > 0) {
            return apath.substr(0, apath.length - ext.length);
        }
        return apath;
    }
    public static lastNode(apath: string): string {
        let nodes = apath.split("/");
        nodes = nodes[nodes.length - 1].split("\\");
        return nodes[nodes.length - 1];
    }
    public static mymakeDirs(destNodes: string[]) {
        // destNodes = destNodes.splice(0, destNodes.length-1);
        destNodes = destNodes.splice(0, destNodes.length - 1);
        console.log("mymakedirs=" + destNodes);
        const newDest = destNodes.join("/");
        console.log("newDest=" + newDest);
        try {
            mkdirp.sync(newDest);
        } catch {
            console.log("oops");
        }
        return;
    }

    public static doesFileExist(filePath: string) {
        try {
            const ff = fs.statSync(filePath);
            return ff.isFile;
        } catch {
            return false;
        }

        return;
    }
}
