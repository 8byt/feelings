import { Map, fromJS } from 'immutable';

function mapify(list) {
  return list.reduce((all, elem) => all.set(elem.get('id'), elem), Map());
}

const data = {
  users: [
    {
      id: 1,
      name: 'Sam Myers',
      email: 'sammyers.dev@gmail.com'
    },
    {
      id: 2,
      name: 'Danny Wolf',
      email: '2dawolf@gmail.com'
    }
  ],
  feelings: [
    {
      id: 1,
      name: 'Happy',
      glyph: '😁'
    },
    {
      id: 2,
      name: 'Afraid',
      glyph: '😱'
    },
    {
      id: 3,
      name: 'Fire',
      glyph: '🔥'
    }
  ],
  posts: [
    {
      id: 1,
      userId: 1,
      feelingId: 1,
      children: [
        {
          id: 3,
          userId: 2,
          feelingId: 3,
          children: [
            {
              id: 5,
              userId: 1,
              feelingId: 2,
              children: []
            },
            {
              id: 6,
              userId: 2,
              feelingId: 2,
              children: []
            }
          ]
        },
        {
          id: 3,
          userId: 1,
          feelingId: 3,
          children: [
            {
              id: 5,
              userId: 1,
              feelingId: 2,
              children: []
            },
            {
              id: 6,
              userId: 2,
              feelingId: 2,
              children: []
            }
          ]
        },
        {
          id: 4,
          userId: 1,
          feelingId: 1,
          children: [
            {
              id: 7,
              userId: 1,
              feelingId: 1,
              children: []
            },
            {
              id: 8,
              userId: 2,
              feelingId: 3,
              children: []
            }
          ]
        }
      ]
    },
    {
      id: 2,
      userId: 2,
      feelingId: 2,
      children: [
        {
          id: 9,
          userId: 1,
          feelingId: 1,
          children: [
            {
              id: 10,
              userId: 2,
              feelingId: 3,
              children: []
            }
          ]
        }
      ],
    }
  ]
};

export default Map({
  users: mapify(fromJS(data.users)),
  feelings: mapify(fromJS(data.feelings)),
  posts: fromJS(data.posts)
});
