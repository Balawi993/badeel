// Local mock for Trickle database APIs when not running inside Trickle platform
if (typeof window.trickleListObjects === 'undefined') {
    console.log("Trickle APIs not detected. Loading local mock database using localStorage...");

    // Helper to load requests from localStorage
    const getLocalRequests = () => {
        const data = localStorage.getItem('mock_transfer_requests');
        if (!data) {
            // Seed with professional mock data if empty
            const seedData = [
                {
                    objectId: "req_1",
                    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
                    objectData: {
                        specialty: "فني رعاية مرضى",
                        current_region: "الرياض",
                        hospital_name: "مستشفى الملك سلمان بالرياض",
                        desired_regions: ["مكة المكرمة", "المدينة المنورة"],
                        phone: "966512345678",
                        notes: "أرغب في النقل العكسي في أقرب وقت ممكن لظروف عائلية خاصة."
                    }
                },
                {
                    objectId: "req_2",
                    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
                    objectData: {
                        specialty: "فني تخطيط قلب",
                        current_region: "المنطقة الشرقية",
                        hospital_name: "مستشفى الملك فهد التخصصي بالدمام",
                        desired_regions: ["الرياض", "القصيم"],
                        phone: "966587654321",
                        notes: "النقل بالتوافق المتبادل أو البديل المباشر"
                    }
                },
                {
                    objectId: "req_3",
                    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
                    objectData: {
                        specialty: "مساعد طبيب أسنان",
                        current_region: "عسير",
                        hospital_name: "مركز طب الأسنان التخصصي بأبها",
                        desired_regions: ["الرياض", "جازان"],
                        phone: "966555555555",
                        notes: "أبحث عن بديل وظيفي مناسب للتخصص"
                    }
                },
                {
                    objectId: "req_4",
                    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(), // 3 days ago
                    objectData: {
                        specialty: "فني تعقيم طبي",
                        current_region: "مكة المكرمة",
                        hospital_name: "مستشفى النور التخصصي بمكة",
                        desired_regions: ["جدة", "المدينة المنورة"],
                        phone: "966566666666",
                        notes: "جاهز لإنهاء الإجراءات فور توفر البديل"
                    }
                }
            ];
            localStorage.setItem('mock_transfer_requests', JSON.stringify(seedData));
            return seedData;
        }
        return JSON.parse(data);
    };

    const saveLocalRequests = (requests) => {
        localStorage.setItem('mock_transfer_requests', JSON.stringify(requests));
    };

    window.trickleListObjects = async function(tableName, limit = 100, order = true) {
        // Simulate network latency (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let items = getLocalRequests();
        // Sort by createdAt descending
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        if (limit) {
            items = items.slice(0, limit);
        }
        
        return { items };
    };

    window.trickleCreateObject = async function(tableName, data) {
        // Simulate network latency (800ms)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const requests = getLocalRequests();
        const newObject = {
            objectId: "req_" + Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            objectData: data
        };
        
        requests.push(newObject);
        saveLocalRequests(requests);
        return newObject;
    };

    window.trickleDeleteObject = async function(tableName, objectId) {
        // Simulate network latency (400ms)
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const requests = getLocalRequests();
        const updated = requests.filter(r => r.objectId !== objectId);
        saveLocalRequests(updated);
        return { success: true };
    };
}
