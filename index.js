import inquirer from 'inquirer';
import pool from './db.js';

const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]);

  switch (action) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit();
  }

  mainMenu();
};

const viewDepartments = async () => {
  const res = await pool.query('SELECT * FROM departments');
  console.table(res.rows);
};

const viewRoles = async () => {
  const res = await pool.query(`
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    JOIN departments ON roles.department_id = departments.id`);
  console.table(res.rows);
};

const viewEmployees = async () => {
  const res = await pool.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department,
    roles.salary, managers.first_name AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id`);
  console.table(res.rows);
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt([{ type: 'input', name: 'name', message: 'Enter department name:' }]);
  await pool.query('INSERT INTO departments (name) VALUES ($1)', [name]);
  console.log(`Department ${name} added!`);
};

const addRole = async () => {
  const { title, salary, department_id } = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Enter role title:' },
    { type: 'input', name: 'salary', message: 'Enter salary:' },
    { type: 'input', name: 'department_id', message: 'Enter department ID:' }
  ]);
  await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
  console.log(`Role ${title} added!`);
};

const addEmployee = async () => {
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    { type: 'input', name: 'first_name', message: 'Enter first name:' },
    { type: 'input', name: 'last_name', message: 'Enter last name:' },
    { type: 'input', name: 'role_id', message: 'Enter role ID:' },
    { type: 'input', name: 'manager_id', message: 'Enter manager ID (or leave blank):' }
  ]);
  await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
    [first_name, last_name, role_id, manager_id || null]);
  console.log(`Employee ${first_name} ${last_name} added!`);
};

const updateEmployeeRole = async () => {
  const { employee_id, role_id } = await inquirer.prompt([
    { type: 'input', name: 'employee_id', message: 'Enter employee ID to update:' },
    { type: 'input', name: 'role_id', message: 'Enter new role ID:' }
  ]);
  await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
  console.log(`Employee role updated!`);
};

mainMenu();
