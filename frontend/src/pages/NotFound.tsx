import { Link } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <p className="text-8xl font-bold text-slate-200 mb-2">404</p>
      <p className="text-slate-500 mb-8">Page non trouvée</p>
      <Link to="/">
        <Button className="flex items-center gap-2">
          <HiOutlineHome className="w-4 h-4" />
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
}
