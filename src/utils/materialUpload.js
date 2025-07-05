export async function uploadMaterial(file, courseId) {
  if (!courseId) throw new Error('Course ID is required');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('courseId', courseId);

  const response = await fetch(`${import.meta.env.VITE_APP_API_URL || 'http://localhost:4000/api'}/materials/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error('Failed to upload material: ' + (error.message || response.statusText));
  }

  return await response.json();
}