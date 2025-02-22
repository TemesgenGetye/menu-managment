-- CreateTable
CREATE TABLE "menu" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "depth" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;
