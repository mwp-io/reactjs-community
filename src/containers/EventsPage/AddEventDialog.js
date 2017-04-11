import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import _isEmpty from 'lodash/isEmpty';
import _startsWith from 'lodash/startsWith';
import AddEventForm from './AddEventForm';

const getInitialState = () => ({
  formData: {
    title: '',
    link: 'http://',
    description: '',
    location: {}
  },
  validationErrors: {
    title: '',
    link: '',
    description: '',
    location: ''
  }
});

class AddEventDialog extends Component {
  static propTypes = {
    popupVisible: PropTypes.bool.isRequired,
    addEvent: PropTypes.func.isRequired,
    closePopup: PropTypes.func.isRequired,
    addingEvent: PropTypes.bool.isRequired,
    eventAdded: PropTypes.number
  }

  state = getInitialState()

  componentWillReceiveProps(nextProps) {
    // If we successfully got a new event, close the dialog window
    if (!this.props.eventAdded && nextProps.eventAdded) {
      this.closePopup();
    }
  }

  updateForm = (property, value) => {
    const newState = { ...this.state };

    newState.formData[property] = value;
    // Hide existing validation error
    if (newState.validationErrors[property] && value) {
      newState.validationErrors[property] = '';
    }

    this.setState(newState);
  }

  // Passes event data to parent component if form is valid
  // and no request is pending
  addEvent = () => {
    if (this.validateForm() && !this.props.addingEvent) {
      this.props.addEvent(this.state.formData);
    }
  }

  // Clears state and closes dialog window
  closePopup = () => {
    this.setState(getInitialState());
    this.props.closePopup();
  }

  validateForm = () => {
    const { title, link, description, location } = this.state.formData;
    const validationErrors = {};

    if (!title) validationErrors.title = 'Title is required';
    if (!link || link === 'http://') validationErrors.link = 'Link is required';
    if (!(_startsWith(link, 'http://') || _startsWith(link, 'https://'))) validationErrors.link = 'Link must start with "http://"';
    if (!description) validationErrors.description = 'Description is required';
    if (!location.description) validationErrors.location = 'Location is required';

    this.setState({ validationErrors });

    return _isEmpty(validationErrors);
  }

  render() {
    const { popupVisible, addingEvent } = this.props;
    const { formData, validationErrors } = this.state;
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.closePopup}
      />,
      <FlatButton
        label={addingEvent ? 'Adding...' : 'Add'}
        style={{ marginLeft: 8 }}
        primary
        onTouchTap={this.addEvent}
        disabled={addingEvent}
      />
    ];

    return (
      <Dialog
        contentStyle={{ maxWidth: 500 }}
        titleStyle={{ paddingBottom: 0 }}
        title="Add new event"
        actions={actions}
        open={popupVisible}
        onRequestClose={this.closePopup}
      >
        <AddEventForm
          formData={formData}
          validationErrors={validationErrors}
          onChange={this.updateForm}
        />
      </Dialog>
    );
  }
}

export default AddEventDialog;
