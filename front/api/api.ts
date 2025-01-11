/*export const uploadFile = async (file: File, documentType: string) => {
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
};*/

export const postRequest = async (url: string, body?: string) => {
  const token = localStorage.getItem('token')
  console.log('token:', token)
  console.log('body:', body)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body,
  })

  if (!response.ok) {
    throw new Error(`Failed to post to ${url}`)
  }
  return await response.json()
}

export const postRequestDropDocument = async (
  url: string,
  data: FormData | { [key: string]: string | Blob },
) => {
  const token = localStorage.getItem('token')
  let body: BodyInit

  if (data instanceof FormData) {
    body = data
  } else {
    // Si les données ne sont pas déjà un FormData, les convertir
    const formData = new FormData()
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        formData.append(key, data[key])
      }
    }
    body = formData
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `Failed to post to ${url}`)
  }

  return response.json()
}

export const postRequestImportUser = async (
  url: string,
  formData: FormData,
) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || `Failed to post to ${url}`)
  }

  return response.json()
}

export const postRequestCreateUser = async (
  url: string,
  userData: {
    email: string
    password: string
    name: string
    last_name: string
    telephone: string
    role: string
  },
) => {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${url}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data: userData }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(
      errorData.message || `Failed to create user: ${response.statusText}`,
    )
  }

  return response.json()
}
