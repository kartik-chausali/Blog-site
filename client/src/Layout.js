import { Outlet } from "react-router-dom";
import Header from "./header";
/*
outlet tag defines the place where child routes should be rendered which means whereever layout will be used parent route header will always be rendered at top 
and then whatever child route we want to add will be rendered after header 
*/
export default function Layout(){
   return (
     <main>
        <Header />
        <Outlet />
    </main>
    );
}