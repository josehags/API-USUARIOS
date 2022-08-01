import bcrypt from 'bcrypt';

const hashPass = async (password, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export = { hashPass };
