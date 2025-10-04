#!/bin/bash

SERVICE_NAME="api"

MIGRATION_NAME=${1:-InitialMigration}

echo "Entrando no container $SERVICE_NAME..."
docker compose exec $SERVICE_NAME sh -c "
  echo 'Gerando migration $MIGRATION_NAME...';
  npm run migration:generate -- src/migrations/$MIGRATION_NAME;

  echo 'Rodando migrations...';
  npm run migration:run
"
