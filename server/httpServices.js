process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

Meteor.methods({
    callUGBroka: function (url, verbType, thisDevice, thisSecret) {
      this.unblock();

      try {
        var result = HTTP.call(verbType, url,
        {
          headers: {"UltraGenda.Device.Id": thisDevice, "UltraGenda.Device.SharedSecret": thisSecret},
          followRedirects: true
        })
//        console.log(result.content);

        return result.content;
      } catch (e) {
        console.log(e);
      };

    },
    clearAppointments: function( thisId) {
      console.log("Removing all entries for " + thisId);
//      PatientAppointments.remove({userId: thisId});
//      PatientAppointmentDetails.remove({userId: thisId});
    },
    checkDeviceState: function(url, verbType) {
      this.unblock();

      try {
        var result = HTTP.call(verbType, url,
        {
          followRedirects: true
        })
//        console.log(result.content);

        return result.content;
      } catch (e) {
        console.log(e);
      };
    },
    removeUser: function(userName) {
      var userId;

      userId = Meteor.users.findOne({username: userName});

      Meteor.users.remove({_id: userId._id});
    },
    createUGUser: function(deviceId, userName, passwordText, activationCode, deviceName, personName) {

      var userId = Accounts.createUser({
        username: userName,
        password: passwordText,
        profile: { name: personName}
      });

      // OK, we have created the user... now we need to activate this device

      this.unblock();

      var urlString = "https://schedulingdemo.healthhost.net/UltraGendaBrokaMobilityWebAPI/api/devices";

      try {
        var result = HTTP.call("POST", urlString,
        {
          data: {
            OneTimePassword: activationCode,
            Model: deviceName
          },
          followRedirects: true
        })
//        console.log(result.content);

        return result.content;
      } catch (e) {
        console.log(e);
      };
    },
    createPatientSetting: function(deviceId, secretValue, userName) {
        userId = Meteor.users.findOne({username: userName})._id;

        PatientSettings.insert({
          userId: userId,
          secret: secretValue,
          deviceId: deviceId
        });

    }
  });
