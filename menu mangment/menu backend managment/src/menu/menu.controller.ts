import {
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  Controller,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from './menu.model';

@Controller('api/menu')
export class MenuController {
  constructor(private readonly MenuService: MenuService) {}

  @Get()
  async getMenuItems(): Promise<Menu[]> {
    return this.MenuService.getMenuItems();
  }

  @Get(':id')
  async getMenuItemById(@Param('id') id: string): Promise<Menu> {
    return this.MenuService.getMenuItemById(id);
  }

  @Post()
  async createMenuItem(@Body() PostMenuItemData: Menu): Promise<Menu> {
    return this.MenuService.createMenuItem(PostMenuItemData);
  }

  @Put(':id')
  async updateMenuItem(
    @Param('id') id: string,
    @Body() PatchMenuItemData: Menu,
  ): Promise<Menu> {
    return this.MenuService.updateMenuItem(id, PatchMenuItemData);
  }

  @Delete(':id')
  async deleteMenuItem(@Param('id') id: string): Promise<Menu> {
    return this.MenuService.deleteMenuItem(id);
  }
}
