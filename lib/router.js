Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [
      Meteor.subscribe('patientSettings'),
      Meteor.subscribe("userDirectory"),
      Meteor.subscribe("patientAppointments"),
      Meteor.subscribe("locationLinks"),
      Meteor.subscribe("patientAppointmentDetails")
    ];
  }
});

Router.route('/', {name: 'login'});
Router.route('/appointmentList', {name: 'appointmentList'});
Router.route('/appointment/:_id', {name: 'appointmentItem'});
