import { useAuth0 } from "@auth0/auth0-react";
import { Navigate, useLocation } from "react-router-dom";


export const AuthGuard = ({ children }: { children: JSX.Element }) => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const location = useLocation();

    if (isLoading) return null;

    if (isAuthenticated) {
        const metadata = user?.["https://jawad-crm/user_metadata"];
        if (metadata && !metadata.onboarding_complete) {
            // force onboarding page
            if (!location.pathname.startsWith("/myorgprofile")) {
                return <Navigate to="/myorgprofile" replace />;
            }
        }
    }

    return children;
};