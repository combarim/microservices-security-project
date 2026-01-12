import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { orderApi } from '../services/api';
import type { Order } from '../types';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { HiOutlineCalendar, HiOutlineShoppingBag } from 'react-icons/hi';

export default function Orders() {
  const { showError } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderApi.getAll();
        setOrders(data);
      } catch {
        showError('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CREATED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'Payée';
      case 'CREATED':
        return 'En attente';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                <HiOutlineShoppingBag className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Commande #{order.id}</p>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                  <HiOutlineCalendar className="w-4 h-4" />
                  {formatDate(order.orderDate)}
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {order.items.length} article{order.items.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusStyle(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
              <p className="text-xl font-bold text-[#1e40af] mt-3">
                {order.totalAmount.toFixed(2)} €
              </p>
            </div>
          </div>
        </Card>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-400">Aucune commande</p>
        </div>
      )}
    </div>
  );
}
