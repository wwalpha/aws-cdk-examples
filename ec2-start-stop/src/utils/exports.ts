export const toUpper = (value: string) => value.split('-').map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join('');
