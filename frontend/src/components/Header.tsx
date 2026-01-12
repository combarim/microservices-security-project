import { Link, useLocation } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineClipboardList, HiOutlineUserCircle } from 'react-icons/hi';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Produits', icon: HiOutlineShoppingBag },
    { path: '/orders', label: 'Commandes', icon: HiOutlineClipboardList },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1e40af] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/profile"
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all duration-200"
        >
          <HiOutlineUserCircle className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
