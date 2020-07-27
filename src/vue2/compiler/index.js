import {parse} from './parse.js'
import {optimize} from './optimize.js'
import {generate} from './generate.js'

export function compileToFunction(template) {
    if (typeof template !== 'string') {
        return;
    }

    let ast = parse(template.trim());

    optimize(ast);

    let code = generate(ast);

    return {
        render: code.render
    };
}





