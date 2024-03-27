import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import ResignterPage from "./pages/ResignterPage";
import AdmainPage from "./pages/admin";
import LoginPage from "./pages/login";
import MainPage from "./pages/main";
import ProfilePage from "./pages/profile";
import ProfileViewPage from "./pages/profileview";
import VotePage from "./pages/vote";
function App() {
  const routers = createBrowserRouter([
    { path: "/", element: <MainPage /> },
    { path: "/reg", element: <ResignterPage /> },
    { path: "/admin", element: <AdmainPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/vote", element: <VotePage /> },
    { path: "/profileview/:user_idIN", element: <ProfileViewPage /> },
  ]);
  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
