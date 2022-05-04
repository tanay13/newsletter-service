const { client } = require("./connections/redis")
const nodemailer = require("nodemailer");

function scheduledMail()
{

    const currTime = new Date()

    const latestScheduledMail = await client.get("latestTime")
    const latestText = await client.get("latestData")

    if(latestScheduledMail === null || latestText === null)
        return

    const latestTime = new Date(latestScheduledMail)

    if(currTime === latestTime)
    {

        // send mail

        let transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
              user: "traj13122001@outlook.com",
              pass: "lavairis504q@",
            },
          });
        
          let message = {
            from: "traj13122001@outlook.com",
            to: "tanay.raj2019@vitstudent.ac.in",
            subject: "Subject",
            text: latestText,
          };
        
          transporter.sendMail(message, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              console.log("Email sent");
            }
          });

        // set the "latestTime key to next latest time"

          


    }



}