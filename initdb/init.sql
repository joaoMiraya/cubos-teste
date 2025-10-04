CREATE ROLE cubos_user WITH LOGIN PASSWORD 'password';
CREATE DATABASE cubos_db OWNER cubos_user;
GRANT ALL PRIVILEGES ON DATABASE cubos_db TO cubos_user;