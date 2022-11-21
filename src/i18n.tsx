import React from "react";
import {IBaseProps} from "./interfaces/props";
import {Provider} from "./lib/i18n";
import {languageState} from "./hooks/Atoms";
import {useRecoilState} from "recoil";

const LanguageProvider:React.FC<IBaseProps> = (props:IBaseProps)=>{
	const [lang, ] = useRecoilState(languageState)
	return(
		<Provider
			locale={lang}
			forceRenderAfterLocaleChange={false}
			children={props.children}
		/>
	);
}


export {LanguageProvider}