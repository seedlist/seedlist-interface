import React from "react";
import {Box, Stack} from "@chakra-ui/layout";
import {Header} from "./Header";
import {Footer} from "./Footer";
import {Heading} from "@chakra-ui/react";
import {IBaseProps} from "../interfaces/props";
import {Navigate, Route, Routes} from "react-router-dom";
import {BrowserRouter as Router} from "react-router-dom";
import {NotFound} from "../pages/error/404";
import {Openrace} from "../pages/openrace";

const App:React.FC<IBaseProps> = (props:IBaseProps)=>{

        return(
            <Box minH="100vh" color="white">
                <Heading>
                    <title>seedlist.org</title>
                </Heading>
                <Stack>
					<Router>
						<Header />
						<Routes>
							<Route path="/" element={ <Navigate to="/bid" />}> </Route>
							<Route path="/bid" element={<Openrace />}> </Route>
							<Route path="/*" element={<NotFound />}> </Route>
						</Routes>
						<Footer/>
					</Router>
                </Stack>
            </Box>
        );
}

export {App};