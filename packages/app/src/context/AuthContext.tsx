import {
  createContext,
  useReducer,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { AuthenticationSuccessResponse } from '../../../shared/types/auth.type';
import { auth } from '../lib/auth';

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

// TODO: Validate approach if correct
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case AUTH_REDUCER_ACTION_TYPE.SET_AUTH:
      localStorage.setItem('userId', action.payload.user.userId);
      return action.payload;
    case AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH:
      localStorage.removeItem('userId');
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
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        setInitializing(false);
        return;
      }

      try {
        const data = await auth.refresh({
          signal: controller.signal,
          userId: storedUserId,
        });

        dispatch({ type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH, payload: data });
      } catch (err: unknown) {
        if (err instanceof Response) {
          if (err.status === 401 || err.status === 419) {
            dispatch({ type: AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH });
            localStorage.removeItem('userId');
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setInitializing(false);
        }
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
