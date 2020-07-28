const eventBindingRE = /^@|^v-on:/;
const expressionTextRE = /\{\{((?:.|\r?\n)+?)\}\}/;

export default function generate(ast) {
  let data = genData(ast);
  let children = genChildren(ast);
  let code = `_c('${
    ast.tagName || 'div'
  }'${
    ast.attrs.length ? ',' + data : ''
  }${
    ast.children.length ? ',' + children : ''
  })`;
  return {
    render: `with(this){return ${code}}`
  }
}

function genData(ast) {
  let code = '{';
  ast.attrs.forEach(attr => {
    if (eventBindingRE.test(attr.key)) {
      let str = `on: {${
        JSON.stringify(attr.key.replace(eventBindingRE, ''))
      }: ${attr.value}}`;
      code += str;
    }
  });
  return code + '}';
}

function genChildren(ast) {
  let code = '[';
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
    }
  });
  return code === '[' ? '' : code.substring(0, code.length - 1) + ']';
}
