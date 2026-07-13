import './App.css'
import Main from "./components/main/Main.tsx";
import {BookNavigationProvider} from "./contexts/BookContext.tsx";

function App() {

  return (
    <>
        <BookNavigationProvider>
            <Main/>
        </BookNavigationProvider>
    </>
  )
}

export default App
