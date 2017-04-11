import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import DayPicker from 'react-day-picker';
// STORE
import { loadEvents } from 'redux/modules/eventsModule';
// COMPONENTS
import { LoadingScreen } from 'components';

const debug = false;
const now = moment();
const pastDays = day => moment(day).isBefore(now, 'day');

const mappedState = ({ events }) => ({
  events: events.all,
  loadingEvents: events.loadingEvents,
  eventsLoaded: events.eventsLoaded
});

const mappedActions = { loadEvents };

@connect(mappedState, mappedActions)
export default class EventsCalendar extends Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
    loadingEvents: PropTypes.bool.isRequired,
    eventsLoaded: PropTypes.bool.isRequired,
    loadEvents: PropTypes.func.isRequired
  }

  state = { selectedDay: now.toDate() }

  componentWillMount() {
    if (!this.props.eventsLoaded && !this.props.loadingEvents) this.props.loadEvents();
  }

  handleDayClick = (day, modifiers) => {
    if (modifiers.disabled) return;

    if (debug) console.info('Clicked date:', day, modifiers);

    this.setState({ selectedDay: modifiers.selected ? null : day });
  }

  render() {
    return (
      <LoadingScreen loading={this.props.loadingEvents}>
        <DayPicker
          initialMonth={now.toDate()}
          disabledDays={pastDays}
          selectedDays={this.state.selectedDay}
          onDayClick={this.handleDayClick}
          modifiers={{
            hasEvent: (day) => {
              // Mark days that has the same date as an event
              return !!this.props.events.find(event => moment(day).isSame(moment(event.date), 'day'));
            }
          }}
        />
      </LoadingScreen>
    );
  }
}