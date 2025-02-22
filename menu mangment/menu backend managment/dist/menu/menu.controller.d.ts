import { MenuService } from './menu.service';
import { Menu } from './menu.model';
export declare class MenuController {
    private readonly MenuService;
    constructor(MenuService: MenuService);
    getMenuItems(): Promise<Menu[]>;
    getMenuItemById(id: string): Promise<Menu>;
    createMenuItem(PostMenuItemData: Menu): Promise<Menu>;
    updateMenuItem(id: string, PatchMenuItemData: Menu): Promise<Menu>;
    deleteMenuItem(id: string): Promise<Menu>;
}
