-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, age, weight, height, gender, pal, goal_weight)
VALUES ('testuser1',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'test@user1.com',
        29,
        120,
        65,
        'female',
        1.4,
        'maintain'
        ),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'test@user2.com',
        32,
        165,
        72,
        'male',
        1.75,
        'gain');

INSERT INTO recipes (id, title, cuisine, ingredients, instructions, notes, username)
VALUES (1,
        'Recipe Title 1: Chicken Sandwich',
        'Cuisine 1: American',
        '{"Cheese", "Bread"}',
        'Instructions here',
        'Note: This is a fake recipe.',
        'testuser1'),
        (2,
        'Recipe Title 2: Sushi',
        'Cuisine 2: Japanese',
        '{"Rice", "Seaweed", "Ahi"}',
        'Instructions here',
        'Note: This is also a fake recipe.',
        'testuser2');

INSERT INTO favorites (recipe_id, title, username)
VALUES (1, 
        'Recipe Title 1', 
        'testuser1')