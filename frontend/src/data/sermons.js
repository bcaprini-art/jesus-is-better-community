export const SERMONS = [
  {
    id: '1',
    title: 'The Beauty of the Cross',
    scriptureRef: 'Romans 3:21-26',
    seriesName: 'Jesus Is Better',
    description: "The gospel isn't just the starting line. It's the whole race. In Romans 3, Paul shows us the mechanism of transformation — and it isn't trying harder. It is beholding more clearly the one who became sin for us so that we might become the righteousness of God.",
    videoUrl: 'https://www.youtube.com/embed/2vn7IkyXDEo',
    thumbnailUrl: null,
    publishedAt: '2026-04-20',
    durationSeconds: 2847,
    commentCount: 47,
    featured: true,
  },
  {
    id: '2',
    title: 'Joseph and the Sovereignty of God',
    scriptureRef: 'Genesis 50:15-21',
    seriesName: 'Jesus Is Better',
    description: 'Am I in the place of God? Joseph\'s question to his brothers is the key to everything. He is not minimizing their cruelty. He is saying that God is the author of a story larger than any treachery — and that to harbor bitterness would be to act as though he, Joseph, were the one in charge of how the story ends.',
    videoUrl: 'https://www.youtube.com/embed/tAHG04rmDfM',
    thumbnailUrl: null,
    publishedAt: '2026-04-13',
    durationSeconds: 2634,
    commentCount: 31,
    featured: false,
  },
  {
    id: '3',
    title: 'Moses and the Mercy of God',
    scriptureRef: 'Exodus 34:6-7',
    seriesName: 'Jesus Is Better',
    description: "Slow to anger. Abounding in love. This is God's own name for himself, spoken to a man who had just watched his people make an idol. Rugged perseverance is not gritting your teeth — it is rooted in the mercy of the God who keeps showing up.",
    videoUrl: 'https://www.youtube.com/embed/irGTOHc_Hts',
    thumbnailUrl: null,
    publishedAt: '2026-04-06',
    durationSeconds: 2910,
    commentCount: 28,
    featured: false,
  },
  {
    id: '4',
    title: 'The Word That Transforms',
    scriptureRef: '2 Timothy 3:16-17',
    seriesName: 'Jesus Is Better',
    description: 'You search the scriptures — Jesus says — and it is they that testify about me. The Bible is not a self-help manual. It is not a system of principles. It is a portrait of a Person. And the Puritans who wore out their knees before it knew something we have largely forgotten: contemplation is the engine of transformation.',
    videoUrl: 'https://www.youtube.com/embed/-_OTNUY0YPg',
    thumbnailUrl: null,
    publishedAt: '2026-03-30',
    durationSeconds: 2700,
    commentCount: 19,
    featured: false,
  },
]

export const MOCK_COMMENTS = {
  '1': [
    {
      id: 'c1',
      sermonId: '1',
      authorName: 'James W.',
      authorInitials: 'JW',
      content: "This message hit me deeply. The idea that the cross isn't just where we begin but where we return daily is transforming how I approach my sin and God's grace.",
      likeCount: 23,
      createdAt: '2026-04-20T14:30:00Z',
      replies: [
        {
          id: 'c1r1',
          authorName: 'Ruth P.',
          authorInitials: 'RP',
          content: "Amen, James. I've been sitting with Romans 3:23-24 all week. 'Justified freely by his grace.' There is such rest in that.",
          likeCount: 8,
          createdAt: '2026-04-20T16:10:00Z',
          replies: [],
        },
      ],
    },
    {
      id: 'c2',
      sermonId: '1',
      authorName: 'Maria S.',
      authorInitials: 'MS',
      content: "I've listened to this three times now. Pastor Bugh's exposition of propitiation in verse 25 is the clearest I've ever heard it explained.",
      likeCount: 17,
      createdAt: '2026-04-21T09:15:00Z',
      replies: [],
    },
    {
      id: 'c3',
      sermonId: '1',
      authorName: 'Tom B.',
      authorInitials: 'TB',
      content: 'Sharing this with my small group this week. The application section about preaching the gospel to yourself was convicting.',
      likeCount: 12,
      createdAt: '2026-04-21T11:45:00Z',
      replies: [
        {
          id: 'c3r1',
          authorName: 'Lisa C.',
          authorInitials: 'LC',
          content: "That application was gold. 'Gospel fluency' — I want to grow in that.",
          likeCount: 5,
          createdAt: '2026-04-21T13:00:00Z',
          replies: [],
        },
      ],
    },
  ],
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
