import { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';

const emptyForm = {
  code: '',
  type: 'flat',
  value: 0,
  minOrderAmount: 0,
  maxDiscount: '',
  expiresAt: '',
  active: true
};

export default function Coupons() {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }),
    [token]
  );

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/admin/coupons`, { headers });
      if (res.data?.success) setCoupons(res.data.coupons || []);
      else toast.error(res.data?.message || 'Failed to fetch coupons');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCoupons();
  }, [token]);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const startEdit = (c) => {
    setEditingId(c._id);
    setForm({
      code: c.code || '',
      type: c.type || 'flat',
      value: c.value || 0,
      minOrderAmount: c.minOrderAmount || 0,
      maxDiscount: c.maxDiscount ?? '',
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : '',
      active: Boolean(c.active)
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const save = async () => {
    try {
      const payload = {
        ...form,
        code: String(form.code || '').trim().toUpperCase(),
        value: Number(form.value),
        minOrderAmount: Number(form.minOrderAmount || 0),
        maxDiscount: form.maxDiscount === '' ? null : Number(form.maxDiscount),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null
      };

      if (!payload.code) return toast.error('Code is required');
      if (!payload.type) return toast.error('Type is required');

      if (editingId) {
        const res = await axios.put(`${backendUrl}/api/admin/coupons/${editingId}`, payload, { headers });
        if (res.data?.success) {
          toast.success('Coupon updated');
          resetForm();
          fetchCoupons();
        } else toast.error(res.data?.message || 'Failed to update coupon');
      } else {
        const res = await axios.post(`${backendUrl}/api/admin/coupons`, payload, { headers });
        if (res.data?.success) {
          toast.success('Coupon created');
          resetForm();
          fetchCoupons();
        } else toast.error(res.data?.message || 'Failed to create coupon');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save coupon');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await axios.delete(`${backendUrl}/api/admin/coupons/${id}`, { headers });
      if (res.data?.success) {
        toast.success('Coupon deleted');
        fetchCoupons();
      } else toast.error(res.data?.message || 'Failed to delete coupon');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete coupon');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={resetForm}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold mb-4">{editingId ? 'Edit Coupon' : 'Create Coupon'}</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Code</label>
              <input
                value={form.code}
                onChange={(e) => onChange('code', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 uppercase"
                placeholder="WELCOME10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => onChange('type', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="flat">Flat ₹ off</option>
                  <option value="percent">% off</option>
                  <option value="shipping">Shipping discount</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Value</label>
                <input
                  type="number"
                  value={form.value}
                  onChange={(e) => onChange('value', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Min order (₹)</label>
                <input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => onChange('minOrderAmount', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Max discount (₹)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => onChange('maxDiscount', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="(percent only)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Expiry</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => onChange('expiresAt', e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => onChange('active', e.target.checked)}
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={save}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold">All Coupons</h2>
              <button
                onClick={fetchCoupons}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-gray-500">Loading…</div>
            ) : coupons.length === 0 ? (
              <div className="p-6 text-gray-500">No coupons yet.</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {coupons.map((c) => (
                  <div key={c._id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{c.code}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${c.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {c.active ? 'Active' : 'Inactive'}
                        </span>
                        {c.expiresAt && (
                          <span className="text-xs text-gray-500">
                            Expires {new Date(c.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {c.type === 'flat' && `₹${c.value} off`}
                        {c.type === 'percent' && `${c.value}% off`}
                        {c.type === 'shipping' && `Shipping discount up to ₹${c.value}`}
                        {c.minOrderAmount ? ` • Min ₹${c.minOrderAmount}` : ''}
                        {c.maxDiscount != null ? ` • Max ₹${c.maxDiscount}` : ''}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(c._id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

