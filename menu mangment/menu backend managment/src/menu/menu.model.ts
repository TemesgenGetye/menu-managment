import { Prisma } from '@prisma/client';

export class Menu implements Prisma.MenuItemCreateInput {
  id?: string;
  name: string;
  parentId?: string | null;
  depth: number;
  type: string;
}
