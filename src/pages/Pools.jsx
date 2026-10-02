import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import './Pools.css';

const Pools = ({ isAdmin, setActive }) => {
  const [pools, setPools] = useState([]);

  useEffect(() => { fetchPools(); }, []);

  const fetchPools = async () => {
    const { data } = await supabase.from('pools').select('*').order('id', { ascending: false });
    if (data) setPools(data);
  };

  const handleDelete = async (id) => {
    if (!confirm("متأكد من حذف هذا المسبح؟")) return;
    const { error } = await supabase.from('pools').delete().eq('id', id);
    if (error) alert(error.message);
    else setPools(prev => prev.filter(p => p.id !== id));
  };

  return (
    <section className="pools-section">
      <div className="pools-header">
        <div><h2>🏊‍♂️  المسابح</h2><p>احجز بالساعة في المكلا والمناطق القريبة</p></div>
        <button className="btn-add" onClick={() => setActive('pools-add')}> أضف مسبحك</button>
      </div>

      <div className="pools-grid">
        {pools.map(pool => (
          <div key={pool.id} className="pool-card" style={{ position: 'relative' }}>
            {isAdmin && (
              <button 
                onClick={() => handleDelete(pool.id)} 
                style={{ position:'absolute', top:8, left:8, zIndex:2, background:'#fee2e2', color:'#ef4444', border:'none', width:28, height:28, borderRadius:8, cursor:'pointer', fontWeight:'bold' }}
              >
                🗑️
              </button>
            )}
            <div className="img-wrap">
              <img src={pool.image_url || 'https://images.unsplash.com/photo-1572331165267-854da2b10ccc'} alt={pool.name} />
              <span className="price-badge">{pool.price_per_hour} ر.ي / ساعة</span>
            </div>
            <div className="pool-body">
              <h3>{pool.name}</h3>
              <p className="loc">📍 {pool.location}</p>
              <div className="pool-footer">
                <a className="btn-wa" href={`https://wa.me/967${pool.phone.replace(/^0/,'')}`} target="_blank" rel="noreferrer">واتساب</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Pools;