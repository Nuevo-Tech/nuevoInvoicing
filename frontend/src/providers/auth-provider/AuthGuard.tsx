import {useAuth0} from "@auth0/auth0-react";
import {Navigate, useLocation} from "react-router-dom";
import {BASE_URL_API_V1} from "@/utils/urls";


export const AuthGuard = ({children}: { children: JSX.Element }) => {
        const {user, isAuthenticated, isLoading} = useAuth0();
        const location = useLocation();
        const userData = localStorage.getItem("user");
        let userId = "";
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            userId = parsedUserData.userId;
        }

        if (isLoading) return null;

        if (isAuthenticated) {
            const fetchUser = async () => {
                const response = await fetch(BASE_URL_API_V1 + "/users?" + userId, {
                    method: "GET",
                    headers: {"Content-Type": "application/json"},
                });
                if (response.ok) {
                    const data = await response.json();
                    if (!data.onboarding_complete) {
                        if (!location.pathname.startsWith("/myorgprofile")) {
                            return <Navigate to="/myorgprofile" replace/>;
                        }
                    }
                }
            }
        }

        return children;
    }
;