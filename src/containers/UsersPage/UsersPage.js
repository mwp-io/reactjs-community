import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';
import { ascendingBy } from 'utils';
// STORE
import { loadUsers } from 'redux/modules/usersModule';
// COMPONENTS
import { LoadingScreen } from 'components';
// LAYOUT
import Grid from 'react-bootstrap/lib/Grid';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import styles from './UsersPage.scss';

const mappedState = ({ auth, users }) => ({
  user: auth.user,
  users: users.all,
  loadingUsers: users.loadingUsers,
  usersLoaded: users.usersLoaded,
});

const mappedActions = {
  loadUsers,
  pushState: push
};

@connect(mappedState, mappedActions)
class UsersPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    users: PropTypes.array.isRequired,
    loadingUsers: PropTypes.bool.isRequired,
    usersLoaded: PropTypes.bool.isRequired,
    loadUsers: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  }

  componentWillMount() {
    if (!this.props.usersLoaded) this.props.loadUsers();
  }

  handleUserClick(userId) {
    // If user clicked on himself, redirect him to his profile page. Otherwise show user details.
    const route = userId === this.props.user.id ? '/profile' : `/user/${userId}`;
    this.props.pushState(route);
  }

  render() {
    return (
      <LoadingScreen loading={this.props.loadingUsers}>
        <Grid className={styles.UsersPage}>
          <h1>Users</h1>
          <List>
            {
              this.props.users.sort(ascendingBy('firstName')).map((user) => {
                const date = moment(user.createdAt).format('MMMM Do YYYY');
                return (
                  <ListItem
                    key={user.id}
                    primaryText={`${user.firstName} ${user.lastName}`}
                    secondaryText={`User since: ${date}`}
                    leftAvatar={<Avatar src={user.pictureURL} />}
                    onClick={() => this.handleUserClick(user.id)}
                  />
                );
              })
            }
          </List>
        </Grid>
      </LoadingScreen>
    );
  }
}

export default UsersPage;
