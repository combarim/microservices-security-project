import { useAuth } from '../context/AuthContext';
import { HiOutlineUserCircle, HiOutlineShieldCheck, HiOutlineLogout } from 'react-icons/hi';
import Button from '../components/Button';

export default function Profile() {
  const { username, roles, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] px-6 py-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <HiOutlineUserCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <HiOutlineUserCircle className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Utilisateur</p>
              <p className="text-sm font-medium text-slate-700">{username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <HiOutlineShieldCheck className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Rôle</p>
              <p className="text-sm font-medium text-slate-700">
                {roles.includes('ADMIN') ? 'Administrateur' : 'Client'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              onClick={logout}
            >
              <HiOutlineLogout className="w-4 h-4" />
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
