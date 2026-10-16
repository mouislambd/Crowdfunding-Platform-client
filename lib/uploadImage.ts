export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Image upload failed');
  }
  const data = await response.json();
  if (!data.success || !data.data?.url) {
    throw new Error('Invalid response from imgBB');
  }
  return data.data.url;
}
