import {initMixin, updateMixin, mountMixin} from './runtime/init.js'
import {installRenderHelpers} from './runtime/helper.js'

function TonyVue(options) {
    this._init(options);
}

installRenderHelpers(TonyVue.prototype);
initMixin(TonyVue);
updateMixin(TonyVue);
mountMixin(TonyVue);

export default TonyVue;




