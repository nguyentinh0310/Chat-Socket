import Loader from 'components/layout/Loader';
import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AuthContext } from '../../app/contexts/AuthContext';
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const {
    authState: { loading, isAuthenticated },
  } = useContext(AuthContext);

  if (loading) return <Loader />;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <>
            <Component {...rest} {...props} />
          </>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
