const getFirstName = ( firstName ) => {
  return firstName
};

const isValidPassword = ( password ) => {
  return password.length >= 8 && !password.toLowerCase().includes('password')
}

export { getFirstName, isValidPassword }
