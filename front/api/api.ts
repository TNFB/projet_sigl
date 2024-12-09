export const uploadFile = async (file: File, documentType: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('documentType', documentType);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return response.json();
};

export const postRequest = async (url: string, body?: string) => {
  console.log(body);
  const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL }/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body,
  });

  if (!response.ok) {
    throw new Error(`Failed to post to ${url}`);
  }

  return response.json();
};