import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {IBaseProps} from "../interfaces/props";
import "../style/App.scss";
import React from "react";

const theme = extendTheme({
    fonts: {
        heading: "Inter",
        body: "Inter",
    },
});

const ThemeProvider:React.FC<IBaseProps> = (props:IBaseProps)=>{
    return (
            <ChakraProvider theme={theme}>
                {props.children}
            </ChakraProvider>

    );
}

export {ThemeProvider}