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
   pal FLOAT NOT NULL,
   goal_weight TEXT NOT NULL,
   daily_cal FLOAT
);

CREATE TABLE recipes (
   id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   cuisine TEXT,
   ingredients TEXT[] NOT NULL,
   instructions TEXT,
   avg_cal FLOAT,
   notes TEXT,
   username VARCHAR(30)
      REFERENCES users ON DELETE CASCADE
);

CREATE TABLE favorites (
   recipe_id INTEGER
      REFERENCES recipes ON DELETE CASCADE,
   username VARCHAR(30)
      REFERENCES users ON DELETE CASCADE
);

CREATE TABLE calorie_log (
   username VARCHAR(30) 
      REFERENCES users ON DELETE CASCADE,
   daily_total FLOAT,
   recipe_ids TEXT[] NOT NULL, 
   date DATE NOT NULL DEFAULT CURRENT_DATE,
   is_goal BOOLEAN NOT NULL DEFAULT FALSE
);