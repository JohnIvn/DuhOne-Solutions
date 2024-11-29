
export const validateSignUpField = (field, value) => {
  let error = '';
  const nameRegex = /^[a-zA-Z\s,'-]+$/;
  const emailRegex = /^[a-zA-Z0-9._]+@gmail\.com$/; 

  switch (field) {
    case 'firstName':
      if (!value.trim()) error = 'First Name is required.';
      else if (value.length < 3) error = 'First Name must be at least 3 characters long.';
      else if (value.length > 30) error = 'First Name cannot exceed 30 characters.';
      else if (!nameRegex.test(value)) error = 'First Name contains invalid characters.';
      break;

    case 'lastName':
      if (!value.trim()) error = 'Last Name is required.';
      else if (value.length < 2) error = 'Last Name must be at least 2 characters long.';
      else if (value.length > 30) error = 'Last Name cannot exceed 30 characters.';
      else if (!nameRegex.test(value)) error = 'Last Name contains invalid characters.';
      break;

    case 'email':
      if (!value.trim()) error = 'Email is required.';
      else if (!emailRegex.test(value)) error = 'Email must be a valid Gmail address.';
      else if (value.split('@gmail.com')[0].length < 5) {
        error = 'Gmail username must be at least 5 characters long.';
      } else if (value.length > 50) {
        error = 'Email cannot exceed 50 characters.';
      }
      break;

    case 'password':
      if (!value.trim()) error = 'Password is required.';
      else if (value.length < 8) error = 'Password must be at least 8 characters long.';
      else if (value.length > 30) error = 'Password cannot exceed 30 characters.';
      break;

    default:
      break;
  }
  return error;
};

export const validateSignUpForm = (fields) => {
  const errors = {};
  for (const field in fields) {
    errors[field] = validateSignUpField(field, fields[field]);
  }
  return errors;
};