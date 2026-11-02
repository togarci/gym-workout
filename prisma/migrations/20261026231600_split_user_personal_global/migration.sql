ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_userId_fkey";

-- DropIndex
DROP INDEX "User_userName_key";

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "movement";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "roleId",
DROP COLUMN "updatedAt",
DROP COLUMN "userName",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_name" TEXT NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "userId",
ADD COLUMN     "globalId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutExercise" ADD COLUMN     "weight" TEXT;

-- CreateTable
CREATE TABLE "Personal" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Global" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "user_id" INTEGER NOT NULL,
    "personal_id" INTEGER NOT NULL,

    CONSTRAINT "Global_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Personal_user_id_key" ON "Personal"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Global_user_id_key" ON "Global"("user_id");

-- CreateIndex
CREATE INDEX "Global_personal_id_idx" ON "Global"("personal_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_user_name_key" ON "User"("user_name");

-- CreateIndex
CREATE INDEX "User_role_id_idx" ON "User"("role_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Personal" ADD CONSTRAINT "Personal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Global" ADD CONSTRAINT "Global_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Global" ADD CONSTRAINT "Global_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_globalId_fkey" FOREIGN KEY ("globalId") REFERENCES "Global"("id") ON DELETE CASCADE ON UPDATE CASCADE;

