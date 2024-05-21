/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `payables` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_payables" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "received" BOOLEAN NOT NULL DEFAULT false,
    "emissionDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignorId" TEXT NOT NULL,
    CONSTRAINT "payables_assignorId_fkey" FOREIGN KEY ("assignorId") REFERENCES "Assignor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_payables" ("assignorId", "emissionDate", "id", "received", "value") SELECT "assignorId", "emissionDate", "id", "received", "value" FROM "payables";
DROP TABLE "payables";
ALTER TABLE "new_payables" RENAME TO "payables";
PRAGMA foreign_key_check("payables");
PRAGMA foreign_keys=ON;
