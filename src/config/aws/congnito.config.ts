import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const cognito = new CognitoIdentityProviderClient({
  region: "us-east-2",
});
