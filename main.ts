import { sendMail, sendSimpleMail } from "./mod.ts";

let result = await sendMail(
  {
    personalizations: [{
      subject: "Hello world",
      to: [{ email: "greg@pasq.net" }],
      dynamicTemplateData: {
        firstName: "Greg",
        lastName: "Pasquariello",
        email: "foo@bar.com",
      },
    }],
    from: { email: "greg@pasq.net" },
    content: [
      { type: "text/plain", value: "Hello world" },
      { type: "text/html", value: "<h1>Hello world</h1>" },
    ],
    templateId: "d-0f4e9fbba9a84ac3800fe3373be7f891",
  },
  {
    apiKey: "REDACTED",
  },
);

console.log(result);

// await sendSimpleMail(
//   {
//     subject: "Hello world",
//     to: [{ email: "greg@pasq.net" }],
//     from: { email: "greg@pasq.net" },
//     content: [
//       { type: "text/plain", value: "Hello world" },
//       { type: "text/html", value: "<h1>Hello world</h1>" },
//     ],
//   },
//   {
//     apiKey: "REDACTED",
//   },
// );

console.log("Done");
