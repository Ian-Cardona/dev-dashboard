import type { UserResponsePublic } from '../../../shared/src/types/user.type';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { authApi } from '../lib/auth';
import { userApi } from '../lib/user';
import { isAxiosError } from 'axios';
import {
  type Dispatch,
  type ReactNode,
  createContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';

type State = {
  authUser: UserResponsePublic | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
};

const initialState: State = {
  authUser: null,
  status: 'loading',
};

export const AUTH_REDUCER_ACTION_TYPE = {
  SET_AUTH: 'SET_AUTH',
  CLEAR_AUTH: 'CLEAR_AUTH',
} as const;

type Action =
  | {
      type: typeof AUTH_REDUCER_ACTION_TYPE.SET_AUTH;
      payload: UserResponsePublic;
    }
  | {
      type: typeof AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH;
    };

type AuthContextType = {
  state: State;
  dispatch: Dispatch<Action>;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case AUTH_REDUCER_ACTION_TYPE.SET_AUTH:
      return { authUser: action.payload, status: 'authenticated' };
    case AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH:
      return { authUser: null, status: 'unauthenticated' };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const effectRan = useRef(false);

  useEffect(() => {
    const hydrateAuth = async () => {
      if (import.meta.env.DEV && effectRan.current === true) {
        return;
      }

      try {
        const response = await authApi.refresh();
        localStorage.setItem('accessToken', response.accessToken);

        const user = await userApi.getProfile();
        dispatch({ type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH, payload: user });
      } catch (error) {
        if (isAxiosError(error)) {
          dispatch({ type: AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH });
        }
      }
    };

    hydrateAuth();

    return () => {
      if (import.meta.env.DEV) {
        effectRan.current = true;
      }
    };
  }, []);

  if (state.status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
