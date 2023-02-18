CREATE TABLE users (
   username VARCHAR(30) PRIMARY KEY,
   password TEXT NOT NULL,
   first_name TEXT NOT NULL,
   last_name TEXT NOT NULL,
   email TEXT NOT NULL 
      CHECK (position('@' IN email) >1),
   age INTEGER NOT NULL,
   weight INTEGER NOT NULL,
   height INTEGER NOT NULL,
   gender TEXT NOT NULL,
   pal NUMERIC NOT NULL,
   goal_weight TEXT NOT NULL
);

CREATE TABLE recipes (
   id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   cuisine TEXT,
   ingredients TEXT NOT NULL,
   instructions TEXT,
   avg_cal FLOAT,
   notes TEXT,
   username VARCHAR(25)
      REFERENCES users ON DELETE CASCADE
);

CREATE TABLE favorites (
   recipe_id INTEGER PRIMARY KEY
      REFERENCES recipes ON DELETE CASCADE,
   title TEXT NOT NULL,
   username VARCHAR(25)
      REFERENCES users ON DELETE CASCADE
);

CREATE TABLE daily_cal (
   username VARCHAR(30) PRIMARY KEY
      REFERENCES users ON DELETE CASCADE,
   tdee FLOAT,
   daily_total FLOAT,
   recipe_ids TEXT, 
   date DATE
);