#!/usr/local/bin/deno run
const {
  args,
} = Deno;

const sendgridUri = "https://api.sendgrid.com/v3/mail/send";

export interface IOptions {
  apiKey: string;
}

export interface IResult {
  success: boolean;
  errors?: string[];
}

export interface IAddress {
  email: string;
  name?: string;
}

export interface IHeader {
  name: string;
  value: string;
}

export interface IContent {
  type: string;
  value: string;
}

export interface IAttachment {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
  contentId?: string;
}

export interface IPersonalization {
  to: IAddress[];
  cc?: IAddress[];
  bcc?: IAddress[];
  subject: string;
  headers?: IHeader[];
}

export interface IRequestBody {
  personalizations: IPersonalization[];
  from: IAddress;
  reply_to?: IAddress;
  headers?: IHeader[];
  content: IContent[];
  attachments?: IAttachment[];
  templateId?: string;
}

export const sendMail = async (
  requestBody: IRequestBody,
  options: IOptions,
): Promise<IResult> => {
  let json = JSON.stringify(requestBody);

  const response = await fetch(sendgridUri, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${options.apiKey}`,
      "content-type": "application/json",
    },
    body: json,
  });

  let result: IResult = {
    success: true,
  };

  //
  // This will cause an exception from SendGrid, because SendGrid returns an
  // empty JSON body.  However, if you don't call it, you'll leak a resource
  // that doesn't appear to have a close().
  //
  try {
    let responseBody = await response.json();
    if (responseBody) {
      result.success = false;
      result.errors = responseBody.errors;
    }
  } catch (ex) {}

  return result;
};
