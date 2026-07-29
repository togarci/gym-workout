/*
  Warnings:

  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `exercises` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Workout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Workout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "role",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userName" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "exercises",
DROP COLUMN "ownerId",
DROP COLUMN "title",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "muscleGroup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExercise" (
    "id" SERIAL NOT NULL,
    "workoutId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "sets" INTEGER NOT NULL DEFAULT 3,
    "reps" TEXT NOT NULL DEFAULT '10',
    "restTime" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WorkoutExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "workoutId" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSet" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutSet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_key" ON "Exercise"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExercise" ADD CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WorkoutSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSet" ADD CONSTRAINT "WorkoutSet_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
