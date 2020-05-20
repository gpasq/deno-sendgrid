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

// This is a throwaway key for testing a limited number of emails only,
// from a throwaway account.  Sorta like giving you my keys, but the keys
// are to an outhouse.
const key =
  "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";

Deno.test({
  name: "Testing Simple Email",
  async fn(): Promise<void> {
    let response = await sendSimpleMail(
      {
        subject: "Hello world",
        to: [{ email: "denotest2020@gmail.com" }],
        from: { email: "denotest2020@gmail.com" },
        content: [
          { type: "text/plain", value: "Hello world" },
          { type: "text/html", value: "<h1>Hello world</h1>" },
        ],
      },
      { apiKey: key },
    );

    console.log(response);
    assertEquals(response.success, true);
  },
});

Deno.test({
  name: "Testing Full Email",
  async fn(): Promise<void> {
    let mail: IRequestBody = {
      personalizations: [
        {
          subject: "Hello world",
          to: [{ name: "DenoTest2020", email: "denotest2020@gmail.com" }],
        },
      ],
      from: { email: "denotest2020@gmail.com" },
      content: [
        { type: "text/plain", value: "Hello world" },
        { type: "text/html", value: "<h1>Hello world</h1>" },
      ],
    };

    let response = await sendMail(mail, { apiKey: key });

    console.log(response);
    assertEquals(response.success, true);
  },
});
