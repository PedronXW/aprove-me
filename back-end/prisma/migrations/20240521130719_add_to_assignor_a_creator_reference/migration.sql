/*
  Warnings:

  - You are about to drop the column `createdAt` on the `assignors` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `assignors` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_assignors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creatorId" TEXT NOT NULL,
    CONSTRAINT "assignors_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_assignors" ("active", "creatorId", "document", "email", "id", "name", "phone") SELECT "active", "creatorId", "document", "email", "id", "name", "phone" FROM "assignors";
DROP TABLE "assignors";
ALTER TABLE "new_assignors" RENAME TO "assignors";
PRAGMA foreign_key_check("assignors");
PRAGMA foreign_keys=ON;
