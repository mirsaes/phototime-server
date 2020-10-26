export class PhototimeConfig {
    public thumbs: string;
    public root: string;
    public trash: string;
    public extensions: string[];
    public rawExtensions: string[];
    public cwd: string;
    public temp: string;

    constructor(root: string
        ,       thumbs: string
        ,       trash: string
        ,       extensions: string[]
        ,       rawExtensions: string[]
        ,       cwd: string
        ,       temp: string) {
        this.root = root;
        this.thumbs = thumbs;
        this.trash = trash;
        this.extensions = extensions;
        this.rawExtensions = rawExtensions;
        this.cwd = cwd;
        this.temp = temp;
    }
}
