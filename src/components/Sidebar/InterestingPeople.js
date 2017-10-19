import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import User from './User';
import Loading from '../../components/Icon/Loading';
import './InterestingPeople.less';
import steemAPI from '../../steemAPI';

class InterestingPeople extends Component {
  static propTypes = {
    authenticatedUser: PropTypes.shape({
      name: PropTypes.string,
    }),
    authFetching: PropTypes.bool,
  };

  static defaultProps = {
    authenticatedUser: {
      name: '',
    },
    authFetching: false,
  };

  state = {
    users: [],
    loading: true,
    noUsers: false,
  };

  componentWillMount() {
    if (!this.props.authFetching) {
      const authenticatedUsername = this.props.authenticatedUser.name;
      const usernameValidator = window.location.pathname.match(/@(.*)/);
      const username = usernameValidator ? usernameValidator[1] : authenticatedUsername;
      this.getBlogAuthors(username);
    }
  }

  componentWillReceiveProps(nextProps) {
    const diffAuthUser =
      JSON.stringify(this.props.authenticatedUser) !== JSON.stringify(nextProps.authenticatedUser);

    if (diffAuthUser) {
      const usernameValidator = window.location.pathname.match(/@(.*)/);
      const username = usernameValidator ? usernameValidator[1] : nextProps.authenticatedUser.name;
      this.getBlogAuthors(username);
    }
  }

  getUsersAccountDetails = (usersQuery = []) =>
    steemAPI.getAccountsAsync(usersQuery).then((result) => {
      const users = _.map(result, (user) => {
        try {
          const about = JSON.parse(user.json_metadata).profile.about;
          return {
            ...user,
            about,
          };
        } catch (e) {
          return { ...user, about: '' };
        }
      });
      this.setState({
        users,
        loading: false,
        noUsers: false,
      });
    });

  getBlogAuthors = (username = '') =>
    steemAPI.getBlogAuthorsAsync(username).then((result) => {
      const users = _.sortBy(result, user => user[1]).reverse().slice(0, 3).map(user => user[0]);
      if (users.length >= 3) {
        this.getUsersAccountDetails(users);
      } else {
        this.setState({
          noUsers: true,
        });
      }
    });

  render() {
    const { users, loading, noUsers } = this.state;

    if (noUsers) {
      return <div />;
    }

    if (loading) {
      return <Loading />;
    }

    return (
      <div className="InterestingPeople">
        <div className="InterestingPeople__container">
          <h4 className="InterestingPeople__title">
            <i className="iconfont icon-group InterestingPeople__icon" />
            {' '}
            <FormattedMessage id="interesting_people" defaultMessage="Interesting People" />
          </h4>
          <div className="InterestingPeople__divider" />
          {users && users.map(user => <User key={user.name} user={user} />)}
          <h4 className="InterestingPeople__more">
            <Link to={'/latest-comments'}>
              <FormattedMessage id="discover_more_people" defaultMessage="Discover More People" />
            </Link>
          </h4>
        </div>
      </div>
    );
  }
}

export default InterestingPeople;
