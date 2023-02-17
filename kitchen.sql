\echo 'Delete and recreate kitchen db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE IF EXISTS kitchen;
CREATE DATABASE kitchen;
\connect kitchen

\i kitchen-schema.sql
\i kitchen-seed.sql

\echo 'Delete and recreate kitchen_test db?'
\prompt 'Return for yes or control-C to cancel >' foo

DROP DATABASE IF EXISTS kitchen_test;
CREATE DATABASE kitchen_test;
\connect kitchen_test

\i kitchen-schema.sql