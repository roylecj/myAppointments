Template.appointmentItem.onCreated(function() {
  Session.setDefault("PageToShow", "1" );
  Session.setDefault("currentRecord", this._id);
  Session.setDefault("MapShown", false);
});
Template.appointmentItem.helpers({
  pageShown: function(pageNum) {

    if (Session.get("currentRecord") === this._id) {
      currValue = Session.get("PageToShow");
    } else {
      currValue = "1";
    }

    return (currValue === pageNum)
  },
  mapShown: function() {
    if (Session.get("currentRecord") === this._id) {
      return Session.get("MapShown")
    } else {
      return false
    }
  },
  isCurrentRecord: function() {
    if (Session.get("currentRecord") === this._id) {
      return true
    } else {
      return false
    }
  },
  appointmentDateTime: function() {
    appTime = moment(this.appointmentDateTime);

    detailRecord = PatientAppointmentDetails.findOne({"appointmentInTheContextOfAUser.appointment.id": this.id, userId: Meteor.userId()});
    Session.set("appointmentDetails_" + this._id,  detailRecord);

    return appTime.format("LLLL");
  },
  appointmentTypeName: function() {
    return this.appointmentTypeName
  },
  departmentName: function() {
    return this.departmentName
  },
  siteName: function() {
    return this.siteName
  },
  daysAway: function() {
    appTime = moment(this.appointmentDateTime);

    return appTime.fromNow();
  },
  instructions: function() {
    // detailRecord = PatientAppointmentDetails.findOne({"appointmentInTheContextOfAUser.appointment.id": this.id, userId: Meteor.userId()});

    detailRecord = Session.get("appointmentDetails_" + this._id);
    var instructList;
    var myInstructions = "";

    instructList = detailRecord.appointmentInTheContextOfAUser.appointment.instructions;

    for (i = 0; i < instructList.length; i++ ) {
      if (instructList[i].isForPatient === true) {
        myInstructions = myInstructions + instructList[i].text;
      }
    }

    return myInstructions
  },
  canCancel: function() {
//    detailRecord = PatientAppointmentDetails.findOne({"appointmentInTheContextOfAUser.appointment.id": this.id, userId: Meteor.userId()});
  detailRecord = Session.get("appointmentDetails_" + this._id);
    var canCancelAppt;

    canCancelAppt = detailRecord.appointmentInTheContextOfAUser.userCanCancelAppointment;

    if (canCancelAppt === true) {
      return true
    } else {
      return false
    }
  },
  sitePhone: function() {
//    detailRecord = PatientAppointmentDetails.findOne({"appointmentInTheContextOfAUser.appointment.id": this.id, userId: Meteor.userId()});
  detailRecord = Session.get("appointmentDetails_" + this._id);

    var sitePhoneNumber;

    sitePhoneNumber = detailRecord.appointmentInTheContextOfAUser.appointment.site.phones[0].number;

    return sitePhoneNumber
  },
  duration: function() {
      detailRecord = Session.get("appointmentDetails_" + this._id);

      var dur = detailRecord.appointmentInTheContextOfAUser.appointment.durationInMinutes + " minutes";

      return dur
  },
  address: function() {
    detailRecord = Session.get("appointmentDetails_" + this._id);

    var dur = detailRecord.appointmentInTheContextOfAUser.appointment.location.description;

    return dur
  },
  addressLine2: function() {
    detailRecord = Session.get("appointmentDetails_" + this._id);

    var dur = ""
    dur = detailRecord.appointmentInTheContextOfAUser.appointment.site.address.street1 + " " + detailRecord.appointmentInTheContextOfAUser.appointment.site.address.street2 + " " + detailRecord.appointmentInTheContextOfAUser.appointment.site.address.city + " " + detailRecord.appointmentInTheContextOfAUser.appointment.site.address.state + " " + detailRecord.appointmentInTheContextOfAUser.appointment.site.address.zipCode;

    return dur
  },
  resourceName: function() {
    detailRecord = Session.get("appointmentDetails_" + this._id);

    var value = ""
    value = detailRecord.appointmentInTheContextOfAUser.appointment.resource.name;

    return value
  },
  onlineBookingCode: function() {
    detailRecord = Session.get("appointmentDetails_" + this._id);

    var bookingCode = detailRecord.appointmentInTheContextOfAUser.appointment.patient.onlineBookingCode;

    return bookingCode
  },
  exampleMapOptions: function() {
  // Make sure the maps API has loaded

  var thisLat;
  var thisLong;

// debugger
  detailRecord = Session.get("appointmentDetails_" + this._id);

  locationRecord = LocationLinks.findOne({name: detailRecord.appointmentInTheContextOfAUser.appointment.site.abbreviation})

  thisLat = locationRecord.lat;
  thisLong = locationRecord.long;

  if (GoogleMaps.loaded()) {
    // Map initialization options
    return {
      center: new google.maps.LatLng(thisLat, thisLong),
      zoom: 17
    };
  }
}
});

Template.appointmentItem.events({
  'click .cancelAppointment': function(e, t) {
    var thisLink;

    thisLink = this.links[2].href;
    thisLink = thisLink.replace("http://10.1.1.63/", "https://schedulingdemo.healthhost.net/");

    // So we have the cancel appointment link

    var deviceId;
    var secretValue;

    pat = PatientSettings.findOne({userId: Meteor.userId()});

    deviceId = pat.deviceId;
    secretValue = pat.secret;

    thisId = this._id;

    Meteor.call("callUGBroka", thisLink,"POST", deviceId, secretValue, function(e, result) {

      PatientAppointments.remove({_id: thisId});
      // Session.set("resetAppointments", true);

      sAlert.success("Appointment Cancelled!");
    });
  },
  'click .btnNextPage': function(e, t) {
    if (Session.get("currentRecord") === this._id) {
      if (Session.get("PageToShow") === "1") {
        Session.set("PageToShow", "2")
      } else {
        Session.set("PageToShow", "1")
      }
    } else {
      Session.set("currentRecord", this._id);
      Session.set("PageToShow", "2");
      }

  },
  'click .mapItem': function(e, t) {
    if (Session.get("currentRecord") === this._id) {
      Session.set("MapShown", ! Session.get("MapShown"));
    } else {
      Session.set("currentRecord", this._id);
      Session.set("MapShown", true);
    }
  }
});
