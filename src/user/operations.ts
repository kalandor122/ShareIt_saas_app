import { type Prisma } from "@prisma/client";
import { type User } from "wasp/entities";
import { HttpError, prisma } from "wasp/server";
import {
  type GetPaginatedUsers,
  type UpdateIsUserAdminById,
  type ConnectInternet,
  type DeductUserCredits,
} from "wasp/server/operations";
import * as z from "zod";
import { SubscriptionStatus } from "../payment/plans";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import * as crypto from "crypto";

function parseFas(encodedFas: string): Record<string, string> {
  try {
    const decodedStr = Buffer.from(encodedFas, "base64").toString("utf-8");
    const params: Record<string, string> = {};
    decodedStr.split(", ").forEach((item) => {
      if (item.includes("=")) {
        const [key, ...valueParts] = item.split("=");
        const value = valueParts.join("=");
        params[key.trim()] = decodeURIComponent(value.trim());
      }
    });
    return params;
  } catch (error) {
    console.error("FAS Parsing failed:", error);
    return {};
  }
}



export const deductUserCredits: DeductUserCredits<number, void> = async (amountToSubtract, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }


  if (context.user.credits < amountToSubtract) {
    throw new HttpError(400, 'Insufficient credits');
  }
  
  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
    credits: { decrement: amountToSubtract }
    }
  });
};



const updateUserAdminByIdInputSchema = z.object({
  id: z.string().nonempty(),
  isAdmin: z.boolean(),
});

type UpdateUserAdminByIdInput = z.infer<typeof updateUserAdminByIdInputSchema>;

export const updateIsUserAdminById: UpdateIsUserAdminById<
  UpdateUserAdminByIdInput,
  User
> = async (rawArgs, context) => {
  const { id, isAdmin } = ensureArgsSchemaOrThrowHttpError(
    updateUserAdminByIdInputSchema,
    rawArgs,
  );

  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  return context.entities.User.update({
    where: { id },
    data: { isAdmin },
  });
};

type GetPaginatedUsersOutput = {
  users: Pick<
    User,
    | "id"
    | "email"
    | "username"
    | "subscriptionStatus"
    | "paymentProcessorUserId"
    | "isAdmin"
  >[];
  totalPages: number;
};



const getPaginatorArgsSchema = z.object({
  skipPages: z.number(),
  filter: z.object({
    emailContains: z.string().nonempty().optional(),
    isAdmin: z.boolean().optional(),
    subscriptionStatusIn: z
      .array(z.nativeEnum(SubscriptionStatus).nullable())
      .optional(),
  }),
});

type GetPaginatedUsersInput = z.infer<typeof getPaginatorArgsSchema>;

export const getPaginatedUsers: GetPaginatedUsers<
  GetPaginatedUsersInput,
  GetPaginatedUsersOutput
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  const {
    skipPages,
    filter: {
      subscriptionStatusIn: subscriptionStatus,
      emailContains,
      isAdmin,
    },
  } = ensureArgsSchemaOrThrowHttpError(getPaginatorArgsSchema, rawArgs);

  const includeUnsubscribedUsers = !!subscriptionStatus?.some(
    (status) => status === null,
  );
  const desiredSubscriptionStatuses = subscriptionStatus?.filter(
    (status) => status !== null,
  );

  const pageSize = 10;

  const userPageQuery: Prisma.UserFindManyArgs = {
    skip: skipPages * pageSize,
    take: pageSize,
    where: {
      AND: [
        {
          email: {
            contains: emailContains,
            mode: "insensitive",
          },
          isAdmin,
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: desiredSubscriptionStatuses,
              },
            },
            {
              subscriptionStatus: includeUnsubscribedUsers ? null : undefined,
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      isAdmin: true,
      subscriptionStatus: true,
      paymentProcessorUserId: true,
    },
    orderBy: {
      username: "asc",
    },
  };

  const [pageOfUsers, totalUsers] = await prisma.$transaction([
    context.entities.User.findMany(userPageQuery),
    context.entities.User.count({ where: userPageQuery.where }),
  ]);
  const totalPages = Math.ceil(totalUsers / pageSize);

  return {
    users: pageOfUsers,
    totalPages,
  };
};

type ConnectInternetInput = {
  amount: number;
  fas?: string;
  token?: string;
  gatewayAddress?: string;
  authDir?: string;
  redirectUrl?: string;
};

type ConnectInternetOutput = {
  url: string;
};

export const connectInternet: ConnectInternet<ConnectInternetInput, ConnectInternetOutput> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'You must be logged in');
  }

  let { amount, fas, token, gatewayAddress, authDir, redirectUrl } = args;
  let rhid: string | undefined;

  if (fas) {
    const fasKey = process.env.FAS_KEY;
    if (!fasKey) {
      throw new HttpError(500, 'FAS_KEY is not configured on the server');
    }
    const params = parseFas(fas);
    const hid = params.hid;
    gatewayAddress = params.gatewayaddress || gatewayAddress;
    authDir = params.authdir || authDir;
    redirectUrl = params.originurl || redirectUrl;

    if (hid) {
      rhid = crypto.createHash("sha256").update(hid + fasKey).digest("hex");
    }
  }

  const finalToken = rhid || token;

  if (!finalToken || !gatewayAddress) {
    throw new HttpError(400, 'Missing required OpenNDS parameters (fas/hid or token, gatewayaddress)');
  }

  authDir = authDir || 'opennds_auth';
  redirectUrl = redirectUrl || 'http://google.com';

  const creditsToDeduct = amount / 1000;
  if ((context.user.credits || 0) < creditsToDeduct) {
    throw new HttpError(402, 'Insufficient credits');
  }

  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      credits: { decrement: creditsToDeduct }
    }
  });

  const totalKB = amount * 1024;
  const downloadQuota = Math.floor(totalKB * 0.7);
  const uploadQuota = Math.floor(totalKB * 0.3);

  const baseUrl = `http://${gatewayAddress}/${authDir}/`;
  const returnParams = new URLSearchParams();
  returnParams.append('tok', finalToken);
  returnParams.append('redir', redirectUrl);
  returnParams.append('uploadquota', uploadQuota.toString());
  returnParams.append('downloadquota', downloadQuota.toString());

  return {
    url: `${baseUrl}?${returnParams.toString()}`
  };
};
