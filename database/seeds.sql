INSERT INTO departments (name) VALUES ('Engineering'), ('Marketing'), ('HR');

INSERT INTO roles (title, salary, department_id) VALUES
('Software Engineer', 90000, 1),
('Marketing Manager', 75000, 2),
('HR Specialist', 60000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Johnson', 1, 2),
('Bob', 'Smith', 2, 3),
('Charlie', 'Brown', 3, 1);
