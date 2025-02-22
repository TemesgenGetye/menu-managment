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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
function buildMenuTree(items, parentId = null) {
    return items
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
        ...item,
        children: buildMenuTree(items, item.id),
    }));
}
let MenuService = class MenuService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMenuItems() {
        const items = await this.prisma.menuItem.findMany();
        return buildMenuTree(items);
    }
    async createMenuItem(data) {
        return this.prisma.menuItem.create({
            data,
        });
    }
    async updateMenuItem(id, data) {
        return this.prisma.menuItem.update({
            where: { id },
            data,
        });
    }
    async deleteMenuItem(id) {
        return this.prisma.menuItem.delete({
            where: { id },
        });
    }
    async getMenuItemById(id) {
        const menuItem = await this.prisma.menuItem.findUnique({
            where: { id },
        });
        if (!menuItem) {
            throw new Error(`Menu item with id ${id} not found`);
        }
        return menuItem;
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map