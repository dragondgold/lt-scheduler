#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER lt_scheduler;
    ALTER USER lt_scheduler WITH PASSWORD '12345678';
    CREATE DATABASE lt_scheduler;
    GRANT ALL PRIVILEGES ON DATABASE lt_scheduler TO lt_scheduler;
EOSQL