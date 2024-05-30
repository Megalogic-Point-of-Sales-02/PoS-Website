function validateInput(str) {
	return /^[A-Za-z0-9 ']*$/.test(str);
}

export default validateInput;