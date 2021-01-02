import React from 'react'

export const AppContext = React.createContext({
    file: null,
    dragging: false,
    uploading: false,
    isUploaded: false,
    uploadedFileName: null,
    error: null,
    setContextState: ()=> {}
});

export const AppContextPorivder = function(props){
    const setContextState = (updatedState) => {
        appContextsetState({
            ...appContextState, 
            ...updatedState
        });
    }

    const initState = {
        file: null,
        dragging: false,
        uploading: false,
        error: null,
        setContextState
    } 

    const [appContextState, appContextsetState] = React.useState(initState)

    return (
        <AppContext.Provider value={appContextState}>
            {props.children}
        </AppContext.Provider>
    )
}