const BASE_URL = '';

const endpoints = {
  LOGIN: ['/login', 'POST'],
  CREATE_ACCOUNT: ['/user', 'POST'],
  GET_CURRENT_USER: ['/api/current-user', 'GET'],
  GET_FEELINGS: ['/api/feelings', 'GET'],
  GET_POSTS: ['/api/feed', 'GET'],
  GET_FRIENDS: ['/api/friends', 'POST'],
  ADD_POST: ['/api/post', 'POST'],
};

export default Object.entries(endpoints).reduce((all, [name, [path, method]]) => ({
  ...all,
  [name]: { path: `${BASE_URL}${path}`, method },
}), {});

export async function sendRequest({ path, method }, data, auth = true, headers = {}) {
  const request = new Request(path, {
    method,
    headers: new Headers({
      Authorization: auth ? `Bearer ${localStorage.getItem('token')}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...headers,
    }),
    body: data ? JSON.stringify(data) : undefined,
  });

  const response = await fetch(request);
  return response.json();
}
