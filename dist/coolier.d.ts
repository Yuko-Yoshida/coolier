declare function getIDsFromIndex(url: string, page?: number | string): Promise<{
    id: any;
    page: number;
    title: any;
    author: {
        name: any;
        url: any;
    };
    date: any;
    rate: any;
    url: any;
    tags: any;
}[]>;
declare function search(q: any): Promise<{
    id: any;
    page: number;
    title: any;
    author: {
        name: any;
        url: any;
    };
    date: any;
    rate: any;
    url: any;
    tags: any;
}[]>;
declare function getArticle(url: string): Promise<{
    id: number;
    page: number;
    title: any;
    body: any;
    afterword: any;
    tags: any;
    author: {
        name: any;
        url: any;
    };
}>;
declare const _default: {
    getIDsFromIndex: typeof getIDsFromIndex;
    search: typeof search;
    getArticle: typeof getArticle;
};
export default _default;
