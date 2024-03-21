import type { RequestHandler } from "@builder.io/qwik-city";
import type { ServiceAccount } from "firebase-admin";
import { initialiseAdmin } from "~/libs/firebase-admin";

export const onRequest: RequestHandler = async ({ env }) => {
  const serviceAccount = {
    type: "service_account",
    project_id: env.get("PRIVATE_FIREBASE_PROJECT_ID") ?? process.env.projectId,
    private_key_id:
      env.get("PRIVATE_FIREBASE_PRIVATE_KEY_ID") ?? process.env.privateKeyId,
    private_key:
      env.get("PRIVATE_FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n") ??
      process.env.privateKey?.replace(/\\n/g, "\n"),
    client_email:
      env.get("PRIVATE_FIREBASE_CLIENT_EMAIL") ?? process.env.clientEmail,
    client_id: env.get("PRIVATE_FIREBASE_CLIENT_ID") ?? process.env.clientId,
    auth_uri: env.get("PRIVATE_FIREBASE_AUTH_URI") ?? process.env.authUri,
    token_uri: env.get("PRIVATE_FIREBASE_TOKEN_URI") ?? process.env.tokenUri,
    auth_provider_x509_cert_url:
      env.get("PRIVATE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL") ??
      process.env.authProviderX509CertUrl,
    client_x509_cert_url:
      env.get("PRIVATE_FIREBASE_CLIENT_X509_CERT_URL") ??
      process.env.clientX509CertUrl,
    universe_domain: "googleapis.com",
  } as ServiceAccount;
  console.log("serviceAccount", serviceAccount);

  initialiseAdmin(serviceAccount);
};
