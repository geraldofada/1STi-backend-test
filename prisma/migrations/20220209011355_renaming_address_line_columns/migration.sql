/*
  Warnings:

  - You are about to drop the column `line_1` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `line_2` on the `Address` table. All the data in the column will be lost.
  - Added the required column `line1` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "line_1",
DROP COLUMN "line_2",
ADD COLUMN     "line1" TEXT NOT NULL,
ADD COLUMN     "line2" TEXT;
