import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import OrderButton from '../components/OrderButton.jsx'
import AdminOrders from '../components/AdminOrders.jsx'
import './HousesPage.css'

const TYPES = ['الكل', 'شقة', 'بيت شعبي', 'غرفة', 'استوديو', 'فيلا', 'محل']
const CITIES = ['الكل', 'المكلا', 'فوة', 'الشرج', 'الديس', 'الشحر', 'سيئون']

export default function HousesPage({ isAdmin, dark }) {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('الكل');
    const [cityFilter, setCityFilter] = useState('الكل');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', type: 'شقة', city: 'المكلا', price: '', whatsapp: '', description: '' })

    const fetchData = async () => {
      const { data } = await supabase.from('houses').select('*').order('created_at', { ascending: false });
      setItems(data || [])
    }
    useEffect(() => { fetchData() }, [])

    const handleAdd = async (e) => {
      e.preventDefault();
      const { error } = await supabase.from('houses').insert([form]);
      if (error) alert(error.message);
      else { setShowForm(false); fetchData(); setForm({ title: '', type: 'شقة', city: 'المكلا', price: '', whatsapp: '', description: '' }) }
    }

    const handleDelete = async (id) => {
      if (!confirm("متأكد من حذف هذا العقار؟")) return;
      const { error } = await supabase.from('houses').delete().eq('id', id);
      if (error) alert(error.message);
      else setItems(prev => prev.filter(c => c.id!== id));
    }

    const filtered = items.filter(c => c.title?.toLowerCase().includes(search.toLowerCase()) && (typeFilter === 'الكل' || c.type === typeFilter) && (cityFilter === 'الكل' || c.city === cityFilter))

    return (
    <div className="page" style={{ background: dark? '#121212' : 'transparent', padding: 16 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="header">
          <div className="header-left">
            <div className="header-icon" style={{ background: '#059669' }}>🏠</div>
            <div>
              <div style={{ fontWeight: 900, color: dark? 'white' : '#111' }}>السكن {isAdmin && '👑'}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{items.length} عرض</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {isAdmin && <AdminOrders service_type="houses" dark={dark} />}
            <button onClick={() => setShowForm(!showForm)} style={{ background: '#059669', color: 'white', padding: '8px 16px', borderRadius: 999, border: 'none', fontWeight: 'bold' }}>اضف عقارك</button>
          </div>
        </div>

        <div className="filter-bar">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث..." />
          <div className="filter-btns">{CITIES.map(c => <button key={c} onClick={() => setCityFilter(c)} className={cityFilter === c? 'active' : ''} style={cityFilter === c? { background: '#059669', color: 'white', borderColor: '#059669' } : {}}>{c}</button>)}</div>
        </div>

        {showForm && <form onSubmit={handleAdd} className="form-box"><input placeholder="العنوان - شقة 3 غرف في فوة" value={form.title} onChange={e => setForm({...form, title: e.target.value })} required /><select value={form.type} onChange={e => setForm({...form, type: e.target.value })}>{TYPES.slice(1).map(t => <option key={t}>{t}</option>)}</select><select value={form.city} onChange={e => setForm({...form, city: e.target.value })}>{CITIES.slice(1).map(c => <option key={c}>{c}</option>)}</select><input placeholder="السعر" value={form.price} onChange={e => setForm({...form, price: e.target.value })} /><input placeholder="واتساب" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value })} required /><textarea placeholder="تفاصيل" value={form.description} onChange={e => setForm({...form, description: e.target.value })}></textarea><button className="submit" style={{ background: '#059669' }}>نشر</button></form>}

        <div className="grid">
          {filtered.map(c =>
            <div key={c.id} className="card" style={{ background: dark? '#1e1e1e' : 'white', border: dark? '1px solid #333' : '1px solid #eee', position:'relative' }}>
              {isAdmin && <button onClick={() => handleDelete(c.id)} style={{ position:'absolute', top:8, left:8, background:'#fee2e2', color:'#ef4444', border:'none', width:28, height:28, borderRadius:8, cursor:'pointer', fontWeight:'bold' }}>🗑️</button>}
              <span className="badge" style={{ background: '#ecfdf5', color: '#065f46' }}>{c.type} • {c.city}</span>
              <div style={{ fontWeight: 'bold', marginTop: 10, color: dark? 'white' : '#111' }}>{c.title}</div>
              <div className="price" style={{ color: '#059669' }}>{c.price || 'على الخاص'}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{c.description}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <OrderButton item={c} service_type="houses" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    )
}