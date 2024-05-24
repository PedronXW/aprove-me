/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `received` on the `payables` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `payables` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `assignors` table. All the data in the column will be lost.
  - Added the required column `password` to the `assignors` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "users";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_payables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "emissionDate" DATETIME NOT NULL,
    "assignorId" TEXT NOT NULL,
    CONSTRAINT "payables_assignorId_fkey" FOREIGN KEY ("assignorId") REFERENCES "assignors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_payables" ("active", "assignorId", "emissionDate", "id", "value") SELECT "active", "assignorId", "emissionDate", "id", "value" FROM "payables";
DROP TABLE "payables";
ALTER TABLE "new_payables" RENAME TO "payables";
CREATE TABLE "new_assignors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_assignors" ("active", "document", "email", "id", "name", "phone") SELECT "active", "document", "email", "id", "name", "phone" FROM "assignors";
DROP TABLE "assignors";
ALTER TABLE "new_assignors" RENAME TO "assignors";
PRAGMA foreign_key_check("payables");
PRAGMA foreign_key_check("assignors");
PRAGMA foreign_keys=ON;
