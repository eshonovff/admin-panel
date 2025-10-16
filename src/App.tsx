import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout/layout"
import Dashboard from "./pages/dashboard/dashboard"
import Users from "./pages/users/users"
import Products from "./pages/products/products"

const App = () => {
  const router = createBrowserRouter([
   {
    path: "/",
    element: <Layout />,
    children:[
      {
        index: true,
        element: <Dashboard/>
      },
      {
        path: "/users",
        element: <Users/>
      },
      {
        path: "/products",
        element: <Products/>
      }
    ]
   }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
