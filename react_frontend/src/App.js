import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Index from "./Components/Index";
import Coach from "./Components/Coach";
import Student from "./Components/Student";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Index/>}
        />
        <Route
          path="student/:id"
          element={<Student/>}
        />
        <Route
        path="coach/:id"
        element={<Coach/>}
      />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
