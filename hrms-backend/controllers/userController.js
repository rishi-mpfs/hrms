const { User, Department } = require('../models');

// 1. Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Department, attributes: ['id', 'name'] }]
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// 2. Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Department, attributes: ['id', 'name'] }]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// 3. Create a user (admin use)


exports.createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    departmentId,
    phone,
    gender,
    dob,
    joinDate,
    address
  } = req.body;

  try {
    const newUser = await User.create({
      name,
      email,
      password,
      role,
      departmentId,
      phone,
      gender,
      dob,
      joinDate,
      address
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// 4. Update user
exports.updateUser = async (req, res) => {
  const {
    name,
    role,
    departmentId,
    phone,
    gender,
    dob,
    joiningDate,
    address
  } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name || user.name;
    user.role = role || user.role;
    user.departmentId = departmentId || user.departmentId;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.dob = dob || user.dob;
    user.joiningDate = joiningDate || user.joiningDate;
    user.address = address || user.address;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// 5. Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
