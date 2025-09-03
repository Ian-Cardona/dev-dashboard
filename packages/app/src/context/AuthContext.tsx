import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import { authApi } from '../lib/auth';
import { isAxiosError } from 'axios';
import type { UserResponsePublic } from '../../../shared/src/types/user.type';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { userApi } from '../lib/user';

type State = {
  authUser: UserResponsePublic | null;
  isLoading: boolean;
};

const initialState: State = {
  authUser: null,
  isLoading: true,
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
      return { authUser: action.payload, isLoading: false };
    case AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH:
      return { authUser: null, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const hydrateAuth = async () => {
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
  }, []);

  if (state.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
