import { Button, Layout, Typography, Space, Row, Col } from "antd";
import backgroundImage from "../../../public/assets/loginBackground.jpg";
import { useAuth0 } from "@auth0/auth0-react";
import {useEffect} from "react";

export const Login: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        loginWithRedirect();
    }, [loginWithRedirect]);

    return null; // nothing to render, instantly redirects
};