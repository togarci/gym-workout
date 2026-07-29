FROM postgres:16-alpine

LABEL project="gym-workout-db"

# Variáveis de ambiente padrão (podem ser sobrescritas no docker-compose ou docker run)
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=gym_workout

# Expõe a porta padrão do PostgreSQL
EXPOSE 5432