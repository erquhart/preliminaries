declare module "preliminaries" {
    export interface PreliminariesOptions {
        parser?: Function;
        lang?: string;
        delims: string;
    }
    export interface Preliminaries {
        (str: string, options?: PreliminariesOptions, delims?: Array<string>, parser?: Function): any;
        stringify (str: string, data: Object, options?: PreliminariesOptions): string;
    }

    var preliminaries: Preliminaries;
    export default preliminaries;
}
