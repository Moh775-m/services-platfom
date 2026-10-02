import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function OrderButton({ item, service_type }) {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ customer_name: '', customer_phone: '', description: '' })

  const handleOrder = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('orders').insert([{
      service_type,
      service_id: String(item.id),
      provider_name: item.name || item.title || item.company,
      provider_phone: item.whatsapp || item.phone,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      description: form.description,
      status: 'جديد'
    }])
    if(error) return alert(error.message)
    alert('✅ تم إرسال الطلب')
    setShow(false)
    setForm({ customer_name: '', customer_phone: '', description: '' })
    const msg = `طلب جديد من جاهز 🚨\nالنوع: ${service_type}\nالمزود: ${item.name || item.title}\nالعميل: ${form.customer_name}\nرقمه: ${form.customer_phone}\nالتفاصيل: ${form.description}`
    window.open(`https://wa.me/967${(item.whatsapp || item.phone || '').replace(/^0/,'')}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <>
      <button onClick={()=>setShow(true)} style={{flex: 1, background: '#0a7d4a', color: 'white', border: 'none', padding: '8px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal'}}>اطلب 📩</button>
      {show && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16}}>
          <form onSubmit={handleOrder} style={{background: 'white', padding: 20, borderRadius: 16, width: '100%', maxWidth: 400, display: 'grid', gap: 10, fontFamily: 'Tajawal'}}>
            <h3 style={{margin: 0, color: '#111'}}>طلب {item.name || item.title}</h3>
            <input placeholder="اسمك" value={form.customer_name} onChange={e=>setForm({...form, customer_name: e.target.value})} style={{padding: 12, borderRadius: 10, border: '1px solid #ddd'}} required />
            <input placeholder="رقم جوالك" value={form.customer_phone} onChange={e=>setForm({...form, customer_phone: e.target.value})} style={{padding: 12, borderRadius: 10, border: '1px solid #ddd'}} required />
            <textarea placeholder="التفاصيل" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} style={{padding: 12, borderRadius: 10, border: '1px solid #ddd'}} rows={3} />
            <button type="submit" style={{background: '#111', color: 'white', padding: 12, borderRadius: 10, fontWeight: 800, border: 'none'}}>إرسال ✅</button>
            <button type="button" onClick={()=>setShow(false)} style={{color: '#888', background: 'none', border: 'none'}}>إلغاء</button>
          </form>
        </div>
      )}
    </>
  )
}