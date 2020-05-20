import { sendMail, sendSimpleMail } from "./mod.ts";

// This is a throwaway key for testing a limited number of emails only,
// from a throwaway account.  Sorta like giving you my keys, but the keys
// are to an outhouse.
const key =
  "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";

let result = await sendMail(
  {
    personalizations: [{
      subject: "Hello world",
      to: [{ email: "denotest2020@gmail.com" }],
      dynamicTemplateData: {
        firstName: "Greg",
        lastName: "Pasquariello",
        email: "foo@bar.com",
      },
    }],
    from: { email: "denotest2020@gmail.com" },
    content: [
      { type: "text/plain", value: "Hello world" },
      { type: "text/html", value: "<h1>Hello world</h1>" },
    ],
    templateId: "d-0f4e9fbba9a84ac3800fe3373be7f891",
  },
  { apiKey: key },
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
