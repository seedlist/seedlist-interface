import {useToast} from "@chakra-ui/react";

export function useWarningToast():(msg:string)=>void{
	const toast = useToast()
	return (message:string)=>
	toast({
		description: message,
		isClosable: true,
		status:"warning",
		duration:5000,
		position:"top"
	})
}

export function useSuccessToast():(msg:string)=>void{
	const toast = useToast()
	return (message:string)=>
	toast({
		description: message,
		isClosable: true,
		status:"success",
		duration:5000,
		position:"top"
	})
}

export function useInfoToast():(msg:string)=>void{
	const toast = useToast()
	return (message:string)=>
	toast({
		description: message,
		isClosable: true,
		status:"info",
		duration:9000,
		position:"top"
	})
}
