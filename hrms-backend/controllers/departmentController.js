const { Department, sequelize } = require('../models');

// 1. Create a department
exports.createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = await Department.create({ name });
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create department' });
  }
};

// 2. Get all departments

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await sequelize.query(
      `
      SELECT d.*, COUNT(u.id) AS employeeCount
      FROM Departments d
      LEFT JOIN Users u ON d.id = u.departmentId
      GROUP BY d.id
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch departments with employee count' });
  }
};


// 3. Get department by ID
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ error: 'Department not found' });
    res.json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch department' });
  }
};

// 4. Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ error: 'Department not found' });

    department.name = name || department.name;
    await department.save();

    res.json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update department' });
  }
};

// 5. Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByPk(req.params.id);
    if (!department) return res.status(404).json({ error: 'Department not found' });

    await department.destroy();
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
};
