import {
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { AuthenticationSuccessResponse } from '../../../shared/types/auth.type';
import { auth } from '../lib/auth';
import { isAxiosError } from 'axios';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

type State = {
  authenticatedUser: AuthenticationSuccessResponse | null;
  isLoading: boolean;
};

const initialState: State = {
  authenticatedUser: null,
  isLoading: true,
};

export const AUTH_REDUCER_ACTION_TYPE = {
  SET_AUTH: 'SET_AUTH',
  SET_LOADING: 'SET_LOADING',
  CLEAR_AUTH: 'CLEAR_AUTH',
} as const;

type Action =
  | {
      type: typeof AUTH_REDUCER_ACTION_TYPE.SET_AUTH;
      payload: AuthenticationSuccessResponse;
    }
  | {
      type: typeof AUTH_REDUCER_ACTION_TYPE.SET_LOADING;
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
      localStorage.setItem('userId', action.payload.user.userId);
      return { authenticatedUser: action.payload, isLoading: false };
    case AUTH_REDUCER_ACTION_TYPE.SET_LOADING:
      return { ...state, isLoading: true };
    case AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH:
      localStorage.removeItem('userId');
      return { authenticatedUser: null, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleRefresh = async () => {
      const storedUserId = localStorage.getItem('userId');

      if (!storedUserId) {
        dispatch({ type: AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH });
        return;
      }

      try {
        const response = await auth.refresh({ userId: storedUserId });
        dispatch({
          type: AUTH_REDUCER_ACTION_TYPE.SET_AUTH,
          payload: response,
        });
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          console.log(error.response.status, error.response.data);
        }
        console.log(error);
        dispatch({ type: AUTH_REDUCER_ACTION_TYPE.CLEAR_AUTH });
      }
    };

    handleRefresh();
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
