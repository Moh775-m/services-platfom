import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import './SarfHadhramout.css'

const SarfHadhramout = () => {
    const [rates, setRates] = useState(null)
    const [amount, setAmount] = useState(100)
    const [from, setFrom] = useState('SAR')
    const [to, setTo] = useState('YER')
    const [loading, setLoading] = useState(true)

    // Admin editing
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('jahiz-admin') === 'true')
    const [editMode, setEditMode] = useState(false)
    const [newSar, setNewSar] = useState('')
    const [newUsd, setNewUsd] = useState('')

    const fetchRates = async () => {
        const { data, error } = await supabase
            .from('exchange_rates')
            .select('*')
            .order('id', { ascending: false })
            .limit(1)
            .single()

        if (data) {
            setRates({
                SAR_YER: parseFloat(data.sar_yer),
                USD_YER: parseFloat(data.usd_yer),
                YER_SAR: 1 / parseFloat(data.sar_yer),
                YER_USD: 1 / parseFloat(data.usd_yer),
                lastUpdate: new Date(data.updated_at).toLocaleString('ar-YE', { timeZone: 'Asia/Aden' })
            })
            setNewSar(data.sar_yer)
            setNewUsd(data.usd_yer)
        } else {
            // احتياطي لو فشل Supabase
            setRates({ SAR_YER: 420, USD_YER: 1590, YER_SAR: 1 / 420, YER_USD: 1 / 1590, lastUpdate: 'احتياطي' })
        }
        setLoading(false)
    }

    useEffect(() => { fetchRates() }, [])

    const convert = () => {
        if (!rates) return 0
        if (from === to) return amount
        if (from === 'SAR' && to === 'YER') return (amount * rates.SAR_YER).toFixed(0)
        if (from === 'YER' && to === 'SAR') return (amount * rates.YER_SAR).toFixed(2)
        if (from === 'USD' && to === 'YER') return (amount * rates.USD_YER).toFixed(0)
        if (from === 'YER' && to === 'USD') return (amount * rates.YER_USD).toFixed(2)
        if (from === 'SAR' && to === 'USD') return (amount * rates.SAR_YER / rates.USD_YER).toFixed(2)
        if (from === 'USD' && to === 'SAR') return (amount * rates.USD_YER / rates.SAR_YER).toFixed(2)
        return amount
    }

    const saveRates = async () => {
        const { error } = await supabase
            .from('exchange_rates')
            .insert([{ sar_yer: parseFloat(newSar), usd_yer: parseFloat(newUsd) }])

        if (!error) {
            alert('✅ تم تحديث السعر للكل!')
            setEditMode(false)
            fetchRates()
        } else {
            alert('خطأ: ' + error.message)
        }
    }

    if (loading) return <div className="sarf-loading">جاري جلب أسعار حضرموت...</div>

    return (
        <div className="sarf-page">
            <div className="sarf-header">
                <h1>صرف حضرموت</h1>
                <p className="sarf-subtitle">سعر السوق في المكلا - {rates.lastUpdate}</p>
            </div>

            <div className="sarf-grid">
                <div className="sarf-card sarf-card-green">
                    <div className="sarf-icon-box">🇸🇦</div>
                    <h3>الريال السعودي</h3>
                    <span className="sarf-price">{rates.SAR_YER} <small>YER</small></span>
                    <p className="sarf-buy">100 = {(rates.SAR_YER * 100).toLocaleString()} يمني</p>
                </div>
                <div className="sarf-card sarf-card-yellow">
                    <div className="sarf-icon-box">🇺🇸</div>
                    <h3>الدولار</h3>
                    <span className="sarf-price">{rates.USD_YER} <small>YER</small></span>
                    <p className="sarf-buy">100 = {(rates.USD_YER * 100).toLocaleString()} يمني</p>
                </div>
            </div>

            {/* حاسبة */}
            <div className="sarf-card sarf-card-purple calculator">
                <div className="sarf-icon-box">💱</div>
                <h3>حول من وإلى</h3>
                <div className="calc-row-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={amount}
                        onChange={e => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            setAmount(val)
                        }}
                        placeholder="مثال: 100"
                    />
                    <select value={from} onChange={e => setFrom(e.target.value)}>
                        <option value="SAR">SAR سعودي</option>
                        <option value="YER">YER يمني</option>
                        <option value="USD">USD دولار</option>
                    </select>
                    <span>إلى</span>
                    <select value={to} onChange={e => setTo(e.target.value)}>
                        <option value="YER">YER يمني</option>
                        <option value="SAR">SAR سعودي</option>
                        <option value="USD">USD دولار</option>
                    </select>
                </div>
                <div className="calc-result">{amount} {from} = {Number(convert()).toLocaleString()} {to}</div>
            </div>

            {/* لوحة تحكم الـ Admin فقط */}
            {isAdmin && (
                <div className="sarf-card sarf-card-blue admin-panel">
                    <div className="sarf-icon-box">👑</div>
                    <h3>لوحة تحكم الصرف - للمدير فقط</h3>
                    {!editMode ? (
                        <button className="admin-btn" onClick={() => setEditMode(true)}>✏️ تعديل الأسعار</button>
                    ) : (
                        <div>
                            <div className="admin-inputs">
                                <label>سعر 1 سعودي (يمني): <input type="number" value={newSar} onChange={e => setNewSar(e.target.value)} /></label>
                                <label>سعر 1 دولار (يمني): <input type="number" value={newUsd} onChange={e => setNewUsd(e.target.value)} /></label>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                <button className="admin-btn save" onClick={saveRates}>💾 حفظ وتحديث للكل</button>
                                <button className="admin-btn cancel" onClick={() => setEditMode(false)}>إلغاء</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
export default SarfHadhramout