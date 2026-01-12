import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productApi, orderApi } from '../services/api';
import type { Product } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineShoppingCart } from 'react-icons/hi';

export default function Products() {
  const { hasRole } = useAuth();
  const { showSuccess, showError } = useToast();
  const isAdmin = hasRole('ADMIN');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [orderQuantity, setOrderQuantity] = useState(1);

  const fetchProducts = async () => {
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch {
      showError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      await productApi.create({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      showSuccess('Produit ajouté avec succès');
      setShowAddModal(false);
      setFormData({ name: '', description: '', price: '', quantity: '' });
      fetchProducts();
    } catch {
      showError('Erreur lors de l\'ajout du produit');
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await productApi.delete(selectedProduct.id);
      showSuccess('Produit supprimé');
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch {
      showError('Erreur lors de la suppression');
    }
  };

  const handleOrder = async () => {
    if (!selectedProduct) return;
    try {
      await orderApi.create({
        items: [
          {
            productId: selectedProduct.id,
            quantity: orderQuantity,
            price: selectedProduct.price,
          },
        ],
      });
      showSuccess('Commande passée avec succès');
      setShowOrderModal(false);
      setSelectedProduct(null);
      setOrderQuantity(1);
    } catch {
      showError('Erreur lors de la commande');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <HiOutlinePlus className="w-4 h-4" />
            Ajouter un produit
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product) => (
          <Card key={product.id}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{product.description}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDeleteModal(true);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xl font-bold text-[#1e40af]">{product.price.toFixed(2)} €</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {product.quantity > 0 ? `${product.quantity} en stock` : 'Rupture de stock'}
                </p>
              </div>
              {!isAdmin && (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowOrderModal(true);
                  }}
                  disabled={product.quantity === 0}
                  className="flex items-center gap-1.5"
                >
                  <HiOutlineShoppingCart className="w-4 h-4" />
                  Commander
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-400">Aucun produit disponible</p>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleAddProduct}
        title="Ajouter un produit"
        confirmText="Ajouter"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Prix (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quantité</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteProduct}
        title="Confirmer la suppression"
        confirmText="Supprimer"
        confirmVariant="danger"
      >
        <p className="text-slate-600">
          Voulez-vous vraiment supprimer <span className="font-medium">"{selectedProduct?.name}"</span> ?
        </p>
      </Modal>

      {/* Order Modal */}
      <Modal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onConfirm={handleOrder}
        title="Passer une commande"
        confirmText="Commander"
      >
        <div>
          <div className="bg-slate-50 rounded-lg p-4 mb-4">
            <p className="font-medium text-slate-800">{selectedProduct?.name}</p>
            <p className="text-[#1e40af] font-bold mt-1">{selectedProduct?.price.toFixed(2)} € / unité</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quantité</label>
            <input
              type="number"
              min="1"
              max={selectedProduct?.quantity}
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total</span>
              <span className="text-xl font-bold text-[#1e40af]">
                {((selectedProduct?.price || 0) * orderQuantity).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
