import {
  assertEquals,
  assertStrictEq,
  assert,
} from "https://deno.land/std/testing/asserts.ts";

import { sendMail, IRequestBody } from "./mod.ts";

Deno.test({
  name: "Testing Simple Email",
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
