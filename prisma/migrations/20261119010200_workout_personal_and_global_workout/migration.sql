-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_globalId_fkey";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "globalId",
ADD COLUMN     "personal_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "GlobalWorkout" (
    "id" SERIAL NOT NULL,
    "global_id" INTEGER NOT NULL,
    "workout_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GlobalWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GlobalWorkout_global_id_idx" ON "GlobalWorkout"("global_id");

-- CreateIndex
CREATE INDEX "GlobalWorkout_workout_id_idx" ON "GlobalWorkout"("workout_id");

-- CreateIndex
CREATE UNIQUE INDEX "GlobalWorkout_global_id_workout_id_key" ON "GlobalWorkout"("global_id", "workout_id");

-- CreateIndex
CREATE INDEX "Workout_personal_id_idx" ON "Workout"("personal_id");

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "Personal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalWorkout" ADD CONSTRAINT "GlobalWorkout_global_id_fkey" FOREIGN KEY ("global_id") REFERENCES "Global"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlobalWorkout" ADD CONSTRAINT "GlobalWorkout_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
