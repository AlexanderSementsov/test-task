import React from "react";
import { AuthProvider } from "./src/components/AuthProvider";

export const wrapRootElement = ({ element }) => {
    return <AuthProvider>{element}</AuthProvider>;
};
