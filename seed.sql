DO $$
DECLARE
    v_role_personal_id INT;
    v_role_global_id INT;
    v_personal_user_id INT;
    v_personal_id INT;
    v_global_user_id INT;
    v_global_id INT;
    v_workout_id INT;
    v_exercise_id INT;
    -- Senha padrão: 12345678 (formato salt:scrypt_hash)
    v_default_password TEXT := '00000000000000000000000000000000:8501766114bd37548a7dd704a66cc4884704bcfcc0db327da27ca7e3f08f323228a9b6caf9d5c571f8448515ec428713956fe2b7c1adc31965416fe42e7ea24c';
BEGIN
    -- 0. Insert Roles ("personal" | "global")
    SELECT id INTO v_role_personal_id FROM "Role" WHERE "name" = 'personal';
    IF NOT FOUND THEN
        INSERT INTO "Role" ("name") VALUES ('personal') RETURNING id INTO v_role_personal_id;
    END IF;

    SELECT id INTO v_role_global_id FROM "Role" WHERE "name" = 'global';
    IF NOT FOUND THEN
        INSERT INTO "Role" ("name") VALUES ('global') RETURNING id INTO v_role_global_id;
    END IF;

    -- 1. Get or Create Personal User & Profile
    SELECT id INTO v_personal_user_id FROM "User" WHERE "user_name" = 'thyago.garcia';
    IF NOT FOUND THEN
        INSERT INTO "User" ("user_name", "email", "password", "role_id", "created_at", "updated_at")
        VALUES ('thyago.garcia', 'thyago.garcia@gym.com', v_default_password, v_role_personal_id, NOW(), NOW())
        RETURNING id INTO v_personal_user_id;
    ELSE
        UPDATE "User" SET "password" = v_default_password, "role_id" = v_role_personal_id, "updated_at" = NOW()
        WHERE id = v_personal_user_id;
    END IF;

    SELECT id INTO v_personal_id FROM "Personal" WHERE "user_id" = v_personal_user_id;
    IF NOT FOUND THEN
        INSERT INTO "Personal" ("name", "user_id")
        VALUES ('Thyago Garcia', v_personal_user_id)
        RETURNING id INTO v_personal_id;
    END IF;

    -- 2. Get or Create Global User (togarci) & Profile
    SELECT id INTO v_global_user_id FROM "User" WHERE "user_name" = 'togarci';
    IF NOT FOUND THEN
        INSERT INTO "User" ("user_name", "email", "password", "role_id", "created_at", "updated_at")
        VALUES ('togarci', 'togarci@gym.com', v_default_password, v_role_global_id, NOW(), NOW())
        RETURNING id INTO v_global_user_id;
    ELSE
        UPDATE "User" SET "password" = v_default_password, "role_id" = v_role_global_id, "updated_at" = NOW()
        WHERE id = v_global_user_id;
    END IF;

    SELECT id INTO v_global_id FROM "Global" WHERE "user_id" = v_global_user_id;
    IF NOT FOUND THEN
        INSERT INTO "Global" ("name", "user_id", "personal_id")
        VALUES ('togarci', v_global_user_id, v_personal_id)
        RETURNING id INTO v_global_id;
    ELSE
        UPDATE "Global" SET "personal_id" = v_personal_id
        WHERE id = v_global_id;
    END IF;

    -- =========================================================================
    -- Treino A
    -- =========================================================================
    INSERT INTO "Workout" ("name", "personal_id", "createdAt", "updatedAt")
    VALUES ('Treino A - Membros Superiores', v_personal_id, NOW(), NOW())
    RETURNING id INTO v_workout_id;

    INSERT INTO "GlobalWorkout" ("global_id", "workout_id", "assigned_at")
    VALUES (v_global_id, v_workout_id, NOW())
    ON CONFLICT ("global_id", "workout_id") DO NOTHING;

    -- Exercise: Supino Vertical
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Supino Vertical';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Supino Vertical', 'Peito', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', '1 x 15 de aquecimento. Máquina ou articulado.', 0, ARRAY[]::TEXT[]);

    -- Exercise: Fly
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Fly';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Fly', 'Peito', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '12', NULL, 1, ARRAY[]::TEXT[]);

    -- Exercise: Trapezio
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Trapezio';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Trapezio', 'Costas', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '15', NULL, 2, ARRAY[]::TEXT[]);

    -- Exercise: Desenvolvimento
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Desenvolvimento';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Desenvolvimento', 'Ombros', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', 'Máquina ou articulado.', 3, ARRAY[]::TEXT[]);

    -- Exercise: Elevação Lateral
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Elevação Lateral';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Elevação Lateral', 'Ombros', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '12', 'Iso de 10": Realizar isometria de 10 segundos após a última repetição de cada série.', 4, ARRAY[]::TEXT[]);

    -- Exercise: Rosca Martelo
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Rosca Martelo';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Rosca Martelo', 'Bíceps', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '12', NULL, 5, ARRAY[]::TEXT[]);


    -- =========================================================================
    -- Treino B
    -- =========================================================================
    INSERT INTO "Workout" ("name", "personal_id", "createdAt", "updatedAt")
    VALUES ('Treino B - Membros Inferiores', v_personal_id, NOW(), NOW())
    RETURNING id INTO v_workout_id;

    INSERT INTO "GlobalWorkout" ("global_id", "workout_id", "assigned_at")
    VALUES (v_global_id, v_workout_id, NOW())
    ON CONFLICT ("global_id", "workout_id") DO NOTHING;

    -- Cadeira Abdutora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Abdutora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Cadeira Abdutora', 'Glúteos', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', '1 x 15 de aquecimento.', 0, ARRAY[]::TEXT[]);

    -- Elevação Pélvica
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Elevação Pélvica';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Elevação Pélvica', 'Glúteos', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '12', 'Iso de 10", com barra. Realizar com barra livre, não máquina. Isometria de 10 segundos ao final de cada série.', 1, ARRAY[]::TEXT[]);

    -- Cadeira Flexora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Flexora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Cadeira Flexora', 'Posterior de Coxa', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 2, ARRAY[]::TEXT[]);

    -- Stiff com Halteres
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Stiff com Halteres';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Stiff com Halteres', 'Posterior de Coxa', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '12', NULL, 3, ARRAY[]::TEXT[]);

    -- Prancha Frontal
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Prancha Frontal';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Prancha Frontal', 'Abdômen', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 5, '40', 'Segundos. Mínimo de 40".', 4, ARRAY[]::TEXT[]);


    -- =========================================================================
    -- Treino C
    -- =========================================================================
    INSERT INTO "Workout" ("name", "personal_id", "createdAt", "updatedAt")
    VALUES ('Treino C - Membros Superiores', v_personal_id, NOW(), NOW())
    RETURNING id INTO v_workout_id;

    INSERT INTO "GlobalWorkout" ("global_id", "workout_id", "assigned_at")
    VALUES (v_global_id, v_workout_id, NOW())
    ON CONFLICT ("global_id", "workout_id") DO NOTHING;

    -- Puxada Frontal Neutra
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Puxada Frontal Neutra';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Puxada Frontal Neutra', 'Costas', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '12', '1 x 15 de aquecimento. Barra romana ou unilateral.', 0, ARRAY[]::TEXT[]);

    -- Puxada Triângulo
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Puxada Triângulo';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Puxada Triângulo', 'Costas', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 1, ARRAY[]::TEXT[]);

    -- Remada Aberta
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Remada Aberta';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Remada Aberta', 'Costas', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 2, ARRAY[]::TEXT[]);

    -- Serrote Unilateral
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Serrote Unilateral';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Serrote Unilateral', 'Costas', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '10', 'Em cada lado.', 3, ARRAY[]::TEXT[]);

    -- Trapezio
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Trapezio';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Trapezio', 'Costas', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '15', NULL, 4, ARRAY[]::TEXT[]);

    -- Triceps Francês na Polia
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Triceps Francês na Polia';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Triceps Francês na Polia', 'Tríceps', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '12', 'Polia na altura da cintura.', 5, ARRAY[]::TEXT[]);


    -- =========================================================================
    -- Treino D
    -- =========================================================================
    INSERT INTO "Workout" ("name", "personal_id", "createdAt", "updatedAt")
    VALUES ('Treino D - Membros Inferiores', v_personal_id, NOW(), NOW())
    RETURNING id INTO v_workout_id;

    INSERT INTO "GlobalWorkout" ("global_id", "workout_id", "assigned_at")
    VALUES (v_global_id, v_workout_id, NOW())
    ON CONFLICT ("global_id", "workout_id") DO NOTHING;

    -- Cadeira Adutora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Adutora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Cadeira Adutora', 'Adutores', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', '1 x 15 de aquecimento.', 0, ARRAY[]::TEXT[]);

    -- Agachamento com Halter
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Agachamento com Halter';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Agachamento com Halter', 'Quadríceps', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', 'Fazer 10 reps, segurar 10" de isometria e fazer mais 10 reps (totalizando 1 série).', 1, ARRAY[]::TEXT[]);

    -- Cadeira Extensora
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Cadeira Extensora';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Cadeira Extensora', 'Quadríceps', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 4, '10', NULL, 2, ARRAY[]::TEXT[]);

    -- Panturrilha Sentado
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Panturrilha Sentado';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Panturrilha Sentado', 'Panturrilha', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 3, '15', NULL, 3, ARRAY[]::TEXT[]);

    -- Prancha Lateral
    SELECT id INTO v_exercise_id FROM "Exercise" WHERE "name" = 'Prancha Lateral';
    IF NOT FOUND THEN
        INSERT INTO "Exercise" ("name", "muscleGroup", "createdAt") VALUES ('Prancha Lateral', 'Abdômen', NOW()) RETURNING id INTO v_exercise_id;
    END IF;
    INSERT INTO "WorkoutExercise" ("workoutId", "exerciseId", "sets", "reps", "observation", "order", "tags")
    VALUES (v_workout_id, v_exercise_id, 5, '30', 'Segundos. Em cada lado.', 4, ARRAY[]::TEXT[]);

END $$;
