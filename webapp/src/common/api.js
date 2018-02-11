const BASE_URL = 'http://localhost:3000'

const endpoints = {
  LOGIN: ['/login', 'POST'],
  GET_FEELINGS: ['/api/feelings', 'GET'],
  GET_FEED: ['/api/feed', 'GET'],
  GET_FRIENDS: ['/api/friends', 'POST'],
  ADD_POST: ['/api/post', 'POST'],
};

export default Object.entries(endpoints).reduce((all, [name, [path, method]]) => ({
  ...all,
  [name]: { path: `${BASE_URL}${path}`, method },
}), {});

export async function sendRequest(path, method, data, auth = true, headers = {}) {
  const something = await new Promise((resolve, reject) => {
    setTimeout(function(){
      resolve("Success!"); // Yay! Everything went well!
    }, 250);
  });

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
