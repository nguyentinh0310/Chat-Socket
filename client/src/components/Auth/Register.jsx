import { AuthContext } from 'app/contexts/AuthContext';
import AlertMessage from 'components/layout/AlertMessage';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
const Register = () => {
  const { register } = useContext(AuthContext);
  const [registerForm, setRegisterForm] = useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { fulname, username, password, confirmPassword } = registerForm;
  const [alert, setAlert] = useState(null);

  const handleOnChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      setAlert({ type: 'danger', message: "Mật khẩu không khớp 😞" });
      setTimeout(() => setAlert(null), 5000);
      return
    }

    try {
      const registerData = await register(registerForm);
      if (!registerData.success) {
        setAlert({ type: 'danger', message: registerData.message });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow-lg mb-5" onSubmit={handleSubmit}>
          <h1 className="mb-3 title">Chat App</h1>

          <h3 className="mb-3 title">Đăng ký</h3>

          <div className="form-group">
            <label htmlFor="fullname_field">Họ tên</label>
            <input
              type="name"
              className="form-control"
              name="fullname"
              value={fulname}
              onChange={handleOnChange}
            />
          </div>
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
              className="form-control"
              name="password"
              value={password}
              onChange={handleOnChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="cf_password_field">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
            />
          </div>
          <AlertMessage info={alert} />
          <button type="submit" className="btn btn-block mt-4">
            Đăng ký
          </button>

          <Link to="/login" className="d-flex justify-content-center mt-3">
            Đăng nhập
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
