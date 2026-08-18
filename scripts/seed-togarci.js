import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { scryptSync, randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL?.replace('@database:', '@localhost:') || 'postgresql://postgres:postgres@localhost:5432/gym_workout?schema=public';

const pool = new pg.Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const jsonPath = path.resolve(__dirname, '../app/states/data.workout.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const userData = data.find((d) => d.userName === 'togarci');
  if (!userData) {
    throw new Error('User togarci not found in JSON');
  }

  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync('123456', salt, 64).toString('hex');
  const hashedPassword = `${salt}:${hash}`;

  let user = await prisma.user.findUnique({
    where: { userName: 'togarci' },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        userName: 'togarci',
        name: 'Thyago Garcia',
        password: hashedPassword,
      },
    });
    console.log('User created:', user.userName);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    console.log('User already existed, updated password.');
  }

  for (const workout of userData.workouts) {
    let w = await prisma.workout.findFirst({
      where: { name: workout.name, userId: user.id },
    });

    if (!w) {
      w = await prisma.workout.create({
        data: {
          name: workout.name,
          description: workout.observations || null,
          userId: user.id,
        },
      });
      console.log('Workout created:', w.name);
    } else {
      console.log('Workout already exists:', w.name);
    }

    let order = 0;
    for (const exercise of workout.exercises) {
      let ex = await prisma.exercise.findUnique({
        where: { name: exercise.name },
      });

      if (!ex) {
        ex = await prisma.exercise.create({
          data: {
            name: exercise.name,
          },
        });
        console.log('Exercise created:', ex.name);
      }

      const sets = parseInt(exercise.sets) || 3;
      const reps = String(exercise.reps || '10');

      const existingWe = await prisma.workoutExercise.findFirst({
        where: { workoutId: w.id, exerciseId: ex.id },
      });

      if (!existingWe) {
        await prisma.workoutExercise.create({
          data: {
            workoutId: w.id,
            exerciseId: ex.id,
            sets: sets,
            reps: reps,
            observation: exercise.obs || exercise.notes || null,
            order: order,
          },
        });
        console.log('WorkoutExercise linked:', ex.name, 'to', w.name);
      }
      order++;
    }
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
