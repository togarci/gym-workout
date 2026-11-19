export interface PersonalStudentMock {
  id: number;
  name: string;
  userName: string;
  email: string;
  workoutsCount: number;
  lastWorkout?: string;
}

export const mockPersonalStudents: PersonalStudentMock[] = [
  {
    id: 1,
    name: 'Lucas Mendes',
    userName: 'lucas.mendes',
    email: 'lucas.mendes@email.com',
    workoutsCount: 4,
    lastWorkout: 'Treino A - Peito e Tríceps',
  },
  {
    id: 2,
    name: 'Mariana Costa',
    userName: 'mariana.costa',
    email: 'mariana.costa@email.com',
    workoutsCount: 5,
    lastWorkout: 'Treino C - Inferiores',
  },
  {
    id: 3,
    name: 'Rafael Oliveira',
    userName: 'rafael.oliveira',
    email: 'rafael.oliveira@email.com',
    workoutsCount: 3,
    lastWorkout: 'Treino B - Costas e Bíceps',
  },
  {
    id: 4,
    name: 'Camila Ferreira',
    userName: 'camila.ferreira',
    email: 'camila.ferreira@email.com',
    workoutsCount: 4,
    lastWorkout: 'Treino D - Ombros e Core',
  },
  {
    id: 5,
    name: 'Bruno Almeida',
    userName: 'bruno.almeida',
    email: 'bruno.almeida@email.com',
    workoutsCount: 2,
    lastWorkout: 'Full Body - Adaptação',
  },
  {
    id: 6,
    name: 'Juliana Rocha',
    userName: 'juliana.rocha',
    email: 'juliana.rocha@email.com',
    workoutsCount: 0,
  },
];
