import sha1 from 'sha1';

export async function saveImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);

  return fetch(process.env.REACT_APP_CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })
  .then((res) => res.json())
  .then((data) => data.url);
}

export async function deleteImage(imaUrl) {
  const publicId = getPublicId(imaUrl);
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const string = `public_id=${publicId}&timestamp=${timestamp}${process.env.REACT_APP_CLOUDINARY_API_SECRET}`;
  const signature = sha1(string);
  const formData = new FormData();

  formData.append('api_key', process.env.REACT_APP_CLOUDINARY_API_KEY)
  formData.append('public_id', publicId);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  
  return fetch(process.env.REACT_APP_CLOUDINARY_DESTROY_URL, {
    method: 'POST',
    body: formData,
  })
  .then((res) => {
    if (res.ok) return true;
    return false;
  })
  .catch((err) => {
    console.log(err);
    return false;
  })
}

function getPublicId(str) {
  const stringAfterLastSlash = str.substring(str.lastIndexOf('/') + 1);
  const stringAfterDot = stringAfterLastSlash.substring(0, stringAfterLastSlash.indexOf('.'));
  return stringAfterDot;
}