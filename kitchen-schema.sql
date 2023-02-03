CREATE TABLE users (
   username VARCHAR(25) PRIMARY KEY,
   password TEXT NOT NULL,
   first_name TEXT NOT NULL,
   last_name TEXT NOT NULL,
   email TEXT NOT NULL 
      CHECK (position('@' IN email) >1)
);

CREATE TABLE recipes (
   id SERIAL PRIMARY KEY,
   title TEXT NOT NULL,
   cuisine TEXT,
   ingredients TEXT NOT NULL,
   instructions TEXT,
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