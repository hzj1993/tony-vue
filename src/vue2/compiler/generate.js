const eventBindingRE = /^@|^v-on:/;
const dynamicORStaicAttrRE = /(?:^:|^v-bind:)?([\w]+)/;
const dynamicAttrRE = /^:|^v-bind:/;
const expressionTextRE = /\{\{((?:.|\r?\n)+?)\}\}/;

export default function generate(ast) {
    let code = genElement(ast);
    return {
        render: `with(this){return ${code}}`
    }
}

function genElement(ast) {
    let data = genData(ast);
    let children = genChildren(ast);
    return `_c('${
        ast.tagName || 'div'
    }'${
        ast.attrs.length ? ',' + data : ''
    }${
        ast.children.length ? ',' + children : ''
    })`;
}

function genData(ast) {
    let code = '';
    let methods = [];
    let attrs = [];
    ast.attrs.forEach(attr => {
        if (eventBindingRE.test(attr.key)) {
            methods.push(attr);
        } else if (dynamicORStaicAttrRE.test(attr.key)) {
            if (attr.key === 'v-model') {
                debugger
                if (ast.tagName === 'input') {

                }
            } else {
                attrs.push(attr);
            }
        }
    });

    let methodsCode = methods.length ? `on: {${
        methods.map(
            method => `${JSON.stringify(method.key.replace(eventBindingRE, ''))}: ${method.value}`
        ).join(',')
    }},` : '';
    code += methodsCode;

    debugger
    let attrCode = attrs.length ? `attrs: {${
        attrs.map(attr => {
            let match = attr.key.match(dynamicORStaicAttrRE);
            return `${match[1]}: ${dynamicAttrRE.test(attr.key) ? `_s(${attr.value})` : JSON.stringify(attr.value)}`
        }).join(',')
    }},` : '';
    code += attrCode;
    debugger

    return `{${code ? code.substring(0, code.length - 1) : ''}}`;
}

function genChildren(ast) {
    let code = '';
    if (!ast.children.length) return '[]';
    ast.children.forEach(child => {
        // 只支持{{}}内只使用单变量,如 {{ a }}、{{b}}
        if (child.type === 'text') {
            let expressionText,
                tokens = [],
                text = child.content;

            while ((expressionText = text.match(expressionTextRE))) {
                let index = expressionText.index;
                if (index > 0) {
                    tokens.push(JSON.stringify(text.substring(0, index)));
                }
                tokens.push(`_s(${expressionText[1].trim()})`);
                text = text.substring(index + expressionText[0].length);
            }
            if (text) {
                tokens.push(JSON.stringify(text));
            }
            code += `_v(${tokens.join('+')}),`;
        } else if (child.tagName) {
            code += `${genElement(child)},`;
        }
    });
    return `[${code ? code.substring(0, code.length - 1) : ''}]`;
}
