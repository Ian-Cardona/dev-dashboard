export const getAndClearCookieValue = (cookieKey: string): string | null => {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const errorCookie = cookies.find(cookie =>
    cookie.startsWith(`${cookieKey}=`)
  );
  if (errorCookie) {
    const value = decodeURIComponent(errorCookie.split('=')[1]);
    document.cookie = `${cookieKey}=; Max-Age=0; path=/;`;
    return value;
  }
  return null;
};
