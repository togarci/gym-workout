#!/bin/sh
set -e

echo "Aplicando migrações do banco de dados..."
npx prisma migrate deploy

echo "Gerando Prisma Client"
npx prisma generate

echo "Populando o banco de dados com dados iniciais (seed)..."
npx prisma db seed

exec "$@"