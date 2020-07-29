import parse from './parse.js'
import generate from './generate.js'

export default function compileToFunction(template) {
    if (typeof template !== 'string') {
        return;
    }

    let ast = parse(template.trim());

    // 玩具版vue暂不实现优化
    // optimize(ast);

    let code = generate(ast);

    return {
        render: createFunction(code.render)
    };
}

function createFunction(code) {
    return new Function(code);
}




