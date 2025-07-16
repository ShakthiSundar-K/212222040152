export const isValidUrl = (url: string): boolean => {
  try {
    const regex = /^(https?:\/\/)([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

    if (!regex.test(url)) return false;

    new URL(url); 
    return true;
  } catch {
    return false;
  }
};
