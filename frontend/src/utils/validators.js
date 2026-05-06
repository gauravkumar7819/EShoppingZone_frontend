export const validateEmail = (email) => {
  const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return re.test(email);
};

export const validateMobile = (mobile) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(mobile);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.trim().length >= 2;
};

export const validatePincode = (pincode) => {
  const re = /^\d{6}$/;
  return re.test(pincode);
};