
export const validateSignUpField = (field, value) => {
    let error = '';
    switch (field) {
      case 'firstName':
        if (!value.trim()) error = 'First Name is required.';
        else if (value.length > 50) error = 'First Name cannot exceed 50 characters.';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last Name is required.';
        else if (value.length > 50) error = 'Last Name cannot exceed 50 characters.';
        break;
      case 'email':
        if (!value.trim()) error = 'Username is required.';
        else if (value.length < 7 || value.length > 30) error = 'Username must be between 7 and 30 characters.';
        break;
      case 'password':
        if (!value.trim()) error = 'Password is required.';
        else if (value.length < 7 || value.length > 30) error = 'Password must be between 7 and 30 characters.';
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
  