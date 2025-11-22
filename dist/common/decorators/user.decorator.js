"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    const user = (_a = request.user) !== null && _a !== void 0 ? _a : null;
    if (!data || !user) {
        return user;
    }
    return user[data];
});
//# sourceMappingURL=user.decorator.js.map