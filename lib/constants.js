const SPECIALTIES = [
    "فني رعاية مرضى",
    "فني تخطيط قلب",
    "فني تخطيط مخ وأعصاب",
    "فني تعقيم طبي",
    "مساعد طبيب أسنان",
    "فني ترميز طبي"
];

const SPECIALTY_ICONS = {
    "فني رعاية مرضى": "icon-user-plus",
    "فني تخطيط قلب": "icon-activity",
    "فني تخطيط مخ وأعصاب": "icon-brain",
    "فني تعقيم طبي": "icon-sparkles",
    "مساعد طبيب أسنان": "icon-smile",
    "فني ترميز طبي": "icon-file-text"
};

const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'الآن';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `قبل ${diffInMinutes} دقيقة`;
    if (diffInMinutes === 60) return 'قبل ساعة';
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        if (diffInHours === 1) return 'قبل ساعة';
        if (diffInHours === 2) return 'قبل ساعتين';
        if (diffInHours <= 10) return `قبل ${diffInHours} ساعات`;
        return `قبل ${diffInHours} ساعة`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        if (diffInDays === 1) return 'قبل يوم';
        if (diffInDays === 2) return 'قبل يومين';
        if (diffInDays <= 10) return `قبل ${diffInDays} أيام`;
        return `قبل ${diffInDays} يوم`;
    }
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        if (diffInWeeks === 1) return 'قبل أسبوع';
        if (diffInWeeks === 2) return 'قبل أسبوعين';
        return `قبل ${diffInWeeks} أسابيع`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        if (diffInMonths === 1) return 'قبل شهر';
        if (diffInMonths === 2) return 'قبل شهرين';
        return `قبل ${diffInMonths} أشهر`;
    }
    
    const diffInYears = Math.floor(diffInDays / 365);
    return `قبل ${diffInYears} سنة`;
};

const REGIONS = [
    "الرياض",
    "مكة المكرمة",
    "المدينة المنورة",
    "القصيم",
    "المنطقة الشرقية",
    "عسير",
    "تبوك",
    "حائل",
    "الحدود الشمالية",
    "جازان",
    "نجران",
    "الباحة",
    "الجوف"
];