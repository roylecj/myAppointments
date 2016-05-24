Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.login.onCreated(function() {
    Session.set('signedIn', false);
    Session.set("newUser", false);
    Session.set("newUserCreated", false);
});

Template.login.helpers({
    newUser: function() {
      return Session.get("newUser");
    },
    createUserText: function() {
      if (Session.get("newUser") === true) {
        return "Save"
      } else {
        return "Create User"
      }
    },
    createUserStatus: function() {
      if (Session.get("newUser") === true) {
        return "btn-success"
      } else {
        return "btn-info"
      }
    }
});

Template.login.events({
  'click .btnCancel': function(e) {
    Session.set("newUser", false);
  },
  'click .btnNewUser': function(e) {
    e.preventDefault();

    if (Session.get("newUser") === true) {
      // We are saving this new user

      var userName =  $(e.target.parentNode.parentNode).find('[name=loginName]').val();
      var passwordText = $(e.target.parentNode.parentNode).find('[name=password]').val();
      var activationCode = $(e.target.parentNode.parentNode).find('[name=activationCode]').val();
      var deviceName = $(e.target.parentNode.parentNode).find('[name=nickname]').val();
      var personName = $(e.target.parentNode.parentNode).find('[name=yourName]').val();

      var userCount;

      userCount = (Meteor.users.find({username: userName}).count());

      if (userCount === 0) {

        Meteor.call('createUGUser', deviceName, userName, passwordText, activationCode, deviceName, personName, function(e, result) {

          jsonResponse = JSON.parse(result);

          var deviceId;
          var secretValue;

          deviceId = jsonResponse.deviceId;
          resultInfo = jsonResponse.result;
          secretValue = jsonResponse.sharedSecret;

          if (resultInfo === "OneTimePasswordNotFound") {

            sAlert.error("One time activation code not found, please check the patient portal");

            // Remove the user...

            Meteor.call('removeUser', userName);
          } else {
            Meteor.call('createPatientSetting', deviceId, secretValue, userName);

            sAlert.success("Device added to your account, now activate in the patient portal");

            Session.set("newUser", false);
          }

        });

      } else {
        sAlert.error("This username is already used by another person, please select a new user name");
      }

    } else {
      // We are setting it to enter the pass Code

      Session.set("newUser", true);
    }
  },
  'submit form': function(e) {
    e.preventDefault();

      var userId =  $(e.target).find('[name=loginName]').val();
      var password = $(e.target).find('[name=password]').val();

      // Check the status of the device first...
      var usrId;
      var userDetails;

      if (Meteor.users.find({username: userId}).count() > 0) {
        userDetails = Meteor.users.findOne({username: userId});
        usrId = userDetails._id;

        var securityDetails;
        securityDetails = PatientSettings.findOne({userId: usrId});

        var deviceId;
        deviceId = securityDetails.deviceId;

        if (deviceId) {
          Meteor.call("checkDeviceState", "https://schedulingdemo.healthhost.net/UltraGendaBrokaMobilityWebAPI/api/devices/" + deviceId + "/status", function(e, result) {

              var jsonResponse;

              jsonResponse = JSON.parse(result);

              if (jsonResponse.status === "Unauthorised") {
                sAlert.error("This device is not yet authorised, please login to the patient portal to activate it");
                return
              } else {
                // Check to see if this user is active or not...

                Meteor.loginWithPassword(userId, password, function(e) {
                    console.log("logging in with " + userId);

                    console.log(e);

                    if (!e) {
                    Session.set('signedIn', true);
                    Router.go('appointmentList');
                  } else {
                    sAlert.error('Error logging in: ' + e.reason);
                  }
                });
              }
          });

        } else {
          sAlert.error("User not found");
        }

      }
else {
  sAlert.error("User not found");
}
  }
})
