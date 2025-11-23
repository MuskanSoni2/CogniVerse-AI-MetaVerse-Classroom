Place sample video files here so the courses page and seeded courses can play local videos.

Suggested filenames (used by seed data / fallback samples):
- sample1.mp4
- sample2.mp4
- intro-ai.mp4
- supervised-learning.mp4

How to add videos:
1. Copy MP4 files into this folder.
2. If you run the backend server (`node backend/server.js`) it serves the frontend statically and `/videos/<filename>` will be available to the browser.
3. You can also open `frontend/courses.html` directly in a browser, but some browsers restrict local file access for video playback — running the server is recommended.

If you want, I can add a tiny placeholder silent video file automatically, but embedding binary files into the repo might bloat it. Let me know if you'd like me to create small placeholder video files programmatically instead.