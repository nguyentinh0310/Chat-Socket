import { AuthContext } from 'app/contexts/AuthContext';
import React, { Fragment, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AlertMessage from 'components/layout/AlertMessage';

const Login = () => {
  const { login } = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  const { username, password } = loginForm;
  const [alert, setAlert] = useState(null);

  const handleOnChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = await login(loginForm);
      if (!loginData.success) {
        setAlert({ type: 'danger', message: loginData.message });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Fragment>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={handleSubmit}>
            <h1 className="mb-3 title">Chat App</h1>
            <h3 className="mb-3 title">Đăng Nhập</h3>
            <div className="form-group">
              <label htmlFor="username_field">Username</label>
              <input
                type="name"
                className="form-control"
                name="username"
                value={username}
                onChange={handleOnChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Mật khẩu</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={handleOnChange}
              />
            </div>

            <AlertMessage info={alert} />

            <button type="submit" className="btn btn-block mt-4">
              Đăng nhập
            </button>

            <Link to="/register" className="d-flex justify-content-center mt-3">
              Tạo tài khoản?
            </Link>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
