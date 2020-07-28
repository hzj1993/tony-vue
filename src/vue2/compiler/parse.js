const tagStartRE = /^<([\w]+)/;
const tagEndRE = /^<\/([\w]+)>/;
const tagCloseRE = /^\s*(\/?)>/;
const dynamicAttributeRE = /^\s*((?:v-[\w]+:|@|:|v-)[\w]+)="([\w]+)"/;
const attributeRE = /^\s*([\w]+)="([\w]+)"/;

export default function parse(template) {
  return parseHTML(template);
}

function parseHTML(html) {
  let stack = [];
  let nodeAst;
  while (html) {
    let tagStartOrEnd = html.indexOf('<');
      
    if (tagStartOrEnd === 0) {
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
          stack.push(ast);
          step(end[0].length);
        }

      }
    }

    if (tagStartOrEnd > 0) {
      let text = html.substring(0, tagStartOrEnd);
      step(text.length);

      stack[stack.length - 1].children.push({
          type: 'text',
          content: text
      });
    }
  }


  function step(n) {
    html = html.substring(n);
  }
  
  return nodeAst;
}

