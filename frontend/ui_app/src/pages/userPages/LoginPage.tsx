import React, { useState } from "react";
import { useQuery } from "../../utils/utils";
import TokenLoginForm from "./TokenLoginForm";
import { fetchGet, fetchPost } from "../../servers/base";
import AssetURLs from "../../servers/asset_server/assetURLs";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../components/errorBoundary";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

export default function LoginPage() {
    const navigate = useNavigate();
    const query = useQuery();
    const action = query.get("action");
    const error = query.get("error");
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(error || "");

    interface SignupFormData {
        email: string;
        userId: string;
        confirmUserId: string;
    }

    const onSignupSubmit = (
        email: SignupFormData["email"],
        userId: SignupFormData["userId"],
        confirmUserId: SignupFormData["confirmUserId"]
    ): void => {
        if (userId !== confirmUserId) {
            setLoginError("User ID and Confirm User ID do not match.");
            return;
        }
        setIsLoading(true);
        fetchPost(new AssetURLs().signup_route(), { 'email': email, 'username': userId })
            .then((data: unknown) => {
                // console.log("Signup response: ", data);
                setIsLoading(false);
                onLoginSubmit();
            })
            .catch((err: Error) => {
                setIsLoading(false);
                setLoginError(`Oh Snap! You've got an unexpected error during signup: ${err.message}`);
            });
    };

    const onLoginSubmit = () => {
        setIsLoading(true);
        const clientUrl = window.location.origin + "/projects";
        fetchGet(new AssetURLs().login_route(), { client_url: encodeURIComponent(clientUrl) })
            .then((data) => {
                window.location.assign(data.auth_url);
            })
            .catch((err) => {
                setIsLoading(false);
                setLoginError(`Oh Snap! You've got an unexpected error during login: ${err.message}`);
            });
    };

    return (
        <div>
            {loginActions(action)}
        </div>
    );

    function loginActions(action: string | null) {
        switch (action) {
            case "signup":
                return <SignupForm
                    onSignupSubmit={onSignupSubmit}
                    isLoading={isLoading}
                    signupError={loginError}
                    navigate={navigate}
                />;
            case "login-with-token":
                return <TokenLoginForm />;
            default:
                return <LoginForm
                    onSubmit={onLoginSubmit}
                    isLoading={isLoading}
                    loginError={loginError}
                    navigate={navigate}
                />;
        }
    }
}