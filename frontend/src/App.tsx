import {  useState } from "react";

import MachinePage from "./machines/MachinePage.tsx";
import Appbar from "./Appbar.tsx";



// npm run dev
function App() {

    const [category, setCategory] = useState("machines");

    function getPageByCategory(category: string){
        switch (category) {
            case "machines":
                return <MachinePage/>
        }
    }

    return (

        <>
            <Appbar category={category} setCategory={setCategory}/>
            {getPageByCategory(category)}
        </>

    )
}

export default App;
