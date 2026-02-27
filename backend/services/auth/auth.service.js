import * as authRepo from "./auth.repository.js";

// ─── Sign Up ────────────────────────────────────────────────────────────────
export const signUp = async ({ email, password, name, phone }) => {
    const result = await authRepo.signUpUser({ email, password, name, phone });

    return {
        userSub: result.UserSub,
        username: result.generatedUsername, // Frontend needs this for confirm/resend
        isConfirmed: result.UserConfirmed,
        message:
            "Sign up successful. Please check your email for the verification code.",
    };
};

// ─── Confirm Sign Up ────────────────────────────────────────────────────────
// Uses username (UUID) not email, because SECRET_HASH must match what was used during signup
export const confirmSignUp = async ({ username, confirmationCode }) => {
    await authRepo.confirmSignUp({ username, confirmationCode });

    return {
        message: "Email verified successfully. You can now sign in.",
    };
};

// ─── Resend Confirmation Code ────────────────────────────────────────────────
// Uses username (UUID) not email
export const resendCode = async ({ username }) => {
    const result = await authRepo.resendConfirmationCode({ username });

    return {
        destination: result.CodeDeliveryDetails?.Destination,
        message: "Verification code resent successfully.",
    };
};

// ─── Sign In ────────────────────────────────────────────────────────────────
// Sign in uses email (works as alias after verification)
export const signIn = async ({ email, password }) => {
    const result = await authRepo.signInUser({ email, password });
    const authResult = result.AuthenticationResult;

    return {
        accessToken: authResult.AccessToken,
        idToken: authResult.IdToken,
        refreshToken: authResult.RefreshToken,
        expiresIn: authResult.ExpiresIn,
        tokenType: authResult.TokenType,
    };
};

// ─── Get Profile ────────────────────────────────────────────────────────────
export const getProfile = async (accessToken) => {
    const result = await authRepo.getUserProfile(accessToken);

    // Convert Cognito attributes array to a clean object
    const attributes = {};
    result.UserAttributes.forEach((attr) => {
        attributes[attr.Name] = attr.Value;
    });

    return {
        username: result.Username,
        email: attributes.email,
        name: attributes.name,
        phone: attributes.phone_number || null,
        emailVerified: attributes.email_verified === "true",
        sub: attributes.sub,
    };
};

// ─── Sign Out ───────────────────────────────────────────────────────────────
export const signOut = async (accessToken) => {
    await authRepo.globalSignOut(accessToken);

    return {
        message: "Signed out successfully from all devices.",
    };
};

// ─── Forgot Password ────────────────────────────────────────────────────────
export const forgotPassword = async ({ email }) => {
    const result = await authRepo.forgotPassword({ email });

    return {
        destination: result.CodeDeliveryDetails?.Destination,
        message: "Password reset code sent to your email.",
    };
};

// ─── Confirm Forgot Password ────────────────────────────────────────────────
export const resetPassword = async ({ email, confirmationCode, newPassword }) => {
    await authRepo.confirmForgotPassword({ email, confirmationCode, newPassword });

    return {
        message: "Password reset successfully. You can now sign in with your new password.",
    };
};

// ─── Change Password ────────────────────────────────────────────────────────
export const changePassword = async ({
    accessToken,
    previousPassword,
    newPassword,
}) => {
    await authRepo.changePassword({ accessToken, previousPassword, newPassword });

    return {
        message: "Password changed successfully.",
    };
};

// ─── Refresh Tokens ──────────────────────────────────────────────────────────
export const refreshTokens = async (refreshToken) => {
    const result = await authRepo.refreshTokens(refreshToken);
    const authResult = result.AuthenticationResult;

    return {
        accessToken: authResult.AccessToken,
        idToken: authResult.IdToken,
        expiresIn: authResult.ExpiresIn,
        tokenType: authResult.TokenType,
    };
};
