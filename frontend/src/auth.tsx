import { Preloader } from "./components/Preloader";
import { catchFetchError } from "./helpers";
import { ErrorPage } from "./pages/dashboard/ErrorPage";
import { useCurrentQuery } from "./redux/services/auth";

export const Auth = ({children}: {children: JSX.Element}) => {
  // const {isLoading, isError, error} = useCurrentQuery();

  // if(isLoading){
  //   return <Preloader />
  // }

  // if(isError){
  //   return children
  // }

  return children
}