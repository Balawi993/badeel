const RequestCard = ({ request }) => {
    const handleWhatsApp = () => {
        const phone = request.objectData.phone.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phone}`, '_blank');
    };

    const date = getRelativeTime(request.createdAt);

    const desiredRegionsArray = Array.isArray(request.objectData.desired_regions) 
        ? request.objectData.desired_regions 
        : (typeof request.objectData.desired_regions === 'string' ? request.objectData.desired_regions.split(',') : []);

    return (
        <div className="bg-white rounded-[18px] p-3 md:p-4 shadow-ios hover:shadow-ios-lg border border-gray-100 flex flex-col gap-2.5 md:gap-3 transition-all h-full">
            {/* Header: Specialty & Date */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <div className={`${SPECIALTY_ICONS[request.objectData.specialty] || 'icon-user'} text-sm`}></div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-[13px] text-gray-900 leading-tight">{request.objectData.specialty}</h3>
                        <p className="text-[10px] text-gray-500">{date}</p>
                    </div>
                </div>
            </div>

            {/* Current Status */}
            <div className="bg-gray-50/80 rounded-xl p-2.5 flex flex-col gap-1.5 border border-gray-100/50">
                <div className="flex items-center gap-1.5">
                    <div className="icon-map-pin text-gray-400 text-[11px] w-3"></div>
                    <span className="text-gray-500 text-[11px]">من:</span>
                    <span className="font-semibold text-gray-900 text-[11px]">{request.objectData.current_region}</span>
                </div>
                {request.objectData.hospital_name && request.objectData.hospital_name.trim() !== '' && (
                    <div className="flex items-center gap-1.5">
                        <div className="icon-building text-gray-400 text-[11px] w-3"></div>
                        <span className="text-gray-500 text-[11px]">المستشفى:</span>
                        <span className="font-semibold text-gray-900 text-[11px] line-clamp-1">{request.objectData.hospital_name}</span>
                    </div>
                )}
            </div>

            {/* Desired Regions */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                    <div className="icon-arrow-left text-primary text-[11px] w-3"></div>
                    <span className="text-[11px] font-semibold text-primary whitespace-nowrap">يرغب بالنقل إلى:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {desiredRegionsArray.map((region, idx) => (
                        <Badge key={idx} variant="primary">{region.trim()}</Badge>
                    ))}
                </div>
            </div>

            {/* Action */}
            <Button 
                variant="primary" 
                size="sm" 
                className="w-full mt-auto pt-1 gap-1.5 rounded-xl h-[36px] font-bold shadow-[0_2px_10px_rgba(var(--primary),0.2)] bg-gradient-to-b from-primary to-[hsl(var(--primary)_/_0.95)] border border-black/5"
                onClick={handleWhatsApp}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" className="fill-current" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.888-.653-1.488-1.46-1.662-1.759-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                <span className="text-[12px]">تواصل عبر واتساب</span>
            </Button>
        </div>
    );
};
