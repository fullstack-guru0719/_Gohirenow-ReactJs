import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
    <Route
      {...rest}
      render={props =>{
          const { location}  = props;
          const anonUrlsAllowed = ['job-details-work', 'job-details-hire', 'client-profile'];
          const allowedUrl = anonUrlsAllowed.includes(location.pathname.split("/")[1]);
          if( localStorage.getItem('token') || allowedUrl){
                return   <Component {...props} />
            }
            else{
                return <Redirect to='/sign-In' />
            }
      }

      }
    />
  );

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
