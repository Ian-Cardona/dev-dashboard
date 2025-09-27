const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

export default LoadingSpinner;
