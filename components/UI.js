const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseStyle = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none rounded-xl active:scale-[0.98]";
    
    const variants = {
        primary: "bg-primary text-white hover:bg-primary/90",
        danger: "bg-danger text-white hover:bg-danger/90",
        outline: "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
    };
    
    const sizes = {
        sm: "text-[11px] px-2.5 py-1.5",
        md: "text-[13px] px-3.5 py-2",
        lg: "text-[15px] px-4 py-2.5",
        icon: "p-1.5"
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div className="relative bg-white rounded-t-[24px] sm:rounded-2xl shadow-ios-lg w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-300">
                {/* iOS bottom sheet pull indicator */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="icon-x text-lg"></div>
                    </button>
                </div>
                <div className="p-4 sm:p-5 overflow-y-auto hide-scrollbar pb-safe">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Badge = ({ children, className = '', variant = 'default' }) => {
    const variants = {
        default: "bg-gray-100 text-gray-700",
        primary: "bg-primary/10 text-primary",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};