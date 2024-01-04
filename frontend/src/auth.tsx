import { useDispatch } from "react-redux";
import { Preloader } from "./components/Preloader";
import { catchFetchError } from "./helpers";
import { useCurrentQuery } from "./redux/services/auth";
import { logout } from "./redux/slices/auth";

export const Auth = ({children}: {children: JSX.Element}) => {
  const {data, isLoading, isError, error} = useCurrentQuery();
  
  const dispatch = useDispatch();

  if(isLoading){
    return <Preloader />
  }
    
  if(isError && catchFetchError(error) === 'Token has expired!'){
    dispatch(logout);
    localStorage.removeItem('token')
  }

  return children
}