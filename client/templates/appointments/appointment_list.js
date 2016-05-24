Template.appointmentList.onCreated(function() {
  Session.set("resetAppointments", true);
  Session.setDefault("isLoading", true);
});

Template.appointmentList.helpers({
  appointmentLoaded: function() {
//    if (PatientAppointments.find().count() === 0) {
//      return false
//    } else {
//      return true
//    }

    if (Session.get("isLoading") === true){
      return false
    } else {
      return true
    }
  },
  loading: function() {
    return Session.get("isLoading")
  },
  isResetAppointments: function() {
    return Session.get("resetAppointments")
  },
  resetAppointments: function() {
    if (Session.get("resetAppointments") === true ) {

//    PatientAppointments = new Mongo.Collection(null);

    var deviceId;
    var secretValue;

// debugger

    Meteor.call("clearAppointments", Meteor.userId(), function(e, r) {

          pat = PatientSettings.findOne({userId: Meteor.userId()});

          deviceId = pat.deviceId;
          secretValue = pat.secret;

          Meteor.call("callUGBroka", "https://schedulingdemo.healthhost.net/UltraGendaBrokaMobilityWebAPI/api/patient/appointments/", "GET", deviceId, secretValue, function(e, result) {

            console.log (JSON.parse(result));
            jsonResult= JSON.parse(result);

            for (i = 0; i < jsonResult.length; i++) {

              var appEntry = PatientAppointments.insert(jsonResult[i]);
              PatientAppointments.update({_id: appEntry}, { $set: { userId: Meteor.userId() }});

              var urlString;

              urlString = jsonResult[i].links[1].href;
              urlString = urlString.replace("http://10.1.1.63", "https://schedulingdemo.healthhost.net");


              Meteor.call("callUGBroka", urlString, "GET", deviceId, secretValue, function(eInner, resultInner) {

                  jsonDetail = JSON.parse(resultInner);
                  var detailEntry = PatientAppointmentDetails.insert(jsonDetail);
                  PatientAppointmentDetails.update({_id: detailEntry}, {$set: {userId: Meteor.userId() }});
              });
            }

            Session.set("resetAppointments", false);
            Session.set("isLoading", false);

          });

        });
}
  },
  appointments: function() {
//    debugger
    return PatientAppointments.find()
  }
});
