export async function uploadMaterial(file, userId, courseId) {
  if (!userId) throw new Error('User ID is required');
  if (!courseId) throw new Error('Course ID is required');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('courseId', courseId);

  const response = await fetch('/api/materials/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include', // if using cookies/auth
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error('Failed to upload material: ' + (error.message || response.statusText));
  }

  return await response.json();
}