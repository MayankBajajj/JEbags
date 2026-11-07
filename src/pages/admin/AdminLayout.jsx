import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import Icon from "../../components/Icon";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "layers", end: true },
  { to: "/admin/products", label: "Products", icon: "backpack" },
  { to: "/admin/orders", label: "Orders", icon: "package" },
  { to: "/admin/enquiries", label: "Enquiries", icon: "mail" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-cream-100 flex">
      <aside className="w-64 shrink-0 bg-ink-950 text-cream-50 flex flex-col">
        <div className="px-6 py-6 border-b border-cream-50/10">
          <Logo variant="dark" size="sm" showSubtitle={false} />
          <p className="mt-1 text-[11px] tracking-[0.2em] uppercase text-gold-400">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-gold-500 text-ink-950" : "text-cream-100/75 hover:bg-cream-50/10"
                }`
              }
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-cream-50/10">
          <p className="text-xs text-cream-100/60 mb-3 truncate">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-cream-100/85 hover:text-gold-400 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
