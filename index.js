/**
 * pukiwiki形式の文章をmd形式にする。
 * @param {String} text 変換したい文章。
 * @return {String} 変換した文章。
 */
module.exports = function(text) {
    let result = text;

    // 改行コード統一
    result = result.replace(/\r\n/g, "\n");
    result = result.replace(/\r/g, "\n");

    // pukiプラグイン→md標準機能
    // 水平線
    result = result.replace(/^#hr/mg, '____');

    // プラグインは&に統一する。見出しで#を使うので見出しより前でやる。
    // result = result.replace(/^#([a-z])/mg, '&$1');

    // リンク([[ページ名>リンク先]]型)
    // [[ページ名]]でマッチしないように先にやる。
    result = result.replace(/\[\[([^\]>]+)>([^\]]+)\]\]/g, '[$1]($2)');

    // リンク([[ページ名]]型)
    result = result.replace(/\[\[([^\]]+)\]\]/g, '<$1>');

    // 階層箇条書き (-)
    result = result.replace(/^(\-+)\s?([^\-])/mg, (...p) => {
        let depth = p[1].length;
        return ' '.repeat(depth - 1) + '- ' + p[2];
    })

    // 階層番号付き箇条書き (+)
    result = result.replace(/^(\++)\s?([^\+])/mg, (...p) => {
        let depth = p[1].length;
        return ' '.repeat(depth - 1) + '1. ' + p[2];
    })

    // th
    result = result.replace(/^\|(([^\|]+\|)+)h$/mg, (...p) => {
        let colnum = p[1].split('|').length - 1;
        return '|' + p[1] + "\n" + '|' + '----|'.repeat(colnum);
    })

    // 見出し
    // 楽なので見出しのレベルが小さい方からやる
    for (let i = 6; i >= 1; i--) {
        let reg = new RegExp(`^\\*{${i}}\s?`, 'mg');
        result = result.replace(reg, '#'.repeat(i) + ' ');
    }

    // 斜体
    result = result.replace(/'''(.*?)'''/g, '*$1*');

    // 太字
    result = result.replace(/''(.*?)''/g, '**$1**');

    // console.log(result);
    return result;
}