import bcrypt from 'bcrypt';

export const hashPass = async (password: any, saltRounds = 10) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};
