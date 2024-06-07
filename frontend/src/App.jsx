import { BrowserRouter, Route, Routes } from "react-router-dom"
import File from "./components/File"
import Files from "./components/Files"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Files />} />
        <Route path="/files/:id" element={<File />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App