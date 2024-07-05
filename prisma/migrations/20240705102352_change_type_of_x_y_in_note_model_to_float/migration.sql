/*
  Warnings:

  - You are about to alter the column `x` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `y` on the `Note` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isMinimized" BOOLEAN NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("content", "createdAt", "id", "isMinimized", "updatedAt", "userId", "x", "y") SELECT "content", "createdAt", "id", "isMinimized", "updatedAt", "userId", "x", "y" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
