import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from './components/UI';
import { AppHeader } from './components/AppHeader';
import { FilterBar } from './components/FilterBar';
import { RequestCard } from './components/RequestCard';
import { AddRequestDialog } from './components/AddRequestDialog';
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
                        <h1 className="text-lg font-bold text-gray-900 mb-2">عذراً، حدث خطأ غير متوقع</h1>
                        <p className="text-sm text-gray-500 mb-6">يرجى تحديث الصفحة والمحاولة مرة أخرى.</p>
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

function App() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasMyRequest, setHasMyRequest] = useState(false);
    const [myRequestId, setMyRequestId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Filters state
    const [filters, setFilters] = useState({
        specialty: '',
        currentRegion: '',
        desiredRegion: ''
    });

    // Check localStorage on mount
    useEffect(() => {
        const storedId = localStorage.getItem('badeeli_request_id');
        if (storedId) {
            setHasMyRequest(true);
            setMyRequestId(storedId);
        }
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await trickleListObjects('TransferRequest', 100, true);
            setRequests(response.items || []);
        } catch (error) {
            console.error("Failed to fetch requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMyRequest = async () => {
        if (!confirm('هل أنت متأكب من رغبتك في حذف طلبك؟')) return;
        
        try {
            if (myRequestId) {
                await trickleDeleteObject('TransferRequest', myRequestId);
            }
            localStorage.removeItem('badeeli_request_id');
            setHasMyRequest(false);
            setMyRequestId(null);
            
            // Remove from local state immediately
            setRequests(prev => prev.filter(req => req.objectId !== myRequestId));
        } catch (error) {
            console.error("Failed to delete request", error);
            alert("حدث خطأ أثناء محاولة الحذف.");
        }
    };

    const handleRequestAdded = (newRequest) => {
        setHasMyRequest(true);
        setMyRequestId(newRequest.objectId);
        setRequests(prev => [newRequest, ...prev]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Filter logic
    const filteredRequests = requests.filter(req => {
        const data = req.objectData;
            
        const matchesSpecialty = !filters.specialty || data.specialty === filters.specialty;
        const matchesCurrent = !filters.currentRegion || data.current_region === filters.currentRegion;
        
        const desiredRegionsArray = Array.isArray(data.desired_regions) 
            ? data.desired_regions 
            : (typeof data.desired_regions === 'string' ? data.desired_regions.split(',') : []);
            
        const matchesDesired = !filters.desiredRegion || desiredRegionsArray.includes(filters.desiredRegion);

        return matchesSpecialty && matchesCurrent && matchesDesired;
    });

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <AppHeader 
                hasRequest={hasMyRequest}
                onAddClick={() => setIsAddModalOpen(true)}
                onDeleteClick={handleDeleteMyRequest}
            />

            <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-6">
                
                {/* Fixed Filter Bar Area */}
                <div className="sticky top-14 md:top-16 z-30 bg-[var(--bg-color)] pt-1 pb-3 md:pb-6">
                    <FilterBar filters={filters} setFilters={setFilters} />
                </div>

                {/* Content Area */}
                <div className="mt-1 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                    {isLoading ? (
                        // Skeleton Loader
                        [1,2,3,4,5,6].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse flex flex-col gap-3">
                                <div className="flex gap-2 items-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded-xl"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                                        <div className="h-2 w-1/4 bg-gray-100 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-14 bg-gray-50 rounded-xl mt-2"></div>
                                <div className="h-8 bg-gray-100 rounded-xl mt-auto"></div>
                            </div>
                        ))
                    ) : filteredRequests.length > 0 ? (
                        filteredRequests.map(req => (
                            <RequestCard key={req.objectId} request={req} />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                <div className="icon-search text-xl"></div>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">لا توجد نتائج</h3>
                            <p className="text-xs text-gray-500 mb-4">لم نتمكن من العثور على طلبات تطابق الفلاتر المحددة.</p>
                            <Button variant="outline" size="sm" onClick={() => setFilters({specialty:'', currentRegion:'', desiredRegion:''})}>
                                مسح الفلاتر
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            <AddRequestDialog 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleRequestAdded}
            />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
