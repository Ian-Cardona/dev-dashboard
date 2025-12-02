import { queryClient } from './lib/tanstack/queryClient';
import { routeTree } from './routeTree.gen';
import { RouterProvider } from '@tanstack/react-router';
import { createRouter } from '@tanstack/react-router';

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
});

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
