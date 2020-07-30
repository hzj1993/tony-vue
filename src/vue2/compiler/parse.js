const tagStartRE = /^<([\w]+)/;
const tagEndRE = /^<\/([\w]+)>/;
const tagCloseRE = /^\s*(\/?)>/;
const dynamicAttributeRE = /^\s*((?:v-[\w]+:|@|:|v-)[\w]+)="([\w]+)"/;
const attributeRE = /^\s*([\w]+)="([\w]+)"/;
const unaryTag = ['area', 'base', 'br', 'col', 'embed', 'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

export default function parse(template) {
    return parseHTML(template);
}

function parseHTML(html) {
    let stack = [];
    let nodeAst;
    while (html) {
        let tagStartOrEnd = html.indexOf('<');

        if (tagStartOrEnd === 0) {
            // 结束标签
            if (tagEndRE.test(html)) {
                const tagEndMatch = html.match(tagEndRE);
                step(tagEndMatch[0].length);

                if (tagEndMatch[1] === stack[stack.length - 1].tagName) {
                    const finishNode = stack.pop();
                    if (stack.length) {
                        stack[stack.length - 1].children.push(finishNode);
                    } else {
                        nodeAst = finishNode;
                    }
                }
            }

            // 开始标签
            if (tagStartRE.test(html)) {
                const tagStartMatch = html.match(tagStartRE);
                let ast = {
                    tagName: tagStartMatch[1],
                    attrs: [],
                    children: []
                };
                step(tagStartMatch[0].length);
                let attrMatch, end;

                while (!(end = html.match(tagCloseRE)) && (attrMatch = html.match(dynamicAttributeRE) || html.match(attributeRE))) {
                    ast.attrs.push({
                        key: attrMatch[1],
                        value: attrMatch[2],
                    });
                    step(attrMatch[0].length);
                }
                if (end) {
                    if (unaryTag.indexOf(tagStartMatch[1]) > -1) {
                        if (stack.length) {
                            stack[stack.length - 1].children.push(ast);
                        }
                    } else {
                        stack.push(ast);
                    }
                    step(end[0].length);
                }

            }
        }

        let next = void 0;
        // 文本内容
        if (tagStartOrEnd > 0) {
            let rest = html.substring(tagStartOrEnd);
            while (!tagEndRE.test(rest) && !tagStartRE.test(rest)) {
                next = rest.indexOf('<', 1);
                if (next < 0) break;
                tagStartOrEnd += next;
                rest = html.substring(tagStartOrEnd);
            }
            let text = html.substring(0, tagStartOrEnd);
            step(text.length);

            if (text.trim()) {
                stack[stack.length - 1].children.push({
                    type: 'text',
                    content: text
                });
            } else {
                // 处理开始标签后的空白换行符
                text = ''
            }
        }
    }


    function step(n) {
        html = html.substring(n);
    }

    return nodeAst;
}


