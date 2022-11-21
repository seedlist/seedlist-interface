import React from 'react';
import ReactDOM from 'react-dom';
import {App} from './components/App';
import {ThemeProvider} from "./theme/chakra";
import {LanguageProvider} from "./i18n";
import {ReduxProvider} from "./reducers/provider";
import {RecoilRoot} from "recoil";

ReactDOM.render(
    <React.StrictMode>
	    <RecoilRoot>
		   <ReduxProvider >
			   <LanguageProvider>
				   <ThemeProvider>
					   <App />
				   </ThemeProvider>
			   </LanguageProvider>
		   </ReduxProvider>
	    </RecoilRoot>
    </React.StrictMode>,

  document.getElementById('root')
);
