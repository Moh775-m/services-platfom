import React, { useState } from 'react';
import { supabase } from '../supabase';
import './AddPool.css';

const AddPool = ({ setActive }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', price_per_hour: '', phone: '' });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        await supabase.storage.from('pools-images').upload(fileName, image);
        const { data } = supabase.storage.from('pools-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
      await supabase.from('pools').insert([{
        name: form.name,
        location: form.location,
        price_per_hour: form.price_per_hour,
        phone: form.phone,
        image_url: imageUrl
      }]);
      setActive('pools');
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  return (
    <div className="addpool-wrapper">
      <button className="btn-back" onClick={() => setActive('pools')}>← رجوع</button>
      <h2>🏊‍♂️ أضف مسبحك</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>اسم المسبح</label>
          <input required placeholder="مثال: مسبح النخبة" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div className="form-group">
          <label>الموقع</label>
          <input required placeholder="مثال: المكلا - فوه" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
        </div>
        <div className="form-group">
          <label>سعر الساعة</label>
          <input required type="text" inputMode="numeric" placeholder="مثال: 5000 ر.ي" value={form.price_per_hour} onChange={e => setForm({...form, price_per_hour: e.target.value})} />
        </div>
        <div className="form-group">
          <label>رقم الواتساب</label>
          <input required type="text" placeholder="777..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
        </div>
        <div className="form-group">
          <label>صورة المسبح</label>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
        </div>
        <button className="btn-submit" disabled={loading}>{loading? "جاري النشر..." : "نشر المسبح"}</button>
      </form>
    </div>
  );
};
export default AddPool;