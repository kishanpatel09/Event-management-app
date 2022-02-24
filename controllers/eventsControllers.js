const Events = require("../models/eventSchema");
const nodemailer = require("nodemailer");
const User = require("../models/User");
var CronJob = require("cron").CronJob;

//showing all Events
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Events.find();
    res.json({ count: events.length, data: events });
  } catch (error) {
    res.send("error");
  }
};

//showing only one events
exports.getEvent = async (req, res, next) => {
  try {
    const event = await Events.findById(req.params.id);
    res.json({ data: event });
  } catch (error) {
    res.send("error");
  }
};

//create events
exports.createEvents = async (req, res, next) => {
  try {
    const events = await Events.create(req.body);
    const users = await User.find({ _id: events.emailList });
    const email = users.map((val) => val.email);
    res.json({
      succcess: true,
      data: events,
    });

    //****************************************SENDING EMAIL TO ALL INVITEES*********************************

    var transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "d047b0ef454090",
        pass: "803473c2558670",
      },
    });
    try {
      function createInvite(email) {
        return {
          from: "nodej6621@gmail.com",
          to: email,
          subject: `You are invited to an ${req.body.title}`,
          html: ` <h3>You are invited to ${req.body.title} at address ${req.body.address} at time ${req.body.time} </h3>`,
        };
      }
      transporter.sendMail(createInvite(email), (err, info) => {
        if (err) {
          throw err;
        }
        if (done) {
          done(info);
        }
      });
    } catch (error) {
      console.log(`Error in sending error ${error}`);
    }

    //--------------------------------NOTIFYING BEFORE 5 MIN -----------------------------------------

    var job = new CronJob("* * * * * *", function () {
      if (
        332000 < events.time - Date.now() &&
        events.time - Date.now() < 333000
      ) {
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "d047b0ef454090",
            pass: "803473c2558670",
          },
        });
        function createInvite(email) {
          return {
            from: "nodej6621@gmail.com",
            to: email,
            subject: `You are notified to an ${req.body.title} `,
            html: ` <h3>Notification to an ${req.body.title} event at address ${req.body.address} at time ${req.body.time}</h3>`,
          };
        }
        transporter.sendMail(createInvite(email), (err, info) => {
          if (err) {
            throw err;
          }
          if (done) {
            done(info);
          }
        });
      }
    });

    job.start();
  } catch (error) {
    res.json({ succcess: false, error: error }).status(400);
  }
};

//=*=*=*=*=*==*=*=*=*=*=*=*=*=*==*=*=*=*=*=*=**=*==*=*=*=*=*=*=*=*=*=**=*=*=*=*=*=*=*=*=*=*=*=*==*=*=*=*=**=*=*=*=*

//updating events
exports.updateEvents = async (req, res, next) => {
  try {
    let events = await Events.findById(req.params.id);
    events = await Events.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ succcess: true, data: events });
  } catch (e) {
    res
      .json({ succcess: false, data: "you are not authorised to update event" })
      .status(400);
  }
};

//deleting events
exports.deleteEvents = async (req, res, next) => {
  try {
    const event = await Events.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.send("no such event");
    }
    res.json({ succcess: true, data: event });
  } catch (e) {
    res
      .json({ succcess: false, data: "you are not authorised to delete event" })
      .status(400);
  }
};
