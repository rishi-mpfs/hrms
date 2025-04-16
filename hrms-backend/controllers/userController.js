const { User, Department } = require('../models');
const bcrypt = require('bcryptjs');

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
    phone,
    dob,
    gender,
    address,
    designation,
    joinDate,
    salary,
    profileImage,
    status,
    role,
    accountNumber,
    departmentId
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      dob,
      gender,
      address,
      designation,
      joinDate,
      salary,
      profileImage,
      status,
      role,
      accountNumber,
      departmentId
    });

    const userWithoutPassword = newUser.toJSON();
    delete userWithoutPassword.password;

    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};


// 4. Update user
exports.updateUser = async (req, res) => {
  const {
    name,
    phone,
    dob,
    gender,
    address,
    designation,
    joinDate,
    salary,
    profileImage,
    status,
    role,
    accountNumber,
    departmentId
  } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.dob = dob ?? user.dob;
    user.gender = gender ?? user.gender;
    user.address = address ?? user.address;
    user.designation = designation ?? user.designation;
    user.joinDate = joinDate ?? user.joinDate;
    user.salary = salary ?? user.salary;
    user.profileImage = profileImage ?? user.profileImage;
    user.status = status ?? user.status;
    user.role = role ?? user.role;
    user.accountNumber = accountNumber ?? user.accountNumber;
    user.departmentId = departmentId ?? user.departmentId;

    await user.save();

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
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
