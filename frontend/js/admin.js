// Simple admin upload script
(async function(){
    const courseSelect = document.getElementById('courseSelect');
    const weekInput = document.getElementById('weekInput');
    const topicTitle = document.getElementById('topicTitle');
    const durationInput = document.getElementById('duration');
    const videoFile = document.getElementById('videoFile');
    const uploadBtn = document.getElementById('uploadBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const status = document.getElementById('status');

    function setStatus(msg, isError){
        status.style.color = isError ? '#f87171' : '#a0f7c4';
        status.textContent = msg;
    }

    async function loadCourses(){
        setStatus('Loading courses...');
        try{
            const res = await fetch('/api/courses');
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to load courses');
            const courses = data.courses || [];
            if (!Array.isArray(courses)) throw new Error('Invalid courses format');
            courseSelect.innerHTML = '';
            if (courses.length === 0) {
                const opt = document.createElement('option');
                opt.textContent = 'No courses available';
                opt.disabled = true;
                courseSelect.appendChild(opt);
                setStatus('No courses available. Seed database or create a course first.', true);
                return;
            }
            courses.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c._id;
                opt.textContent = `${c.title} — ${c.category}`;
                courseSelect.appendChild(opt);
            });
            setStatus(`${courses.length} course(s) loaded`);
        } catch (err){
            setStatus('Failed to load courses: '+(err.message||err), true);
        }
    }

    refreshBtn.addEventListener('click', loadCourses);

    // Show selected filename
    videoFile.addEventListener('change', () => {
        if (videoFile.files[0]) setStatus('Selected: ' + videoFile.files[0].name);
    });

    uploadBtn.addEventListener('click', () => {
        const courseId = courseSelect.value;
        if (!courseId) { setStatus('Select a course first', true); return; }
        if (!videoFile.files[0]) { setStatus('Select a video file to upload', true); return; }

        const form = new FormData();
        form.append('video', videoFile.files[0]);
        if (weekInput.value) form.append('week', weekInput.value);
        if (topicTitle.value) form.append('topicTitle', topicTitle.value);
        if (durationInput.value) form.append('duration', durationInput.value);

        // Use XHR to show progress
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/courses/${courseId}/upload-resource`, true);
        const token = localStorage.getItem('token');
        if (token) xhr.setRequestHeader('Authorization', 'Bearer ' + token);

        uploadBtn.disabled = true;
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                const pct = Math.round((e.loaded / e.total) * 100);
                setStatus('Uploading... ' + pct + '%');
            }
        };
        xhr.onload = function() {
            uploadBtn.disabled = false;
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    setStatus('Upload successful: ' + (data.url || '')); 
                } catch (err) {
                    setStatus('Upload completed', false);
                }
            } else {
                try { const d = JSON.parse(xhr.responseText); setStatus('Upload failed: '+(d.message||xhr.statusText), true); } catch { setStatus('Upload failed: '+xhr.statusText, true); }
            }
        };
        xhr.onerror = function() { uploadBtn.disabled = false; setStatus('Upload error', true); };

        xhr.send(form);
    });

    // Initial load
    await loadCourses();
})();