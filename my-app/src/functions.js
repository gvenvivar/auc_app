export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cutEmail(email) {
  return email.split('@')[0];
}
