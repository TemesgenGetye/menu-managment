import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { Menu } from './menu.model';

interface MenuItem {
  id: string;
  name: string;
  parentId: string | null;
  depth: number;
  type: string;
  children?: MenuItem[];
}

function buildMenuTree(
  items: MenuItem[],
  parentId: string | null = null,
): MenuItem[] {
  return items
    .filter((item) => item.parentId === parentId)
    .map((item) => ({
      ...item,
      children: buildMenuTree(items, item.id), // Recursively find children
    }));
}
@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getMenuItems(): Promise<Menu[]> {
    const items = await this.prisma.menuItem.findMany();
    return buildMenuTree(items);
  }

  async createMenuItem(data: Prisma.MenuItemCreateInput): Promise<Menu> {
    return this.prisma.menuItem.create({
      data,
    });
  }

  async updateMenuItem(
    id: string,
    data: Prisma.MenuItemUpdateInput,
  ): Promise<Menu> {
    return this.prisma.menuItem.update({
      where: { id },
      data,
    });
  }

  async deleteMenuItem(id: string): Promise<Menu> {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }

  async getMenuItemById(id: string): Promise<Menu> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });
    if (!menuItem) {
      throw new Error(`Menu item with id ${id} not found`);
    }
    return menuItem;
  }
}
