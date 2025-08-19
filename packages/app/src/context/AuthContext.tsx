import {
  createContext,
  useReducer,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { AuthenticationSuccessResponse } from '../../../shared/types/auth.type';

type State = AuthenticationSuccessResponse | null;

export const AUTH_REDUCER_ACTION_TYPE = {
  SET_AUTH: 'SET_AUTH',
  CLEAR_AUTH: 'CLEAR_AUTH',
} as const;

type Action =
  | {
      type: typeof AUTH_REDUCER_ACTION_TYPE.SET_AUTH;
      payload: AuthenticationSuccessResponse;
    }
  | { type: typeof AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH };

type AuthContextType = {
  state: State;
  dispatch: Dispatch<Action>;
  initializing: boolean;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case AUTH_REDUCER_ACTION_TYPE.SET_AUTH:
      // TODO: Add anything here
      // if (import.meta.env.DEV) console.debug("SET_AUTH"); // never log payloads
      return action.payload;
    case AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH:
      return null;
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include', // TODO: send HttpOnly refresh cookie
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        });

        if (res.ok) {
          const ct = res.headers.get('content-type') ?? '';
          if (ct.includes('application/json')) {
            const data = (await res.json()) as AuthenticationSuccessResponse;
            dispatch({
              type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH,
              payload: data,
            });
          } else {
            // Treat unexpected/no content as unauthenticated
            dispatch({ type: AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH });
          }
        } else if (res.status === 401 || res.status === 419) {
          // Auth invalid/expired
          dispatch({ type: AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH });
        } else {
          // Server trouble; do not nuke state on transient issues
          // Optionally surface a toast/metric here
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          // Network error; leave state as-is
        }
      } finally {
        if (!controller.signal.aborted) setInitializing(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
