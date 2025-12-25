export const getAndClearCookieValue = (cookieKey: string): string | null => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(cookie => cookie.startsWith(`${cookieKey}=`));

    if (cookie) {
      const value = decodeURIComponent(cookie.split('=')[1]);
      document.cookie = `${cookieKey}=; Max-Age=0; path=/; domain=use.devdashboard.app;`;
      return value;
    }

    console.warn(`Cookie ${cookieKey} not found on current domain`);
    return null;
  }

  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const cookie = cookies.find(cookie => cookie.startsWith(`${cookieKey}=`));

  if (cookie) {
    const value = decodeURIComponent(cookie.split('=')[1]);
    document.cookie = `${cookieKey}=; Max-Age=0; path=/;`;
    return value;
  }

  return null;
};
