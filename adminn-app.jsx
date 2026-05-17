import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Badge } from './components/UI';
import { trickleListObjects, trickleDeleteObject } from './lib/api-client';
import './index.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-ios text-center max-w-sm w-full">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="icon-triangle-alert text-2xl"></div>
                        </div>
                        <h1 className="text-lg font-bold text-gray-900 mb-2">حدث خطأ</h1>
                        <Button onClick={() => window.location.reload()} className="w-full">
                            تحديث الصفحة
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

function AdminLogin({ onLogin }) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin === '1417') {
            sessionStorage.setItem('admin_pin', '1417');
            onLogin();
        } else {
            setError('رمز PIN غير صحيح! حاول مرة أخرى.');
            setPin('');
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-ios text-center max-w-sm w-full space-y-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <div className="icon-shield text-white text-3xl animate-pulse"></div>
                </div>
                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-white">بديلي | إدارة المنصة</h1>
                    <p className="text-xs text-white/60">هذه المنطقة محمية ومخصصة للإدارة فقط</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-white/80 text-right mr-1">رمز الدخول (PIN)</label>
                        <input 
                            type="password"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="4"
                            placeholder="••••"
                            value={pin}
                            onChange={(e) => {
                                setError('');
                                setPin(e.target.value.replace(/\D/g, ''));
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-center text-xl text-white font-bold tracking-widest focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder-white/30 transition-all"
                            autoFocus
                        />
                    </div>
                    
                    {error && (
                        <p className="text-xs text-red-300 font-semibold bg-red-500/10 py-2.5 rounded-xl border border-red-500/20 text-center">
                            {error}
                        </p>
                    )}
                    
                    <Button type="submit" className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-md transition-all font-semibold flex items-center justify-center gap-2 border-0">
                        <div className="icon-lock text-sm"></div>
                        إلغاء القفل والدخول
                    </Button>
                </form>
                <a href="/" className="inline-block text-xs text-white/40 hover:text-white/60 transition-colors">
                    &larr; العودة للمنصة
                </a>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        sessionStorage.getItem('admin_pin') === '1417'
    );
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        topSpecialty: '-',
        topRegion: '-'
    });

    useEffect(() => {
        if (isAuthenticated) {
            fetchRequests();
        }
    }, [isAuthenticated]);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await trickleListObjects('TransferRequest', 1000, true);
            const items = response.items || [];
            setRequests(items);
            calculateStats(items);
        } catch (error) {
            console.error("Failed to fetch requests", error);
            alert("فشل في جلب البيانات.");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateStats = (data) => {
        if (data.length === 0) return;

        const specialties = {};
        const regions = {};

        data.forEach(req => {
            const spec = req.objectData.specialty;
            const reg = req.objectData.current_region;
            
            specialties[spec] = (specialties[spec] || 0) + 1;
            regions[reg] = (regions[reg] || 0) + 1;
        });

        const topSpecialty = Object.keys(specialties).reduce((a, b) => specialties[a] > specialties[b] ? a : b, '-');
        const topRegion = Object.keys(regions).reduce((a, b) => regions[a] > regions[b] ? a : b, '-');

        setStats({
            total: data.length,
            topSpecialty,
            topRegion
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟')) return;
        
        try {
            await trickleDeleteObject('TransferRequest', id);
            const newRequests = requests.filter(r => r.objectId !== id);
            setRequests(newRequests);
            calculateStats(newRequests);
        } catch (error) {
            console.error("Failed to delete request", error);
            alert("فشل الحذف");
        }
    };

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen pb-12">
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center text-white shadow-sm">
                        <div className="icon-shield-check text-xl"></div>
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-gray-900">لوحة الإدارة</h1>
                        <p className="text-xs text-gray-500">نظام إدارة طلبات منصة بديلي</p>
                    </div>
                </div>
                <a href="/" className="text-sm font-medium text-primary hover:underline">العودة للمنصة &larr;</a>
            </header>

            <main className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <div className="icon-users text-2xl"></div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">إجمالي الطلبات</p>
                            <p className="text-2xl font-bold text-gray-900">{isLoading ? '-' : stats.total}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <div className="icon-award text-2xl"></div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">التخصص الأكثر طلباً</p>
                            <p className="text-lg font-bold text-gray-900 line-clamp-1">{isLoading ? '-' : stats.topSpecialty}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                            <div className="icon-map text-2xl"></div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">المنطقة الأكثر نشاطاً</p>
                            <p className="text-lg font-bold text-gray-900">{isLoading ? '-' : stats.topRegion}</p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-gray-900">سجل الطلبات</h2>
                        <Button variant="outline" size="sm" onClick={fetchRequests}>
                            <div className="icon-refresh-cw ml-1.5 text-[11px]"></div>
                            تحديث
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium text-xs">
                                <tr>
                                    <th className="px-6 py-4">التخصص</th>
                                    <th className="px-6 py-4">المنطقة الحالية</th>
                                    <th className="px-6 py-4">مناطق النقل</th>
                                    <th className="px-6 py-4">التاريخ</th>
                                    <th className="px-6 py-4">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">جاري التحميل...</td></tr>
                                ) : requests.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-10 text-gray-500">لا توجد طلبات.</td></tr>
                                ) : (
                                    requests.map(req => {
                                        const desiredArray = Array.isArray(req.objectData.desired_regions) 
                                            ? req.objectData.desired_regions 
                                            : (typeof req.objectData.desired_regions === 'string' ? req.objectData.desired_regions.split(',') : []);

                                        return (
                                            <tr key={req.objectId} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {req.objectData.specialty}
                                                    {req.objectData.hospital_name && (
                                                        <div className="text-xs text-gray-500 font-normal mt-1 flex items-center gap-1">
                                                            <div className="icon-building w-3"></div>
                                                            {req.objectData.hospital_name}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{req.objectData.current_region}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {desiredArray.map((r, i) => (
                                                            <Badge key={i} variant="primary">{r.trim()}</Badge>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs" dir="ltr">
                                                    {new Date(req.createdAt).toLocaleDateString('en-GB')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" className="px-2 py-1 h-auto text-blue-600 hover:bg-blue-50 border-blue-100" onClick={() => window.open(`https://wa.me/${req.objectData.phone}`, '_blank')}>
                                                            <div className="icon-message-circle text-[13px]"></div>
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="px-2 py-1 h-auto text-red-600 hover:bg-red-50 border-red-100" onClick={() => handleDelete(req.objectId)}>
                                                            <div className="icon-trash-2 text-[13px]"></div>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <AdminDashboard />
    </ErrorBoundary>
);
