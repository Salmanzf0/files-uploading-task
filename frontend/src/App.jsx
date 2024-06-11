import { BrowserRouter, Route, Routes } from "react-router-dom"
import File from "./pages/File"
import Files from "./pages/Files"
import MultiFileViewer from "./pages/MultiFileViewer"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Files />} />
        <Route path="/files/:id" element={<File />} />
        <Route path="/viewer" element={<MultiFileViewer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App