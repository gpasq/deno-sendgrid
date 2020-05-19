import { sendSimpleMail } from "./mod.ts";

await sendSimpleMail(
  {
    subject: "Hello world",
    to: [{ email: "greg@pasq.net" }],
    from: { email: "greg@pasq.net" },
    content: [
      { type: "text/plain", value: "Hello world" },
      { type: "text/html", value: "<h1>Hello world</h1>" },
    ],
  },
  {
    apiKey: "REDACTED",
  },
);

console.log("Done");
