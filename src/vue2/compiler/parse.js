
const tagStartRE = /^<([\w]+)/;
const tagEndRE = /^<\/([\w]+)>/;
const tagCloseRE = /^\s*(\/?)>/;
const eventBindingRE = /^@|^v-on:/;
const dynamicAttributeRE = /^\s*((?:v-[\w]+:|@|:|v-)[\w]+)="([\w]+)"/;
const attributeRE = /^\s*([\w]+)="([\w]+)"/;

export default function parse(template) {
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
                    tagName: tagStartMatch[1],
                    attrs: []
                };
                step(tagStartMatch[1].length + 1);
                let attrMatch, end;
                while (!(end = html.match(tagCloseRE)) && (attrMatch = html.match(dynamicAttributeRE) || html.match(attributeRE))) {
                    ast.attrs.push({
                        originString: attrMatch[0],
                        attrKey: attrMatch[1],
                        attrValue: attrMatch[2],
                    });
                    step(attrMatch[0].length);
                }
                if (end) {
                    stack.push(ast);
                    step(end[0].length);
                }

            }
        }
    }


    function step(n) {
        html = html.substring(n);
    }
}

