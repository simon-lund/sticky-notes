-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isMinimized" BOOLEAN NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#fef08a',
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "zIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Note" ("color", "content", "createdAt", "id", "isMinimized", "updatedAt", "userId", "x", "y") SELECT "color", "content", "createdAt", "id", "isMinimized", "updatedAt", "userId", "x", "y" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
