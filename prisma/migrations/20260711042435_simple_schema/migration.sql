/*
  Warnings:

  - You are about to drop the `WorkoutSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutSet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `moviment` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkoutSession" DROP CONSTRAINT "WorkoutSession_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSession" DROP CONSTRAINT "WorkoutSession_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSet" DROP CONSTRAINT "WorkoutSet_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSet" DROP CONSTRAINT "WorkoutSet_sessionId_fkey";

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "moviment" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roleId" INTEGER;

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "observation" TEXT,
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "WorkoutSession";

-- DropTable
DROP TABLE "WorkoutSet";

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
