DO $$
DECLARE
    v_user_id INT;
    v_workout_id INT;
    v_exercise_id INT;
BEGIN
    -- 1. Get or Create User
    SELECT id INTO v_user_id FROM "User" WHERE "userName" = 'togarci';
    IF NOT FOUND THEN
        INSERT INTO "User" ("userName", "name", "updatedAt") 
        VALUES ('togarci', 'togarci', NOW()) 
        RETURNING id INTO v_user_id;
    END IF;

    -- Treino A
    INSERT INTO "Workout" ("name", "userId", "updatedAt") 
    VALUES ('Treino A - Membros Superiores', v_user_id, NOW()) 
    RETURNING id INTO v_workout_id;

    -- Exercise: Supino Vertical
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Supino Vertical';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Supino Vertical', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', '1 x 15 de aquecimento. Máquina ou articulado.', 0);
    
    -- Exercise: Fly
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Fly';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Fly', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '12', NULL, 1);

    -- Exercise: Trapezio
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Trapezio';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Trapezio', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '15', NULL, 2);

    -- Exercise: Desenvolvimento
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Desenvolvimento';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Desenvolvimento', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', 'Máquina ou articulado.', 3);

    -- Exercise: Elevação Lateral
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Elevação Lateral';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Elevação Lateral', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '12', 'Iso de 10": Realizar isometria de 10 segundos após a última repetição de cada série.', 4);

    -- Exercise: Rosca Martelo
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Rosca Martelo';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Rosca Martelo', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '12', NULL, 5);


    -- Treino B
    INSERT INTO "Workout" ("name", "userId", "updatedAt") 
    VALUES ('Treino B - Membros Inferiores', v_user_id, NOW()) 
    RETURNING id INTO v_workout_id;

    -- Cadeira Abdutora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Abdutora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Cadeira Abdutora', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', '1 x 15 de aquecimento.', 0);

    -- Elevação Pélvica
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Elevação Pélvica';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Elevação Pélvica', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '12', 'Iso de 10", com barra. Realizar com barra livre, não máquina. Isometria de 10 segundos ao final de cada série.', 1);

    -- Cadeira Flexora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Flexora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Cadeira Flexora', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 2);

    -- Stiff com Halteres
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Stiff com Halteres';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Stiff com Halteres', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '12', NULL, 3);

    -- Prancha Frontal
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Prancha Frontal';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Prancha Frontal', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 5, '40', 'Segundos. Mínimo de 40".', 4);


    -- Treino C
    INSERT INTO "Workout" ("name", "userId", "updatedAt") 
    VALUES ('Treino C - Membros Superiores', v_user_id, NOW()) 
    RETURNING id INTO v_workout_id;

    -- Puxada Frontal Neutra
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Puxada Frontal Neutra';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Puxada Frontal Neutra', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '12', '1 x 15 de aquecimento. Barra romana ou unilateral.', 0);

    -- Puxada Triângulo
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Puxada Triângulo';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Puxada Triângulo', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 1);

    -- Remada Aberta
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Remada Aberta';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Remada Aberta', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 2);

    -- Serrote Unilateral
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Serrote Unilateral';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Serrote Unilateral', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '10', 'Em cada lado.', 3);

    -- Trapezio
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Trapezio';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Trapezio', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '15', NULL, 4);

    -- Triceps Francês na Polia
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Triceps Francês na Polia';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Triceps Francês na Polia', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '12', 'Polia na altura da cintura.', 5);


    -- Treino D
    INSERT INTO "Workout" ("name", "userId", "updatedAt") 
    VALUES ('Treino D - Membros Inferiores', v_user_id, NOW()) 
    RETURNING id INTO v_workout_id;

    -- Cadeira Adutora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Adutora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Cadeira Adutora', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', '1 x 15 de aquecimento.', 0);

    -- Agachamento com Halter
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Agachamento com Halter';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Agachamento com Halter', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', 'Fazer 10 reps, segurar 10" de isometria e fazer mais 10 reps (totalizando 1 série).', 1);

    -- Cadeira Extensora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Extensora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Cadeira Extensora', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 2);

    -- Panturrilha Sentado
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Panturrilha Sentado';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Panturrilha Sentado', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 3, '15', NULL, 3);

    -- Prancha Lateral
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Prancha Lateral';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "createdAt") VALUES ('Prancha Lateral', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order")
    VALUES (v_workout_id, v_exercise_id, 5, '30', 'Segundos. Em cada lado.', 4);

END $$;
