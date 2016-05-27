// Collections

PatientSettings = new Mongo.Collection("patientSettings");

PatientSettings.allow({
    insert: function(userId, data) { return true; },
    remove: function(userId, data) { return true; },
    update: function(userId, data) { return true; }
});

/*
PatientAppointments = new Mongo.Collection("patientAppointments");

PatientAppointments.allow({
    insert: function(userId, data) { return true; },
    remove: function(userId, data) { return true; },
    update: function(userId, data) { return true; }
});

PatientAppointmentDetails = new Mongo.Collection("patientAppointmentDetails");

PatientAppointmentDetails.allow({
    insert: function(userId, data) { return true; },
    remove: function(userId, data) { return true; },
    update: function(userId, data) { return true; }
});
*/
LocationLinks = new Mongo.Collection("locationLinks");

LocationLinks.allow({
    insert: function(userId, data) { return true; },
    remove: function(userId, data) { return true; },
    update: function(userId, data) { return true; }
});
