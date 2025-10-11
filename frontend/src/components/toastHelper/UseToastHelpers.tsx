import {useNotificationProvider} from "@refinedev/antd";

// Generic notification helpers
export const UseToastHelpers = () => {
    const {open} = useNotificationProvider();

    const showSuccess = (message: any, description: any) => {
        open?.({
            type: "success",
            message,
            description,
        });
    };

    const showError = (message: any, description: any) => {
        open?.({
            type: "error",
            message,
            description,
        });
    };

    return {showSuccess, showError};
};
