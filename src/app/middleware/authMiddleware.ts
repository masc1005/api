import { Context, Next } from "koa";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://cognito-idp.us-east-2.amazonaws.com/${process.env.COGNITO_POOL_ID}/.well-known/jwks.json`,
});

export const authMiddleware = async (ctx: Context, next: Next) => {
  try {
    const token = ctx.headers.authorization?.split(" ")[1];
    if (!token) {
      ctx.status = 401;
      ctx.body = { message: "Authentication token is missing" };
      return;
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    ctx.state.user = decoded;
    await next();
  } catch (error) {
    ctx.status = 401;
    ctx.body = { message: "Invalid token" };
  }
};

function getKey(
  header: jwt.JwtHeader,
  callback: (err: Error | null, key?: string) => void
) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}
