import {Link, Outlet, useLocation} from "react-router-dom";

const Layout = () => {
    const {pathname} = useLocation();

    const navItems = [
        {name: "Dashboard", path: "/"},
        {name: "Users", path: "/users"},
        {name: "Products", path: "/products"},
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
                <h1 className="text-xl font-semibold text-blue-600">Admin Panel</h1>

            </header>
            <div className="flex flex-1">
                <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
                    <ul className="space-y-2 px-4 py-6">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`block px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                                        pathname === item.path
                                            ? "bg-blue-100 text-blue-600"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>
                <main className="flex-1 p-6">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default Layout;
