import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Menu } from './menu.model';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    getMenuItems(): Promise<Menu[]>;
    createMenuItem(data: Prisma.MenuItemCreateInput): Promise<Menu>;
    updateMenuItem(id: string, data: Prisma.MenuItemUpdateInput): Promise<Menu>;
    deleteMenuItem(id: string): Promise<Menu>;
    getMenuItemById(id: string): Promise<Menu>;
}
