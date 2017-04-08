declare module "preliminaries" {
    export interface PreliminariesOptions {
        parser?: PreliminariesParser;
        lang?: string;
        delims: string | string[];
        stringifyLang: boolean;
    }

    export interface PreliminariesParser {
        parse (str: string, options?: PreliminariesOptions): any;
        stringify (data: Object, options?: PreliminariesOptions): string;
        delims: string | string[];
    }

    export interface Preliminaries {
        parse (str: string, options?: PreliminariesOptions): any;
        stringify (str: string, data: Object, options?: PreliminariesOptions): string;
        jsonParser: PreliminariesParser; 
    }

    var preliminaries: Preliminaries;
    export default preliminaries;
}
