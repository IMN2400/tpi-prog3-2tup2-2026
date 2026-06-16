import { useEffect } from "react";

export const useFetchFromAPI = (apiRoute) => {
    async function callApi(routeString){
            const obj = await fetch(`https://localhost:3000/${routeString}`)
            .then( (res) => !res.ok ? res.json() : console.error("Error: No se pudo recuperar la información.") )
            .catch( (err)=> err)
            return obj
        }
        
    return useEffect(
        callApi(apiRoute)
    )
}