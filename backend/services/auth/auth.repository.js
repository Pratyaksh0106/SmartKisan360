import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    InitiateAuthCommand,
    ResendConfirmationCodeCommand,
    ForgotPasswordCommand,
    ConfirmForgotPasswordCommand,
    GetUserCommand,
    GlobalSignOutCommand,
    ChangePasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});

const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

// ─── Compute SECRET_HASH ─────────────────────────────────────────────────────
// Required when the Cognito App Client has a client secret configured.
// IMPORTANT: The username passed here MUST be the same one used during SignUp.
const computeSecretHash = (username) => {
    if (!CLIENT_SECRET) return undefined;

    return crypto
        .createHmac("SHA256", CLIENT_SECRET)
        .update(username + CLIENT_ID)
        .digest("base64");
};

// ─── Sign Up ────────────────────────────────────────────────────────────────
// User Pool has email as alias, so Username must NOT be an email.
// We generate a UUID as the username; users sign in with their email alias.
export const signUpUser = async ({ email, password, name, phone }) => {
    const username = crypto.randomUUID();

    const userAttributes = [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
    ];

    if (phone) {
        userAttributes.push({ Name: "phone_number", Value: phone });
    }

    const params = {
        ClientId: CLIENT_ID,
        Username: username,
        Password: password,
        UserAttributes: userAttributes,
    };

    const secretHash = computeSecretHash(username);
    if (secretHash) params.SecretHash = secretHash;

    const command = new SignUpCommand(params);
    const result = await cognitoClient.send(command);

    // Return the generated username so it can be used for confirm/resend
    return { ...result, generatedUsername: username };
};

// ─── Confirm Sign Up (OTP verification) ─────────────────────────────────────
// username must be the same UUID that was used during SignUp
export const confirmSignUp = async ({ username, confirmationCode }) => {
    const params = {
        ClientId: CLIENT_ID,
        Username: username,
        ConfirmationCode: confirmationCode,
    };

    const secretHash = computeSecretHash(username);
    if (secretHash) params.SecretHash = secretHash;

    const command = new ConfirmSignUpCommand(params);
    return await cognitoClient.send(command);
};

// ─── Resend Confirmation Code ────────────────────────────────────────────────
// username must be the same UUID that was used during SignUp
export const resendConfirmationCode = async ({ username }) => {
    const params = {
        ClientId: CLIENT_ID,
        Username: username,
    };

    const secretHash = computeSecretHash(username);
    if (secretHash) params.SecretHash = secretHash;

    const command = new ResendConfirmationCodeCommand(params);
    return await cognitoClient.send(command);
};

// ─── Sign In ────────────────────────────────────────────────────────────────
// For sign in, email works as an alias (Cognito resolves it internally)
export const signInUser = async ({ email, password }) => {
    const authParameters = {
        USERNAME: email,
        PASSWORD: password,
    };

    const secretHash = computeSecretHash(email);
    if (secretHash) authParameters.SECRET_HASH = secretHash;

    const command = new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: authParameters,
    });

    return await cognitoClient.send(command);
};

// ─── Get User Profile ────────────────────────────────────────────────────────
export const getUserProfile = async (accessToken) => {
    const command = new GetUserCommand({
        AccessToken: accessToken,
    });

    return await cognitoClient.send(command);
};

// ─── Global Sign Out (invalidate all tokens) ────────────────────────────────
export const globalSignOut = async (accessToken) => {
    const command = new GlobalSignOutCommand({
        AccessToken: accessToken,
    });

    return await cognitoClient.send(command);
};

// ─── Forgot Password (send reset code) ──────────────────────────────────────
export const forgotPassword = async ({ email }) => {
    const params = {
        ClientId: CLIENT_ID,
        Username: email,
    };

    const secretHash = computeSecretHash(email);
    if (secretHash) params.SecretHash = secretHash;

    const command = new ForgotPasswordCommand(params);
    return await cognitoClient.send(command);
};

// ─── Confirm Forgot Password (reset with code) ──────────────────────────────
export const confirmForgotPassword = async ({
    email,
    confirmationCode,
    newPassword,
}) => {
    const params = {
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode,
        Password: newPassword,
    };

    const secretHash = computeSecretHash(email);
    if (secretHash) params.SecretHash = secretHash;

    const command = new ConfirmForgotPasswordCommand(params);
    return await cognitoClient.send(command);
};

// ─── Change Password (while signed in) ──────────────────────────────────────
export const changePassword = async ({
    accessToken,
    previousPassword,
    newPassword,
}) => {
    const command = new ChangePasswordCommand({
        AccessToken: accessToken,
        PreviousPassword: previousPassword,
        ProposedPassword: newPassword,
    });

    return await cognitoClient.send(command);
};

// ─── Refresh Tokens ──────────────────────────────────────────────────────────
export const refreshTokens = async (refreshToken, username) => {
    const authParameters = {
        REFRESH_TOKEN: refreshToken,
    };

    if (username) {
        const secretHash = computeSecretHash(username);
        if (secretHash) authParameters.SECRET_HASH = secretHash;
    }

    const command = new InitiateAuthCommand({
        AuthFlow: "REFRESH_TOKEN_AUTH",
        ClientId: CLIENT_ID,
        AuthParameters: authParameters,
    });

    return await cognitoClient.send(command);
};
