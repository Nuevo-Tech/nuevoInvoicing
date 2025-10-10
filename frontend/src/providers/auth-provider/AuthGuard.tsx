import {useAuth0} from "@auth0/auth0-react";
import {Navigate, useLocation} from "react-router-dom";
import {BASE_URL_API_V1} from "@/utils/urls";
import {useState} from "react";


export const AuthGuard = ({children}: { children: JSX.Element }) => {
        const {user, isAuthenticated, isLoading} = useAuth0();
        const location = useLocation();
        if (isLoading) return null;

    const [onboardingComplete, setOnboardingComplete] = useState(false);

        if (isAuthenticated) {
            const fetchOrgProfile = async () => {
                const response = await fetch(BASE_URL_API_V1 + "/myorgprofile/1", {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                if (response.ok) {
                    const data = await response.json();
                    setOnboardingComplete(data.onboarding_complete);
                }
            }
            fetchOrgProfile();
            if (!onboardingComplete) {
                if (!location.pathname.startsWith("/myorgprofile")) {
                    return <Navigate to="/myorgprofile" replace/>;
                }
            }
        }

        return children;
    }
;