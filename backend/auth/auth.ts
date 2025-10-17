import { createClerkClient, verifyToken } from "@clerk/backend";
import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { secret } from "encore.dev/config";

const clerkSecretKey = secret("ClerkSecretKey");
const clerkClient = createClerkClient({ secretKey: clerkSecretKey() });

interface AuthParams {
  authorization?: Header<"Authorization">;
  session?: Cookie<"session">;
}

export interface AuthData {
  userID: string;
  imageUrl: string;
  email: string | null;
  role: "parent" | "provider" | "admin" | "doctor";
}

export const auth = authHandler<AuthParams, AuthData>(async (data) => {
  const token =
    data.authorization?.replace("Bearer ", "") ?? data.session?.value;
  if (!token) {
    throw APIError.unauthenticated("missing token");
  }

  try {
    const verifiedToken = await verifyToken(token, {
      secretKey: clerkSecretKey(),
    });

    const user = await clerkClient.users.getUser(verifiedToken.sub);
    const publicRole = user.publicMetadata?.role as
      | "parent"
      | "provider"
      | "admin"
      | "doctor"
      | undefined;
    // Normalize doctor to provider-equivalent access for clinical endpoints
    const role: "parent" | "provider" | "admin" | "doctor" = publicRole ?? "parent";

    return {
      userID: user.id,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress ?? null,
      role,
    };
  } catch (err) {
    throw APIError.unauthenticated("invalid token", err as Error);
  }
});

export const gw = new Gateway({ authHandler: auth });
