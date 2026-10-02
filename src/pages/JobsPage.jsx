import { useState, useEffect } from "react"
import { supabase } from '../supabase.js'
import OrderButton from '../components/OrderButton.jsx'
import AdminOrders from '../components/AdminOrders.jsx'
import './JobsPage.css'

export default function JobsPage({ isAdmin, dark }) {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('الكل')
  const [showAdd, setShowAdd] = useState(false)
  const [showApply, setShowApply] = useState(null)

  useEffect(() => { fetchJobs() }, [])
  const fetchJobs = async () => {
    const { data } = await supabase.from('jobs').select('*').order('created_at', {ascending: false})
    setJobs(data || [])
  }
  const filters = ['الكل','المكلا','الشحر','سيئون','دوام كامل','عن بعد']
  const filtered = jobs.filter(j => {
    const s = (j.title + j.company_name).toLowerCase().includes(search.toLowerCase())
    const f = filter === 'الكل' || j.location === filter || j.job_type === filter
    return s && f
  })

  return (
    <div className="jobs-page" style={{ background: dark? '#121212' : 'transparent', padding: 16 }}>
      <div className="jobs-header">
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && <AdminOrders service_type="jobs" dark={dark} />}
          <button onClick={() => setShowAdd(true)} className="btn-add-job">اضف وظيفتك</button>
        </div>
        <div className="jobs-header-right">
          <div>
            <h2 style={{ color: dark? 'white' : '#111' }}>الوظائف {isAdmin && '👑'}</h2>
            <span>{filtered.length} وظيفة</span>
          </div>
          <div className="icon-box">💼</div>
        </div>
      </div>
      <input className="search-input" placeholder="ابحث..." value={search} onChange={e=>setSearch(e.target.value)} />
      <div className="filter-chips">
        {filters.map(f => (
          <button key={f} className={`chip ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="jobs-grid">
        {filtered.map(job => (
          <div key={job.id} className="job-card" style={{ background: dark? '#1e1e1e' : 'white', border: dark? '1px solid #333' : '1px solid #eee' }}>
            <h3 style={{ color: dark? 'white' : '#111' }}>{job.title}</h3>
            <div className="job-meta">{job.company_name} - {job.location} - {job.job_type}</div>
            <div className="job-desc">{job.description}</div>
            {job.salary && <div className="job-salary">{job.salary}</div>}
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
               <button onClick={() => setShowApply(job)} className="btn-apply" style={{ flex: 1 }}>التقديم على الوضيفة</button>
            </div>
          </div>
        ))}
      </div>
      {showAdd && <AddJobModal onClose={() => {setShowAdd(false); fetchJobs()}} />}
      {showApply && <ApplyModal job={showApply} onClose={() => setShowApply(null)} />}
    </div>
  )
}

function AddJobModal({ onClose }) {
  const [form, setForm] = useState({ title:'', company_name:'', location:'المكلا', job_type:'دوام كامل', salary:'', description:'', whatsapp_number:'' })
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('jobs').insert([form])
    if(!error){ alert('تمت الإضافة ✅'); onClose() } else alert(error.message)
  }
  return (
    <div className="modal-overlay">
      <form onSubmit={handleSubmit} className="modal-box">
        <h3 style={{margin:0}}>إضافة وظيفة</h3>
        <input required placeholder="المسمى الوظيفي" onChange={e=>setForm({...form, title:e.target.value})} />
        <input required placeholder="اسم الشركة" onChange={e=>setForm({...form, company_name:e.target.value})} />
        <input required placeholder="رقم واتساب 9677XXXXXXX" onChange={e=>setForm({...form, whatsapp_number:e.target.value})} />
        <textarea required placeholder="وصف الوظيفة" onChange={e=>setForm({...form, description:e.target.value})} />
        <input placeholder="الراتب" onChange={e=>setForm({...form, salary:e.target.value})} />
        <div style={{display:'flex', gap:8}}><button type="submit" className="btn-add-job" style={{flex:1}}>نشر</button><button type="button" onClick={onClose} style={{flex:1, padding:10, borderRadius:10, border:'none'}}>إلغاء</button></div>
      </form>
    </div>
  )
}

function ApplyModal({ job, onClose }) {
  const [applicant, setApplicant] = useState({ name:'', phone:'', experience:'' })
  const handleApply = async (e) => {
    e.preventDefault()
    // 1- حفظ الطلب في جدول orders
    await supabase.from('orders').insert([{
      service_type: 'jobs',
      service_id: String(job.id),
      provider_name: job.company_name,
      provider_phone: job.whatsapp_number,
      customer_name: applicant.name,
      customer_phone: applicant.phone,
      description: `تقديم على وظيفة ${job.title} - خبرتي: ${applicant.experience}`,
      status: 'جديد'
    }])
    // 2- فتح واتساب
    const message = `مرحبا، أريد التقديم على وظيفة: *${job.title}* في *${job.company_name}*%0A%0A*اسمي:* ${applicant.name}%0A*رقمي:* ${applicant.phone}%0A*خبرتي:* ${applicant.experience}%0A%0Aمن منصة جاهز`
    window.open(`https://wa.me/${job.whatsapp_number}?text=${message}`, '_blank')
    onClose()
  }
  return (
    <div className="modal-overlay">
      <form onSubmit={handleApply} className="modal-box">
        <h3 style={{margin:0}}>التقديم على: {job.title}</h3>
        <p style={{fontSize:12, color:'#888', margin:0}}>سيتم الإرسال لواتساب: {job.whatsapp_number}</p>
        <input required placeholder="اسمك الكامل" onChange={e=>setApplicant({...applicant, name:e.target.value})} />
        <input required placeholder="رقم جوالك" onChange={e=>setApplicant({...applicant, phone:e.target.value})} />
        <textarea required placeholder="خبرتك" onChange={e=>setApplicant({...applicant, experience:e.target.value})} />
        <div style={{display:'flex', gap:8}}><button type="submit" className="btn-apply" style={{flex:1, marginTop:0}}>إرسال واتساب 📩</button><button type="button" onClick={onClose} style={{flex:1, padding:10, borderRadius:10, border:'none'}}>إلغاء</button></div>
      </form>
    </div>
  )
}