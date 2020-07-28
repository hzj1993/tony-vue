import {initMixin, updateMixin, mountMixin} from './init.js'
import {installRenderHelpers} from './helper.js'

function TonyVue(options) {
    this._init(options);
}

installRenderHelpers(TonyVue.prototype);
initMixin(TonyVue);
updateMixin(TonyVue);
mountMixin(TonyVue);

export default TonyVue;




