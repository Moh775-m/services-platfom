import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

export default function AdminOrders({ service_type, dark }) {
  const [orders, setOrders] = useState([])
  const [show, setShow] = useState(false)

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').eq('service_type', service_type).order('created_at', { ascending: false })
    setOrders(data || [])
  }
  useEffect(()=>{ fetchOrders() }, [])

  return (
    <>
      <button onClick={()=>{fetchOrders(); setShow(true)}} style={{ background: dark? '#2a2a2a' : '#f3f1ef', color: dark? 'white' : '#111', padding: '8px 14px', borderRadius: 999, border: 'none', fontWeight: 'bold', position: 'relative', cursor: 'pointer' }}>
        📩 {orders.length > 0 && <span style={{ background: 'red', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 99, position: 'absolute', top: -6, right: -6 }}>{orders.length}</span>}
      </button>
      {show && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: dark? '#1e1e1e' : 'white', padding: 16, borderRadius: 16, width: '100%', maxWidth: 450, maxHeight: '80vh', overflowY: 'auto', fontFamily: 'Tajawal' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 900, color: dark? 'white' : '#111', margin: 0 }}>📩 طلبات {service_type} ({orders.length})</h3>
              <button onClick={()=>setShow(false)} style={{ border: 'none', background: '#f1f1f1', width: 32, height: 32, borderRadius: 99 }}>✕</button>
            </div>
            {orders.map(o => (
              <div key={o.id} style={{ border: dark? '1px solid #333' : '1px solid #eee', padding: 10, borderRadius: 10, marginBottom: 8, background: dark? '#222' : '#fafafa' }}>
                <b style={{ color: dark? 'white' : '#111', fontSize: 13 }}>{o.provider_name}</b>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>العميل: {o.customer_name} - {o.customer_phone}</div>
                <div style={{ fontSize: 12, color: dark? '#ccc' : '#444', marginTop: 4 }}>{o.description}</div>
              </div>
            ))}
            <button onClick={()=>setShow(false)} style={{ width: '100%', marginTop: 12, padding: 10, background: '#f1f1f1', borderRadius: 10, border: 'none' }}>إغلاق</button>
          </div>
        </div>
      )}
    </>
  )
}