import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const DATABASE_URL = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString: String(DATABASE_URL) });
const prisma = new PrismaClient({ adapter });

const rolesToCreate = [{ name: 'admin' }, { name: 'cliente' }, { name: 'personal' }];

const exercisesToCreate = [
  { name: 'Supino Reto', muscleGroup: 'Peito' },
  { name: 'Supino Inclinado', muscleGroup: 'Peito' },
  { name: 'Supino Declinado', muscleGroup: 'Peito' },
  { name: 'Crucifixo', muscleGroup: 'Peito' },
  { name: 'Crossover', muscleGroup: 'Peito' },
  { name: 'Flexão de Braço', muscleGroup: 'Peito' },
  { name: 'Pull-over', muscleGroup: 'Peito' },
  { name: 'Barra Fixa', muscleGroup: 'Costas' },
  { name: 'Puxada Alta', muscleGroup: 'Costas' },
  { name: 'Remada Curvada', muscleGroup: 'Costas' },
  { name: 'Remada Baixa', muscleGroup: 'Costas' },
  { name: 'Remada Unilateral (Serrote)', muscleGroup: 'Costas' },
  { name: 'Remada Cavalinho', muscleGroup: 'Costas' },
  { name: 'Pulldown', muscleGroup: 'Costas' },
  { name: 'Extensão Lombar (Hiperestensão)', muscleGroup: 'Costas' },
  { name: 'Agachamento', muscleGroup: 'Quadríceps' },
  { name: 'Leg Press', muscleGroup: 'Quadríceps' },
  { name: 'Agachamento Búlgaro', muscleGroup: 'Quadríceps' },
  { name: 'Afundo / Passada', muscleGroup: 'Quadríceps' },
  { name: 'Cadeira Extensora', muscleGroup: 'Quadríceps' },
  { name: 'Agachamento Hack', muscleGroup: 'Quadríceps' },
  { name: 'Agachamento Sissy', muscleGroup: 'Quadríceps' },
  { name: 'Levantamento Terra', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Stiff', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Elevação Pélvica (Hip Thrust)', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Mesa Flexora', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Cadeira Flexora', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Glúteo Coice', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Cadeira Abdutora', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Cadeira Adutora', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Desenvolvimento (Overhead Press)', muscleGroup: 'Ombros' },
  { name: 'Elevação Lateral', muscleGroup: 'Ombros' },
  { name: 'Elevação Frontal', muscleGroup: 'Ombros' },
  { name: 'Crucifixo Invertido', muscleGroup: 'Ombros' },
  { name: 'Encolhimento de Ombros', muscleGroup: 'Ombros' },
  { name: 'Rosca Direta', muscleGroup: 'Bíceps' },
  { name: 'Rosca Alternada', muscleGroup: 'Bíceps' },
  { name: 'Rosca Martelo', muscleGroup: 'Bíceps' },
  { name: 'Rosca Scott', muscleGroup: 'Bíceps' },
  { name: 'Rosca Concentrada', muscleGroup: 'Bíceps' },
  { name: 'Rosca Inversa', muscleGroup: 'Bíceps' },
  { name: 'Tríceps Pulley / Puxador', muscleGroup: 'Tríceps' },
  { name: 'Tríceps Testa', muscleGroup: 'Tríceps' },
  { name: 'Tríceps Francês', muscleGroup: 'Tríceps' },
  { name: 'Mergulho em Paralelas', muscleGroup: 'Tríceps' },
  { name: 'Mergulho no Banco', muscleGroup: 'Tríceps' },
  { name: 'Abdominal Supra (Crunch)', muscleGroup: 'Abdômen / Core' },
  { name: 'Abdominal Infra', muscleGroup: 'Abdômen / Core' },
  { name: 'Prancha Isométrica', muscleGroup: 'Abdômen / Core' },
  { name: 'Abdominal Oblíquo', muscleGroup: 'Abdômen / Core' },
  { name: 'Roda Abdominal', muscleGroup: 'Abdômen / Core' },
  { name: 'Gêmeos em Pé', muscleGroup: 'Panturrilha' },
  { name: 'Gêmeos Sentado', muscleGroup: 'Panturrilha' },
  { name: 'Flexão Plantar no Leg Press', muscleGroup: 'Panturrilha' },
  { name: 'Supino Vertical', muscleGroup: 'Peito' },
  { name: 'Fly', muscleGroup: 'Peito' },
  { name: 'Puxada Frontal Neutra', muscleGroup: 'Costas' },
  { name: 'Puxada Triângulo', muscleGroup: 'Costas' },
  { name: 'Remada Aberta', muscleGroup: 'Costas' },
  { name: 'Puxada Frente', muscleGroup: 'Costas' },
  { name: 'Puxada Neutra', muscleGroup: 'Costas' },
  { name: 'Agachamento com Halter', muscleGroup: 'Quadríceps' },
  { name: 'Mini Sumô com Halter', muscleGroup: 'Quadríceps' },
  { name: 'Stiff com Halteres', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Glúteo Máquina/Cabo', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Abdução de Quadril no Cabo', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Elevação Pélvica Unilateral', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Pull-through no Cabo', muscleGroup: 'Posteriores e Glúteos' },
  { name: 'Trapézio', muscleGroup: 'Ombros' },
  { name: 'Desenvolvimento com Halteres', muscleGroup: 'Ombros' },
  { name: 'Tríceps Francês na Polia', muscleGroup: 'Tríceps' },
  { name: 'Tríceps Corda no Cross', muscleGroup: 'Tríceps' },
  { name: 'Tríceps Banco', muscleGroup: 'Tríceps' },
  { name: 'Prancha Frontal', muscleGroup: 'Abdômen / Core' },
  { name: 'Prancha Lateral', muscleGroup: 'Abdômen / Core' },
  { name: 'Abdominal Infra no Banco', muscleGroup: 'Abdômen / Core' },
  { name: 'Abdominal Bicicleta', muscleGroup: 'Abdômen / Core' },
  { name: 'Panturrilha Sentado', muscleGroup: 'Panturrilha' },
];

async function main() {
  console.log(`Iniciando o seed...`);

  console.log('Criando roles...');
  await prisma.role.createMany({ data: rolesToCreate, skipDuplicates: true });
  console.log('Roles criadas.');

  console.log('Criando exercícios...');

  await prisma.exercise.createMany({ data: exercisesToCreate, skipDuplicates: true });
  console.log('Exercícios criados.');

  console.log(`Seed finalizado.`);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
