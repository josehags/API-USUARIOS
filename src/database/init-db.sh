#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" <<-EOSQL
	CREATE USER api_usuarios;
    ALTER USER api_usuarios PASSWORD 'api_password';
	CREATE DATABASE api_database;
	GRANT ALL PRIVILEGES ON DATABASE api_database TO api_usuarios;
EOSQL