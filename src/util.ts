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
