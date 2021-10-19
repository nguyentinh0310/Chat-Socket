import axios from 'axios';
import { createContext, useEffect, useReducer } from 'react';
import setAuthToken from 'utils/setAuthToken';
import { authReducer } from '../reducers/authReducer';
import { LOCAL_STORAGE_TOKEN_NAME } from './contants';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    // trạng thái ban đầu
    loading: true,
    isAuthenticated: false,
    user: null,
  });

  // Authenticate user
  const loadUser = async () => {
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
      setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
    }
    try {
      const response = await axios.get(`/api/auth/infor`);
      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: { loading: false, isAuthenticated: true, user: response.data.user },
        });
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthToken(null);
      dispatch({
        type: 'SET_AUTH',
        payload: { isAuthenticated: false, user: null },
      });
    }
  };
  // chạy loadUser trước khi authContext render ra
  useEffect(() => loadUser(), []);
  //   login
  const login = async (userData) => {
    try {
      const response = await axios.post(`/api/auth/login`, userData);
      if (response.data.success)
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);
      // check lấy user thành công
      await loadUser();

      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: error.message };
    }
  };
  // Register
  const register = async (userData) => {
    try {
      const response = await axios.post(`/api/auth/register`, userData);
      if (response.data.success)
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);

      await loadUser();

      return response.data;
    } catch (error) {
      return error.response.data ? error.response.data : { success: false, message: error.message };
    }
  };

  // logout
  const logout = async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({
      type: 'SET_AUTH',
      payload: { isAuthenticated: false, user: null },
    });
  };

  //  context data
  const authContextData = { login, register, authState, logout };

  //   return provider
  return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
