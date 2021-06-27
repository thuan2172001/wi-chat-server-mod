export const validateInputString = (input) =>
	typeof input !== 'string' || input.length === 0;

export const isValidString = (string) =>
	typeof string === 'string' && string.length > 0;
