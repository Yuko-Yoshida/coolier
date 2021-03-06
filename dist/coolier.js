"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const request = require("request-promise");
const options = {
    uri: 'http://coolier.dip.jp/sosowa/ssw_l/',
    transform: function (body) {
        return cheerio.load(body);
    }
};
function getIndexInfo($) {
    const page = Number($('.pager').first().find('.active').text());
    const ids = [];
    $('tr.article').each((i, article) => {
        ids[i] = Number($(article).attr('id').replace('article', ''));
    });
    const infos = ids.map((id) => {
        const article = $(`#article${id}`);
        const title = article.children('.title').children('h2').text();
        const author = {
            name: article.children('.name').text(),
            url: article.children('.name').children('a').attr('href')
        };
        const date = article.children('.dateTime').text();
        const rate = article.children('.rate').text();
        const url = article.children('.title').children('h2').children('a').attr('href');
        const tags = $(`#tags${id}`)
            .children('td')
            .children('ul')
            .children('li')
            .map((_, elem) => {
            return {
                name: $(elem).text(),
                url: $(elem).children('a').attr('href')
            };
        }).get();
        return { id, page, title, author, date, rate, url, tags };
    });
    return infos;
}
async function getIDsFromIndex(url, page = 0) {
    page = (page === 0) ? '' : page;
    url = (url) ? encodeURI(url) : '/sosowa/ssw_l';
    options.uri = `http://coolier.dip.jp${url}/${page}`;
    const $ = await request(options);
    return getIndexInfo($);
}
async function search(q) {
    let { query, title, name, tags, p } = q;
    query = (query) ? query : '';
    title = (title) ? title : '';
    name = (name) ? name : '';
    tags = (tags) ? tags : '';
    p = (p) ? p : '';
    const url = `http://coolier.dip.jp/sosowa/ssw_l/search?query=${query}&title=${title}&name=${name}&tags=${tags}&p=${p}`;
    options.uri = encodeURI(url);
    const $ = await request(options);
    return getIndexInfo($);
}
async function getArticle(url) {
    options.uri = `http://coolier.dip.jp${url}`;
    const $ = await request(options);
    const title = $('h1').text();
    $('#content').find('br').replaceWith('\n');
    const body = $('#content').text();
    const afterword = $('#afterwordBody').text();
    const tags = $('#tags').children('ul').children('li').map((_, elem) => {
        return { name: $(elem).text(), url: $(elem).children('a').attr('href') };
    }).get();
    const author = { name: $('address').children().first().text(), url: $('address').children('a').attr('href') };
    // 0   1     2     3   4
    // /sosowa/ssw_l/page/id
    const page = Number(url.split('/')[3]);
    const id = Number(url.split('/')[4]);
    return { id, page, title, body, afterword, tags, author };
}
exports.default = {
    getIDsFromIndex,
    search,
    getArticle
};
