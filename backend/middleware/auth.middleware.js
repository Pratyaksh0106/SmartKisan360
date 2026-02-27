import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const REGION = process.env.AWS_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

// JWKS client to fetch Cognito public keys for token verification
const client = jwksClient({
    jwksUri: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600000, // 10 minutes
});

// Get the signing key from JWKS
const getSigningKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
};

/**
 * Auth Middleware
 * Verifies the Cognito Access Token from the Authorization header.
 * Attaches `req.accessToken` (raw token) and `req.user` (decoded payload)
 * to the request object for downstream use.
 */
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access token is missing. Please provide a Bearer token.",
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        getSigningKey,
        {
            algorithms: ["RS256"],
            issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`,
        },
        (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err.message);

                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        success: false,
                        message: "Token has expired. Please refresh your token.",
                    });
                }

                return res.status(401).json({
                    success: false,
                    message: "Invalid or malformed token.",
                });
            }

            // Attach token and user info to request
            req.accessToken = token;
            req.user = {
                sub: decoded.sub,
                email: decoded.email,
                username: decoded.username,
                tokenUse: decoded.token_use,
            };

            next();
        }
    );
};
