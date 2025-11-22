"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
let SimpleThrottlerGuard = class SimpleThrottlerGuard {
    constructor() {
        this.cache = new Map();
        this.limit = Number(process.env.RATE_LIMIT_REQUESTS || 60);
        this.ttlMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const key = request.ip || request.headers['x-forwarded-for'] || 'anonymous';
        const now = Date.now();
        const state = this.cache.get(key);
        if (!state || state.expiresAt < now) {
            this.cache.set(key, { count: 1, expiresAt: now + this.ttlMs });
            return true;
        }
        if (state.count >= this.limit) {
            throw new common_1.HttpException('Rate limit exceeded', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        state.count += 1;
        this.cache.set(key, state);
        return true;
    }
};
exports.SimpleThrottlerGuard = SimpleThrottlerGuard;
exports.SimpleThrottlerGuard = SimpleThrottlerGuard = __decorate([
    (0, common_1.Injectable)()
], SimpleThrottlerGuard);
//# sourceMappingURL=throttler.guard.js.map