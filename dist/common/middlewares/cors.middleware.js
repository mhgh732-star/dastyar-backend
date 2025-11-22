"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomCorsMiddleware = void 0;
const common_1 = require("@nestjs/common");
let CustomCorsMiddleware = class CustomCorsMiddleware {
    constructor() {
        this.allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').filter(Boolean);
    }
    use(req, res, next) {
        const origin = req.headers.origin;
        if (!origin || this.allowedOrigins.length === 0 || this.allowedOrigins.includes(origin)) {
            res.header('Access-Control-Allow-Origin', origin || '*');
        }
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
            return;
        }
        next();
    }
};
exports.CustomCorsMiddleware = CustomCorsMiddleware;
exports.CustomCorsMiddleware = CustomCorsMiddleware = __decorate([
    (0, common_1.Injectable)()
], CustomCorsMiddleware);
//# sourceMappingURL=cors.middleware.js.map