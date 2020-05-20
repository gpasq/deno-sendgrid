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
  substitutions?: any;
  customArgs?: any;
  dynamicTemplateData?: any;
  headers?: any;
}

export interface IRequestBody {
  personalizations: IPersonalization[];
  from: IAddress;
  replyTo?: IAddress;
  content: IContent[];
  attachments?: IAttachment[];
  templateId?: string;
  headers?: any;
  sections?: any;
  categories?: string[];
  customArgs?: any;
  sendAt?: number;
  batchId?: string;
  ipPoolName?: string;
  asm?: {
    groupId: number;
    groupsToDisplay: number[];
  };
  mailSettings?: {
    bcc?: {
      enable?: boolean;
      email?: string;
    };
    bypassListManagement?: {
      enable?: boolean;
    };
    footer?: {
      enable?: boolean;
      text?: string;
      html?: string;
    };
    sandboxMode?: {
      enable?: boolean;
    };
    spamCheck?: {
      enable?: boolean;
      threshold?: number;
      postToUrl?: string;
    };
  };
  //trackingSettings?
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
  dynamicTemplateData?: any;
}

//
// Some keys shouldn't be snake cased.  These are those.
//
function isImmune(key: string): boolean {
  switch (key) {
    case "dynamicTemplateData":
    case "customArgs":
    case "headers":
    case "sections":
      return true;
    default:
      return false;
  }
}

function snakeCaseString(str: string): string {
  let result = str;

  let matches = str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g,
  );
  if (matches && matches.length) {
    matches = matches.map((x: string) => {
      return x.toLowerCase();
    });
    result = matches.join("_");
  }
  return result;
}

// function isAny(toBeDetermined: PersonOrAnimal): toBeDetermined is Animal {
//   if((toBeDetermined as Animal).type){
//     return true
//   }
//   return false
// }
// view raw

function snakeCaseObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(function (val, key) {
      return (typeof val === "object") ? snakeCaseObject(val) : val;
    });
  } else if (typeof obj === "object") {
    var res: any = {};
    for (var key in obj) {
      var val = obj[key];
      if (typeof val === "object") {
        res[snakeCaseString(key)] = isImmune(key) ? val : snakeCaseObject(val);
      } else {
        res[snakeCaseString(key)] = val;
      }
    }
    return res;
  } else {
    return obj;
  }
}

export const sendSimpleMail = async (
  requestBody: ISimpleRequestBody,
  options: IOptions,
): Promise<IResult> => {
  let mail: IRequestBody = {
    personalizations: [{
      to: requestBody.to,
      cc: requestBody.cc,
      bcc: requestBody.bcc,
      subject: requestBody.subject,
      dynamicTemplateData: requestBody.dynamicTemplateData,
    }],
    from: requestBody.from,
    replyTo: requestBody.replyTo,
    content: requestBody.content,
    attachments: requestBody.attachments,
    templateId: requestBody.templateId,
  };

  return sendMail(mail, options);
};

export const sendMail = async (
  requestBody: IRequestBody,
  options: IOptions,
): Promise<IResult> => {
  let mail = snakeCaseObject(requestBody);
  let json = JSON.stringify(mail);

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
