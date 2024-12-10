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

export const postRequestDropDocument = async (url: string, data: FormData) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    throw new Error(`Failed to post to ${url}`);
  }

  return response.json();
};

export const postRequestCreateUser = async (url: string, userData: {
  email: string;
  password: string;
  name: string;
  lastName: string;
  telephone: string;
  role: string;
}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to create user: ${response.statusText}`);
  }

  return response.json();
};
