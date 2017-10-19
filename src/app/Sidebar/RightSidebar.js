import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { getIsAuthenticated, getAuthenticatedUser, getIsAuthFetching } from '../../reducers';

import InterestingPeople from '../../components/Sidebar/InterestingPeople';
import StartNow from '../../components/Sidebar/StartNow';
import SignUp from '../../components/Sidebar/SignUp';

@connect(state => ({
  authenticated: getIsAuthenticated(state),
  authenticatedUser: getAuthenticatedUser(state),
  authFetching: getIsAuthFetching(state),
}))
export default class RightSidebar extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    authenticatedUser: PropTypes.shape().isRequired,
    authFetching: PropTypes.bool.isRequired,
  };

  render() {
    const { authenticated, authenticatedUser, authFetching } = this.props;

    return (
      <div>
        {!authenticated && <SignUp />}
        <Switch>
          <Route
            path="/@:name"
            component={() => (
              <InterestingPeople
                authenticatedUser={authenticatedUser}
                authFetching={authFetching}
              />
            )}
          />
          <Route
            path="/"
            render={() => (
              <div>
                {authenticatedUser.last_root_post === '1970-01-01T00:00:00' && <StartNow />}
                <InterestingPeople
                  authenticatedUser={authenticatedUser}
                  authFetching={authFetching}
                />
              </div>
            )}
          />
        </Switch>
      </div>
    );
  }
}
