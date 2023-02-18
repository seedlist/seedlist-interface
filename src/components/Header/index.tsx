import {  HStack, Container } from "@chakra-ui/layout";
import {Openrace} from "./openrace";
import React from "react";
import {PageRouter} from "./routers";
import WalletInfo from "../Wallet/wallet";
import {IBaseProps} from "../../interfaces/props";
import {Menus} from "./menu";

const Header:React.FC<IBaseProps> = (props:IBaseProps)=>{
    return(
        <Container maxW="container.xl">
            <HStack py={5} wrap="wrap" spacing={0}>
                <Openrace />
                <PageRouter />
                <WalletInfo />
                <Menus />
            </HStack>
        </Container>
    );
}
export {Header};