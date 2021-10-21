import Loader from 'components/layout/Loader';
import { AuthContext } from 'app/contexts/AuthContext';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const Auth = ({ authRoute }) => {
    const {
		authState: { loading, isAuthenticated }
	} = useContext(AuthContext)

	let body

	if (loading)
		body = (
			<Loader/>
		)
	else if (isAuthenticated) return <Redirect to='/chat' />
	else
		body = (
			<>
				{authRoute === 'login' && <Login />}
				{authRoute === 'register' && <Register />}
			</>
		)

    return (
        <div className="container container-fluid">
            {body}
        </div>
    );
};

export default Auth;