# Deno-SendGrid
This is an early implementation of SendGrid for Deno.  This first version can send basic text
or HTML email.  I'll be beefing it up over the next couple of weeks to fully support the platform.

Sending simple email is easy.  This is the entire program:
```
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
```

You can send a full-blown SendGrid email packet as well (still limited in this release)

```
import { sendMail, IRequestBody } from "https://deno.land/x/sendgrid/mod.ts";

let mail: IRequestBody = {
    personalizations: [
    {
        subject: "Hello world",
        to: [{ name: "Greg Pasquariello", email: "foo@bar.com" }],
    },
    ],
    from: { email: "foo@bar.com" },
    content: [
    { type: "text/plain", value: "Hello world" },
    { type: "text/html", value: "<h1>Hello world</h1>" },
    ],
};

let response = await sendMail(mail, { apiKey: "REDACTED" });
```

The entire mail body is documented at https://sendgrid.com/docs/api-reference/.  At the moment the supported schema is limited to the following. The rest will be available shortly.

```
export interface IAddress {
  email: string;
  name?: string;
}

export interface IContent {
  type: string;
  value: string;
}

export interface IPersonalization {
  to: IAddress[];
  cc?: IAddress[];
  bcc?: IAddress[];
  subject: string;
}

export interface ISimpleRequestBody {
  to: IAddress[];
  cc?: IAddress[];
  bcc?: IAddress[];
  subject: string;
  from: IAddress;
  replyTo?: IAddress;
  content: IContent[];
  attachments?: IAttachment[];
  templateId?: string;
}

export interface IRequestBody {
  personalizations: IPersonalization[];
  from: IAddress;
  replyTo?: IAddress;
  content: IContent[];
}
```

The response contains a success true/false flag, indicating whether the email was accepted by sendgrid.  If false, the response also contains an array of errors, sent back from SendGrid.  These are also documented at https://sendgrid.com/docs/api-reference/.

You will need a SendGrid API token to use this library, and `--allow-net` must be specified.

Enjoy for now, more to follow shortly!

## Release History

- Version 0.0.3, Added case translation for input object.
- Version 0.0.2, Added `sendSimpleMail`.
- Version 0.0.1, initial release.
