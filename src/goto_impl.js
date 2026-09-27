"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.langDefinitionProvider = void 0;
const faav_1 = require("./faav");
const basic_funx_1 = require("./basic_funx");
const fancy_f12_1 = require("./fancy_f12");
class langDefinitionProvider {
    async provideDefinition(document, position, token) {
        try {
            return await (0, fancy_f12_1.definitions)(document, position, token);
        }
        catch (err) {
            await (0, basic_funx_1.prnt)("provideDefinition: " + String(err), faav_1.rank_msg.err);
            return [];
        }
    }
}
exports.langDefinitionProvider = langDefinitionProvider;
//# sourceMappingURL=goto_impl.js.map