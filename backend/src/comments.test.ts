import { getComments, getCommentsCount, addNewComment } from "./comments"
import { Comment, DatabaseComment, NewComment } from "./models";

const mockComments: DatabaseComment[] = [
  {
    contents: 'test',
    createdAt: new Date(1923, 4, 3),
    id: 0,
    isDeleted: false,
    parentId: null,
    url: 'https://www.tabchat.io',
    votes: 0,
    deleteKey: '123'
  },
  {
    contents: 'test',
    createdAt: new Date(1923, 4, 4),
    id: 1,
    isDeleted: false,
    parentId: null,
    url: 'https://www.tabchat.io',
    votes: 0,
    deleteKey: '456'
  },
  {
    contents: 'Deleted',
    createdAt: new Date(1923, 4, 5),
    id: 2,
    isDeleted: true,
    parentId: 1,
    url: 'https://www.tabchat.io',
    votes: 0,
    deleteKey: '875'
  }
]

jest.mock('./database', () => ({
  knex: {
    select: jest.fn(() => ({
      where: jest.fn((whereArg: { url: string }) => ({
        from: jest.fn((fromArg: string) => mockComments.filter(comment => comment.url === whereArg.url))
      }))
    })),
    count: jest.fn(() => ({
      where: jest.fn((whereArg: { url: string, isDeleted: boolean }) => ({
        from: jest.fn((fromArg: string) => {
          const { length } = mockComments.filter(comment => comment.url === whereArg.url && comment.isDeleted === whereArg.isDeleted);
          return [{ count: length.toString() }];
        })
      }))
    }))
  }
}));

jest.mock('./app', () => jest.fn());
jest.mock('./events', () => jest.fn());
jest.mock('./configuration', () => ({
  default: {
    maxCommentLength: 30
  }
}))

test('getComments', async () => {
  const req = {
    params: {
      url: 'https://www.tabchat.io'
    },
    query: {
      deleteKey: '123'
    }
  };
  const res = {
    json: jest.fn()
  }
  await getComments(req as any, res as any);
  const expectedResult: Comment[] = [
    {
      canDelete: false,
      contents: 'test',
      createdAt: new Date(1923, 4, 4).toISOString(),
      id: 1,
      isDeleted: false,
      parentId: null,
      url: 'https://www.tabchat.io',
      votes: 0,
      children: [
        {
          canDelete: false,
          contents: 'Deleted',
          createdAt: new Date(1923, 4, 5).toISOString(),
          id: 2,
          isDeleted: true,
          parentId: 1,
          url: 'https://www.tabchat.io',
          votes: 0,
          children: []
        }
      ]
    },
    {
      canDelete: true,
      contents: 'test',
      createdAt: new Date(1923, 4, 3).toISOString(),
      id: 0,
      isDeleted: false,
      parentId: null,
      url: 'https://www.tabchat.io',
      votes: 0,
      children: []
    }
  ];
  expect(res.json).toBeCalledWith(expectedResult)
});

test('getCommentsCount', async () => {
  const req = {
    params: {
      url: 'https://www.tabchat.io'
    }
  }
  const res = {
    json: jest.fn()
  }
  await getCommentsCount(req as any, res as any);
  expect(res.json).toBeCalledWith(2);
});

test('addNewComment with empty comment', async () => {

  const req = {
    params: {
      url: 'https://www.tabchat.io'
    },
    body: {
    }
  }

  const sendFn = jest.fn();

  const res = {
    json: jest.fn(),
    status: jest.fn((statusCode: number) => ({
      send: sendFn
    }))
  }

  await addNewComment(req as any, res as any);
  expect(res.status).toBeCalledWith(400);
  expect(res.json).toBeCalledTimes(0);
  expect(sendFn).toBeCalledWith('Comment is malformed or empty');
});
