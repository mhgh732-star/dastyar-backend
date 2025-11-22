"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const page_entity_1 = require("../entities/page.entity");
let EditorService = class EditorService {
    constructor(pageRepo) {
        this.pageRepo = pageRepo;
    }
    sanitize(body) {
        if (!body)
            return '';
        const withoutScript = body.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
        return withoutScript.replace(/on\w+="[^"]*"/gi, '');
    }
    async syncPage(content, body) {
        var _a;
        if (content.contentType !== 'page') {
            await this.pageRepo.delete({ contentItemId: content.id });
            return null;
        }
        const sanitized = this.sanitize((_a = body !== null && body !== void 0 ? body : content.contentBody) !== null && _a !== void 0 ? _a : '');
        let page = await this.pageRepo.findOne({ where: { contentItemId: content.id } });
        if (!page) {
            page = this.pageRepo.create({
                contentItemId: content.id,
                title: content.title,
                body: sanitized,
                metadata: content.settings || {},
            });
        }
        else {
            page.title = content.title;
            page.body = sanitized;
            page.metadata = content.settings || {};
        }
        return this.pageRepo.save(page);
    }
};
exports.EditorService = EditorService;
exports.EditorService = EditorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(page_entity_1.PageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EditorService);
//# sourceMappingURL=editor.service.js.map