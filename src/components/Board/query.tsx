import React from "react";
import {Box, Center, HStack, Stack} from "@chakra-ui/layout";
import {Labels} from "../Labels/labels";
import {InputAreas} from "../TextInput/inputareas";
import {Buttons} from "../Buttons/buttons";
import {PasswordInQuery } from "../Dialog/PasswordInQuery";
import {IBaseProps} from "../../interfaces/props";

const QueryBoard:React.FC<IBaseProps> = (props:IBaseProps)=>{
    return(
        <Center>
            <Stack marginY="10px">
                <Box bgColor="#2b2d32" p="5" w="100%" maxW="lg" borderRadius="8" >
                    <Stack spacing={6}>

                        <Labels />

                        <InputAreas />

                        <HStack spacing="24px" width="100%">
                            <Buttons />
                        </HStack>

                        <PasswordInQuery />
                    </Stack>
                </Box>
            </Stack>
        </Center>
    );
}

export {QueryBoard};