
const tagStartRE = /^<([\w]+)/;
const tagEndRE = /^<\/([\w]+)>/;
const eventBindingRE = /^@|^v-on:/;
const attributeRE = '';

export function parse(template) {
    parseHTML(template, {

    });
}

function parseHTML(html, options) {
    let stack = [];

    while (html) {
        let tagSrartOrEnd = html.indexOf('<');
        if (tagSrartOrEnd === 0) {
            if (tagEndRE.test(html)) {

            }

            if (tagStartRE.test(html)) {
                const tagStartMatch = html.match(tagStartRE);
                let ast = {
                    tagName: tagStartMatch[1]
                };
                step(tagStartMatch[1].length + 1);
                const attributeMatch = '';
            }
        }
    }


    function step(n) {
        html = html.substring(n);
    }
}

