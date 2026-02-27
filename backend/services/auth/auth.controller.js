import * as authService from "./auth.service.js";

// Helper to extract Cognito error details
const handleCognitoError = (error) => {
    const cognitoErrors = {
        UsernameExistsException: { status: 409, message: "An account with this email already exists." },
        UserNotFoundException: { status: 404, message: "No account found with this email." },
        NotAuthorizedException: { status: 401, message: "Invalid email or password." },
        CodeMismatchException: { status: 400, message: "Invalid verification code." },
        ExpiredCodeException: { status: 400, message: "Verification code has expired. Please request a new one." },
        InvalidPasswordException: { status: 400, message: "Password does not meet the requirements." },
        LimitExceededException: { status: 429, message: "Too many attempts. Please try again later." },
        TooManyRequestsException: { status: 429, message: "Too many requests. Please slow down." },
        UserNotConfirmedException: { status: 403, message: "Email not verified. Please verify your email first." },
        InvalidParameterException: { status: 400, message: error.message },
    };

    const mapped = cognitoErrors[error.name];
    if (mapped) {
        return { status: mapped.status, message: mapped.message };
    }

    console.error("Unhandled Cognito error:", error);
    return { status: 500, message: "An unexpected error occurred." };
};

// ─── POST /auth/signup ──────────────────────────────────────────────────────
export const signUp = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and name are required.",
            });
        }

        const result = await authService.signUp({ email, password, name, phone });
        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/confirm-signup ──────────────────────────────────────────────
export const confirmSignUp = async (req, res) => {
    try {
        const { username, confirmationCode } = req.body;

        if (!username || !confirmationCode) {
            return res.status(400).json({
                success: false,
                message: "Username and confirmation code are required.",
            });
        }

        const result = await authService.confirmSignUp({ username, confirmationCode: String(confirmationCode) });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/resend-code ─────────────────────────────────────────────────
export const resendCode = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required.",
            });
        }

        const result = await authService.resendCode({ username });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/signin ─────────────────────────────────────────────────────
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const result = await authService.signIn({ email, password });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── GET /auth/profile ──────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
    try {
        const result = await authService.getProfile(req.accessToken);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/signout ─────────────────────────────────────────────────────
export const signOut = async (req, res) => {
    try {
        const result = await authService.signOut(req.accessToken);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/forgot-password ─────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        const result = await authService.forgotPassword({ email });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/reset-password ──────────────────────────────────────────────
export const resetPassword = async (req, res) => {
    try {
        const { email, confirmationCode, newPassword } = req.body;

        if (!email || !confirmationCode || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, confirmation code, and new password are required.",
            });
        }

        const result = await authService.resetPassword({
            email,
            confirmationCode: String(confirmationCode),
            newPassword,
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/change-password ─────────────────────────────────────────────
export const changePassword = async (req, res) => {
    try {
        const { previousPassword, newPassword } = req.body;

        if (!previousPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Previous password and new password are required.",
            });
        }

        const result = await authService.changePassword({
            accessToken: req.accessToken,
            previousPassword,
            newPassword,
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};

// ─── POST /auth/refresh-token ───────────────────────────────────────────────
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required.",
            });
        }

        const result = await authService.refreshTokens(refreshToken);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        const { status, message } = handleCognitoError(error);
        return res.status(status).json({ success: false, message });
    }
};
