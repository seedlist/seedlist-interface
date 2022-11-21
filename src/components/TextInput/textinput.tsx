import {IBaseProps} from "../../interfaces/props";
import { Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import React from "react";

interface TextProps extends IBaseProps{
	type?:string
	placeholder?:string
	disabled?:boolean
	value?:string
	onChange?: (event: React.FormEvent<HTMLInputElement>)=>void
}

const TextInput:React.FC<TextProps> = (props:TextProps)=>{
    return(
        <InputGroup>
            <Input
	            autoComplete="off"
	            autoCorrect="off"
	            height={12}
	            minLength={1}
	            maxLength={512}
	            spellCheck="false"
	            fontSize="xl"
	            focusBorderColor="white"
                type={props.type}
                placeholder={props.placeholder}
                disabled={props.disabled}
	            onChange={props.onChange}
            />

            <InputRightElement
	            width="48px"
	            pointerEvents="none"
	            color="gray.600"
	            fontSize="1.2em"
	            height="12"
            />
        </InputGroup>
    );
}

export {TextInput}
/*
export function TextInput({
  value,
  onChange,
  disabled,
  element,
    ...props
}) {
  return (
    <InputGroup>
      <Input
        onChange={(event) => onChange(event.target.value)}
        value={value}
        inputMode="text"
        autoComplete="off"
        autoCorrect="off"
        type="text"
        height="14"
        minLength={1}
        maxLength={512}
        spellCheck="false"
        fontSize="xl"
        focusBorderColor="white"
        readOnly={disabled}
        pr="10px"
        {...props}
      />
      <InputRightElement
        width="48px"
        pointerEvents="none"
        color="gray.600"
        fontSize="1.2em"
        height="14"
        children={element}
      />
    </InputGroup>
  );
}
*/
