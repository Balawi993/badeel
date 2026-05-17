const AddRequestDialog = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = React.useState(1);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState({
        specialty: '',
        current_region: '',
        hospital_name: '',
        desired_regions: [],
        phone: ''
    });

    // Reset when opened
    React.useEffect(() => {
        if (isOpen) {
            setStep(1);
            setFormData({
                specialty: '',
                current_region: '',
                hospital_name: '',
                desired_regions: [],
                phone: ''
            });
        }
    }, [isOpen]);

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const toggleDesiredRegion = (region) => {
        setFormData(prev => {
            const current = prev.desired_regions;
            if (current.includes(region)) {
                return { ...prev, desired_regions: current.filter(r => r !== region) };
            }
            return { ...prev, desired_regions: [...current, region] };
        });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const formattedPhone = formData.phone.startsWith('0') 
                ? '966' + formData.phone.substring(1) 
                : formData.phone;

            const finalData = {
                ...formData,
                phone: formattedPhone
            };

            const newObject = await trickleCreateObject('TransferRequest', finalData);
            localStorage.setItem('badeeli_request_id', newObject.objectId);
            onSuccess(newObject);
            onClose();
        } catch (error) {
            console.error("Error submitting:", error);
            alert("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceed = () => {
        switch(step) {
            case 1: return !!formData.specialty;
            case 2: return !!formData.current_region;
            case 3: return true; // Hospital is optional
            case 4: return formData.desired_regions.length > 0;
            case 5: return !!formData.phone && formData.phone.length >= 9;
            default: return true;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إضافة طلب تبادل جديد">
            
            {/* Progress indicator */}
            <div className="flex gap-1 mb-5">
                {[1,2,3,4,5].map(i => (
                    <div 
                        key={i} 
                        className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-gray-100'}`}
                    />
                ))}
            </div>

            <div className="min-h-[180px]">
                {/* Step 1: Specialty */}
                {step === 1 && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-[13px] font-bold text-gray-900 block mb-1">ما هو تخصصك الوظيفي؟</label>
                        <div className="grid grid-cols-1 gap-2">
                            {SPECIALTIES.map(spec => (
                                <button
                                    key={spec}
                                    onClick={() => setFormData({ ...formData, specialty: spec })}
                                    className={`p-2.5 flex items-center gap-2 text-right text-[13px] rounded-xl border transition-all ${
                                        formData.specialty === spec 
                                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' 
                                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-medium'
                                    }`}
                                >
                                    <div className={`${SPECIALTY_ICONS[spec]} text-base`}></div>
                                    {spec}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Current Region */}
                {step === 2 && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-[13px] font-bold text-gray-900 block mb-1">أين تعمل حالياً؟ (المنطقة)</label>
                        <div className="grid grid-cols-2 gap-2">
                            {REGIONS.map(region => (
                                <button
                                    key={region}
                                    onClick={() => setFormData({ ...formData, current_region: region })}
                                    className={`p-2.5 text-center text-[12px] font-medium rounded-xl border transition-all ${
                                        formData.current_region === region 
                                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm' 
                                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                                    }`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Hospital Name */}
                {step === 3 && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-[13px] font-bold text-gray-900 block mb-1">اسم المستشفى/المركز الذي تعمل به <span className="text-gray-400 font-normal text-[11px]">(اختياري)</span></label>
                        <input
                            type="text"
                            autoFocus
                            placeholder="مثال: مستشفى الملك فهد..."
                            className="w-full border border-gray-200 rounded-xl p-3 text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                            value={formData.hospital_name}
                            onChange={e => setFormData({ ...formData, hospital_name: e.target.value })}
                        />
                    </div>
                )}

                {/* Step 4: Desired Regions */}
                {step === 4 && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                        <label className="text-[13px] font-bold text-gray-900 block mb-1">إلى أين ترغب بالتبادل؟ (يمكنك اختيار أكثر من منطقة)</label>
                        <div className="flex flex-wrap gap-1.5">
                            {REGIONS.filter(r => r !== formData.current_region).map(region => {
                                const isSelected = formData.desired_regions.includes(region);
                                return (
                                    <button
                                        key={region}
                                        onClick={() => toggleDesiredRegion(region)}
                                        className={`px-3 py-1.5 text-[12px] rounded-xl border transition-all ${
                                            isSelected 
                                            ? 'border-primary bg-primary text-white font-semibold shadow-sm' 
                                            : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                                        }`}
                                    >
                                        {region}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 5: Phone */}
                {step === 5 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div>
                            <label className="text-[13px] font-bold text-gray-900 block mb-1">رقم الجوال للتواصل (واتساب)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-[13px] text-gray-400 font-medium ltr" dir="ltr">+966</span>
                                <input
                                    type="tel"
                                    dir="ltr"
                                    placeholder="5xxxxxxxx"
                                    className="w-full border border-gray-200 rounded-xl p-3 pl-12 text-[13px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left shadow-sm font-medium"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 mt-4 pt-3 border-t border-gray-100 min-h-[50px]">
                {step > 1 && (
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl font-semibold" onClick={handlePrev}>
                        السابق
                    </Button>
                )}
                
                {step < 5 ? (
                    canProceed() && (
                        <Button 
                            variant="primary" 
                            size="sm"
                            className={`${step === 1 ? 'w-full' : 'flex-[2] w-full'} rounded-xl font-bold animate-in fade-in zoom-in duration-200 shadow-sm`} 
                            onClick={handleNext}
                        >
                            التالي
                        </Button>
                    )
                ) : (
                    canProceed() && (
                        <Button 
                            variant="primary" 
                            size="sm"
                            className="flex-[2] w-full rounded-xl font-bold animate-in fade-in zoom-in duration-200 shadow-sm" 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="icon-loader animate-spin text-sm"></div>
                                    جاري النشر
                                </span>
                            ) : 'انشر الطلب'}
                        </Button>
                    )
                )}
            </div>
        </Modal>
    );
};