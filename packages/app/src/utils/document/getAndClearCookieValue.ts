export const getAndClearCookieValue = (cookieKey: string): string | null => {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());

  const cookie = cookies.find(cookie => cookie.startsWith(`${cookieKey}=`));
  console.log('Cookie found for key', cookieKey, ':', cookie);

  if (cookie) {
    const value = decodeURIComponent(cookie.split('=')[1]);
    document.cookie = `${cookieKey}=; Max-Age=0; path=/;`;
    return value;
  }
  return null;
};
