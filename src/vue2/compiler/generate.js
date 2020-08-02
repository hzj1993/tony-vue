const eventBindingRE = /^@|^v-on:/;
const dynamicORStaicAttrRE = /(?:^:|^v-bind:)?([\w]+)/;
const dynamicAttrRE = /^:|^v-bind:/;
const directivesRE = /^v-(.*)/;
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
  let code = `_c('${ast.tagName || 'div'}',${data}${children ? ',' + children : ''})`;
  if (ast['v-if']) {
    code = `(${ast['v-if']}) ? ${code} : _e()`;
  }
  return code;
}

function genData(ast) {
  let code = '';
  let methods = [];
  let attrs = [];
  let directives = [];
  let staticStyle = [];
  ast.attrs.forEach(attr => {
    if (eventBindingRE.test(attr.key)) {
      methods.push(attr);
    } else if (dynamicORStaicAttrRE.test(attr.key)) {
      if (directivesRE.test(attr.key)) {
        if (attr.key === 'v-model') {
          if (ast.tagName === 'input') {
            methods.push({
              key: 'input',
              value: `function($event){${attr.value}=$event.target.value;}`
            });
            attrs.push({
              key: ':value',
              value: attr.value
            });
          }
        } else if (attr.key === 'v-if') {
          ast['v-if'] = attr.value;
        } else {
          if (attr.key === 'v-show') {
            staticStyle.push(`display: (${attr.value}) ? "block" : "none"`);
          }
          directives.push(attr);
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

  let attrCode = attrs.length ? `attrs: {${
    attrs.map(attr => {
      let match = attr.key.match(dynamicORStaicAttrRE);
      return `${match[1]}: ${dynamicAttrRE.test(attr.key) ? `_s(${attr.value})` : JSON.stringify(attr.value)}`
    }).join(',')
  }},` : '';
  code += attrCode;

  let directivesCode = directives.length ? `directives: [${
    directives.map(attr => {
      let match = attr.key.match(directivesRE);
      return `{name:${
        JSON.stringify(match[1])
      },rawName:${
        JSON.stringify(match[0])
      },value:(${
        attr.value
      }),expression:${
        JSON.stringify(attr.value)
      }}`
    }).join(',')
  }],` : '';
  code += directivesCode;

  let staticStyleCode = staticStyle.length ? `staticStyle: {${
    staticStyle.join(',')
  }},` : '';
  code += staticStyleCode;

  return `{${code ? code.substring(0, code.length - 1) : ''}}`;
}

function genChildren(ast) {
  let code = '';
  if (!ast.children.length) return '';
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
