import { useState, useEffect } from 'react'
import CraftsmenPage from './pages/CraftsmenPage.jsx'
import EquipmentPage from './pages/EquipmentPage.jsx'
import HousesPage from './pages/HousesPage.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import Pools from './pages/Pools.jsx'
import AddPool from './pages/AddPool.jsx'
import './App.css'

export default function App() {
  const [active, setActive] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [dark, setDark] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPassInput, setAdminPassInput] = useState('')

  const ADMIN_CODE = import.meta.env.VITE_ADMIN_PASSWORD

  useEffect(() => {
    if (ADMIN_CODE && window.location.href.includes(ADMIN_CODE)) {
      setIsAdmin(true)
      localStorage.setItem('jahiz-admin', 'true')
      window.history.replaceState({}, '', window.location.pathname)
      alert('✅ تم تفعيل وضع الإدارة')
    } else if (localStorage.getItem('jahiz-admin') === 'true') {
      setIsAdmin(true)
    }
    const saved = localStorage.getItem('jahiz-dark')
    if (saved === 'true') setDark(true)
  }, [])

  const handleLogoClick = () => {
    const newCount = logoClicks + 1
    setLogoClicks(newCount)
    if (newCount === 5) {
      setShowAdminLogin(true)
      setLogoClicks(0)
    }
    setTimeout(() => setLogoClicks(0), 3000)
  }

  const checkAdminLogin = () => {
    if (adminPassInput === ADMIN_CODE) {
      setIsAdmin(true)
      localStorage.setItem('jahiz-admin', 'true')
      setShowAdminLogin(false)
      setAdminPassInput('')
      alert('✅ تم تفعيل الإدارة')
    } else {
      alert('❌ الكود خطأ')
    }
  }

  const logoutAdmin = () => {
    if (confirm('تسجيل خروج من الإدارة؟')) {
      setIsAdmin(false)
      localStorage.removeItem('jahiz-admin')
    }
  }

  const toggleDark = () => {
    const newVal = !dark
    setDark(newVal)
    localStorage.setItem('jahiz-dark', newVal)
  }

  // هيدر داخلي منسق لكل الصفحات
  if (active) return (
    <div style={{ background: dark? '#121212' : '#fbfaf9', minHeight: '100vh' }} className={dark? 'dark-mode page dark' : 'page light'}>
      <div className="sticky-home-header-new">
        <div className="sticky-inner">
          <button onClick={() => setActive(null)} className="home-btn-new">
            🏠 الرئيسية
          </button>
          <div className="header-actions">
            {isAdmin && <span className="admin-badge">👑 مدير</span>}
            <button onClick={toggleDark} className="theme-btn-new">{dark? '☀️' : '🌙'}</button>
          </div>
        </div>
      </div>

      {active === 'craftsmen' && <CraftsmenPage isAdmin={isAdmin} dark={dark} />}
      {active === 'equipment' && <EquipmentPage isAdmin={isAdmin} dark={dark} />}
      {active === 'houses' && <HousesPage isAdmin={isAdmin} dark={dark} />}
      {active === 'products' && <ProductsPage isAdmin={isAdmin} dark={dark} />}
      {active === 'jobs' && <JobsPage isAdmin={isAdmin} dark={dark} />}
      {active === 'pools' && <Pools isAdmin={isAdmin} dark={dark} setActive={setActive} />}
      {active === 'pools-add' && <AddPool isAdmin={isAdmin} dark={dark} setActive={setActive} />}
    </div>
  )

  return (
    <>
      <div className={`page ${dark? 'dark' : 'light'}`}>
        <div className="navbar">
          <div className="logo" onClick={handleLogoClick} title="اضغط 5 مرات للتفعيل">
            <div className="logo-icon">جـ</div> جاهز
            {isAdmin && <span style={{ fontSize: 12, background: '#f59e0b', color: 'white', padding: '3px 8px', borderRadius: 999, marginRight: 6 }}>مدير</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="nav-btn" onClick={toggleDark}>{dark? '☀️' : '🌙'}</div>
            <div className="nav-btn">☰</div>
          </div>
        </div>

        <div className="hero">
          <div className="badge" onClick={isAdmin? logoutAdmin : undefined}>
            {isAdmin? '👑 وضع الإدارة مفعل - اضغط للخروج' : '🛡️ منصة للخدمات في حضرموت '}
          </div>
          <h1>أحصل على حاجتك <br /><span>مع منصة جاهز</span><br />دعنا نسهّل شغلك</h1>
          <p>معظم الخدمات  في مكان واحد - حرفيين، معدات، سكن ، متجر ، مسابح ، وظائف.</p>
        </div>

        <div className="services">
          <div className="service-card s1" onClick={() => setActive('craftsmen')}><div className="service-icon">🔧</div><h3>العمال والحرفيين</h3><p>سباك • كهربائي • نجار...</p></div>
          <div className="service-card s2" onClick={() => setActive('equipment')}><div className="service-icon">🚜</div><h3>إيجار المعدات</h3><p>شيول • قلاب • دريل....</p></div>
          <div className="service-card s3" onClick={() => setActive('houses')}><div className="service-icon">🏠</div><h3>إيجار السكن</h3><p>شقق • بيوت • محلات...</p></div>
          <div className="service-card s4" onClick={() => setActive('products')}><div className="service-icon">🛒</div><h3>سوق حضرموت</h3><p>جوالات • سيارات • أثاث....</p></div>
          <div className="service-card s5" onClick={() => setActive('jobs')}><div className="service-icon">💼</div><h3>وظائف حضرموت</h3><p>وظائف • تقديم مباشر...</p></div>
          <div className="service-card s6" style={{background:'#e0f2fe'}} onClick={() => setActive('pools')}><div className="service-icon">🏊</div><h3>حجز المسابح</h3><p>مسابح • بالساعة • عائلية...</p></div>
        </div>
      </div>

      {showAdminLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 16, width: '90%', maxWidth: 350, fontFamily: 'Tajawal' }}>
            <h3 style={{ margin: 0, marginBottom: 12 }}>🔐 دخول الإدارة</h3>
            <input type="password" value={adminPassInput} onChange={(e) => setAdminPassInput(e.target.value)} placeholder="أدخل كود الإدارة" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', marginBottom: 12, boxSizing: 'border-box' }} autoFocus />
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={checkAdminLogin} style={{ flex: 1, background: '#111', color: 'white', padding: 10, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}>دخول</button>
              <button onClick={() => setShowAdminLogin(false)} style={{ flex: 1, background: '#eee', color: '#111', padding: 10, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}