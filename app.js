const donorForm = document.getElementById('donorForm');
const scanBtn = document.getElementById('scanBtn');
const radarContainer = document.getElementById('radarContainer');
const scanIcon = document.getElementById('scanIcon');

// 1. Handle Registration Form Submission
donorForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        latitude: parseFloat(document.getElementById('lat').value),
        longitude: parseFloat(document.getElementById('lng').value),
        isAvailable: true
    };

    try {
        const response = await fetch('http://localhost:8080/api/donors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('🚀 Beacon Activated! You are now live on the Sanjeevani network.');
            donorForm.reset();
        } else {
            throw new Error('Server responded with error');
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('⚠️ Registration Failed. Please ensure your local server is running at :8080');
    }
});

// 2. Handle Radar Scanning
scanBtn.addEventListener('click', async () => {
    // UI Loading State
    scanBtn.disabled = true;
    scanIcon.classList.add('animate-spin');
    radarContainer.innerHTML = `
        <div class="flex flex-col items-center">
            <div class="radar-pulse mb-8"></div>
            <p class="text-red-600 font-bold animate-pulse uppercase tracking-widest text-sm">Pinging Local Network...</p>
        </div>
    `;

    try {
        const response = await fetch('http://localhost:8080/api/donors');
        const donors = await response.json();

        // Small delay for "visual effect"
        setTimeout(() => {
            renderDonors(donors);
            scanBtn.disabled = false;
            scanIcon.classList.remove('animate-spin');
        }, 800);

    } catch (error) {
        console.error('Scan error:', error);
        radarContainer.innerHTML = `
            <div class="text-center p-8 bg-red-50 rounded-2xl border border-red-100">
                <p class="text-red-600 font-bold mb-2">Scan Failed</p>
                <p class="text-slate-500 text-xs">Could not connect to the API server.</p>
            </div>
        `;
        scanBtn.disabled = false;
        scanIcon.classList.remove('animate-spin');
    }
});

// 3. Render Donor Cards
function renderDonors(donors) {
    if (!donors || donors.length === 0) {
        radarContainer.innerHTML = `<p class="text-slate-400 font-medium italic">Awaiting Radar Scan...</p>`;
        return;
    }

    radarContainer.className = "grid grid-cols-1 md:grid-cols-2 gap-4 w-full content-start overflow-y-auto max-h-[600px] pr-2";
    radarContainer.innerHTML = donors.map((donor, index) => `
        <div class="donor-card bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4" style="animation-delay: ${index * 0.1}s">
            <div class="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600 font-black text-xl border border-red-100 shrink-0">
                ${donor.bloodGroup}
            </div>
            <div class="overflow-hidden">
                <h4 class="font-bold text-slate-900 truncate">${donor.name}</h4>
                <p class="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">
                    GPS: ${donor.latitude.toFixed(4)}, ${donor.longitude.toFixed(4)}
                </p>
                <div class="flex items-center gap-1 mt-2">
                    <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span class="text-[9px] font-bold text-green-600 uppercase">Available</span>
                </div>
            </div>
        </div>
    `).join('');
}