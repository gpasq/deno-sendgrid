import {
  assertEquals,
  assertStrictEq,
  assert,
} from "https://deno.land/std/testing/asserts.ts";

import {
  sendMail,
  IRequestBody,
  sendSimpleMail,
  ISimpleRequestBody,
} from "./mod.ts";

Deno.test({
  name: "Testing Simple Email",
  async fn(): Promise<void> {
    let response = await sendSimpleMail(
      {
        subject: "Hello world",
        to: [{ email: "foo@bar.com" }],
        from: { email: "from@bar.com" },
        content: [
          { type: "text/plain", value: "Hello world" },
          { type: "text/html", value: "<h1>Hello world</h1>" },
        ],
      },
      {
        apiKey: "REDACTED",
      },
    );

    console.log(response);
    assertEquals(response.success, false);
  },
});

Deno.test({
  name: "Testing Full Email",
  async fn(): Promise<void> {
    let mail: IRequestBody = {
      personalizations: [
        {
          subject: "Hello world",
          to: [{ name: "Greg Pasquariello", email: "greg@pasq.net" }],
        },
      ],
      from: { email: "greg@pasq.net" },
      content: [
        { type: "text/plain", value: "Hello world" },
        { type: "text/html", value: "<h1>Hello world</h1>" },
      ],
    };

    let response = await sendMail(mail, { apiKey: "XXX" });

    console.log(response);
    assertEquals(response.success, false);
  },
});
