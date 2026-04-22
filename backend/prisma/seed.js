// Seed script for Jesus Is Better Community
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // --- Admin / Pastor user ---
  const hashedPassword = await bcrypt.hash('Admin1234!', 12);

  const pastor = await prisma.user.upsert({
    where: { email: 'pastor@jesusisbetter.org' },
    update: {},
    create: {
      email: 'pastor@jesusisbetter.org',
      name: 'Pastor Rob Bugh',
      password: hashedPassword,
      role: 'PASTOR',
      verified: true,
      bio: 'Senior Pastor and author of "Jesus Is Better". Passionate about expository preaching and helping people encounter the living God through Scripture.',
      location: 'Illinois, USA',
    },
  });

  console.log(`✅ Pastor created: ${pastor.email}`);

  // Sample community member
  const memberPassword = await bcrypt.hash('Member1234!', 12);
  const member1 = await prisma.user.upsert({
    where: { email: 'sarah.johnson@example.com' },
    update: {},
    create: {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      password: memberPassword,
      role: 'MEMBER',
      verified: true,
      bio: 'Lifelong follower of Christ. Mother, teacher, and lover of good coffee.',
      location: 'Illinois, USA',
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'david.chen@example.com' },
    update: {},
    create: {
      email: 'david.chen@example.com',
      name: 'David Chen',
      password: memberPassword,
      role: 'MEMBER',
      verified: true,
      bio: 'Engineer by day, worship leader on weekends.',
      location: 'Chicago, IL',
    },
  });

  console.log(`✅ Sample members created`);

  // --- Sermons (Rob Bugh themes: gospel-centered expository preaching) ---
  const sermon1 = await prisma.sermon.upsert({
    where: { id: 'sermon-001' },
    update: {},
    create: {
      id: 'sermon-001',
      title: 'The Glory of God in the Face of Jesus Christ',
      description:
        'In this message, we explore what it means that God — who said "Let light shine out of darkness" — has shone in our hearts to give the light of the knowledge of the glory of God in the face of Jesus Christ (2 Cor. 4:6). The gospel is not merely information; it is encounter with the living God. This is the heart of our faith and the foundation of our community.',
      scriptureRef: '2 Corinthians 4:1-6',
      seriesName: 'Gospel Encounters',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      audioUrl: 'https://media.jesusisbetter.org/sermons/2024/glory-of-god.mp3',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: new Date('2024-10-06'),
      durationSeconds: 2820,
      featured: true,
      tags: ['gospel', '2 corinthians', 'glory of god', 'transformation'],
    },
  });

  const sermon2 = await prisma.sermon.upsert({
    where: { id: 'sermon-002' },
    update: {},
    create: {
      id: 'sermon-002',
      title: 'Abiding in the Vine: Life in Christ',
      description:
        'Jesus says "I am the vine; you are the branches. Whoever abides in me and I in him, he it is that bears much fruit, for apart from me you can do nothing" (John 15:5). What does it look like to truly abide? This message examines the daily rhythms — prayer, Scripture, fellowship — that root us in Jesus and produce fruit that lasts.',
      scriptureRef: 'John 15:1-11',
      seriesName: 'I AM: The Claims of Christ',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      audioUrl: 'https://media.jesusisbetter.org/sermons/2024/abiding-in-the-vine.mp3',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: new Date('2024-11-10'),
      durationSeconds: 3060,
      featured: true,
      tags: ['john 15', 'abiding', 'discipleship', 'fruit', 'prayer'],
    },
  });

  const sermon3 = await prisma.sermon.upsert({
    where: { id: 'sermon-003' },
    update: {},
    create: {
      id: 'sermon-003',
      title: 'Suffering, Hope, and the Sovereignty of God',
      description:
        'Romans 8:28 is one of the most beloved and most misunderstood verses in Scripture. "For those who love God all things work together for good." In this message we wrestle honestly with suffering, loss, and the confidence that our God is not absent — he is sovereign, and he is good. A word for anyone walking through hard seasons.',
      scriptureRef: 'Romans 8:18-30',
      seriesName: 'Romans: The Gospel Unleashed',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      audioUrl: 'https://media.jesusisbetter.org/sermons/2025/suffering-and-hope.mp3',
      thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      publishedAt: new Date('2025-01-19'),
      durationSeconds: 3300,
      featured: false,
      tags: ['romans 8', 'suffering', 'sovereignty', 'hope', 'grief'],
    },
  });

  console.log(`✅ 3 sermons created`);

  // --- Prayer Requests ---
  await prisma.prayerRequest.upsert({
    where: { id: 'prayer-001' },
    update: {},
    create: {
      id: 'prayer-001',
      userId: member1.id,
      title: 'Healing for my mother',
      content:
        'My mother was diagnosed with breast cancer last week. She begins chemotherapy in two weeks. Please pray for complete healing, for peace that surpasses understanding, and for wisdom for her doctors. She has been a woman of faith her whole life and this has shaken our family. We believe in the God who heals.',
      category: 'HEALING',
      anonymous: false,
      answered: false,
    },
  });

  await prisma.prayerRequest.upsert({
    where: { id: 'prayer-002' },
    update: {},
    create: {
      id: 'prayer-002',
      userId: member2.id,
      title: 'Job loss — provision needed',
      content:
        'I was laid off three weeks ago and have a family of four to support. I am trusting God but it is hard some days. Please pray for provision, for open doors, and for me not to lose heart. I know Philippians 4:19 is true but I need brothers and sisters to stand with me.',
      category: 'PROVISION',
      anonymous: false,
      answered: false,
    },
  });

  await prisma.prayerRequest.upsert({
    where: { id: 'prayer-003' },
    update: {},
    create: {
      id: 'prayer-003',
      userId: member1.id,
      title: 'Salvation for my brother',
      content:
        'I have been praying for my brother Mark for 12 years. He walked away from faith in college and has become increasingly hostile to the gospel. Please join me in praying for the Holy Spirit to break through and for him to encounter the living God. Nothing is impossible with God.',
      category: 'SALVATION',
      anonymous: false,
      answered: false,
    },
  });

  await prisma.prayerRequest.upsert({
    where: { id: 'prayer-004' },
    update: {},
    create: {
      id: 'prayer-004',
      userId: member2.id,
      title: 'Grief after losing my father',
      content:
        'My father passed away last month after a long illness. He knew Jesus and I know I will see him again, but the grief is still so real. Please pray for comfort, for my mom who is now alone, and for our family to draw closer together and to God in this season.',
      category: 'GRIEF',
      anonymous: false,
      answered: false,
    },
  });

  await prisma.prayerRequest.upsert({
    where: { id: 'prayer-005' },
    update: {},
    create: {
      id: 'prayer-005',
      userId: pastor.id,
      title: 'Praise — our daughter got baptized!',
      content:
        'This is a praise report! After years of watching and praying, our daughter Emma made a public profession of faith and was baptized on Sunday. To God be the glory! Thank you to everyone who prayed with us over the years. He is faithful.',
      category: 'PRAISE',
      anonymous: false,
      answered: true,
      answeredAt: new Date('2025-03-16'),
      testimony:
        'Emma was baptized on March 16, 2025 — a day our family will never forget. God is so good.',
    },
  });

  console.log(`✅ 5 prayer requests created`);

  // --- Announcements ---
  await prisma.announcement.upsert({
    where: { id: 'ann-001' },
    update: {},
    create: {
      id: 'ann-001',
      title: 'Welcome to the Jesus Is Better Community!',
      content:
        'We are thrilled to launch this online community for believers around the world who want to go deeper with Christ. Here you can engage with sermons, share prayer requests, and connect with fellow followers of Jesus. Our prayer is that this platform would deepen your walk with Christ and your bonds with one another. Welcome home.',

      authorId: pastor.id,
      pinned: true,
      publishedAt: new Date('2025-04-01'),
    },
  });

  await prisma.announcement.upsert({
    where: { id: 'ann-002' },
    update: {},
    create: {
      id: 'ann-002',
      title: 'Summer Sermon Series: "Psalms — Songs of the Soul"',
      content:
        'This summer Pastor Rob will be preaching through a selection of Psalms — the ancient songbook that gives voice to every human emotion before God. Psalms of praise, lament, trust, and celebration. Join us in person or online beginning June 1st. New sermons will be posted here every week.',
      authorId: pastor.id,
      pinned: false,
      publishedAt: new Date('2025-04-20'),
    },
  });

  console.log(`✅ 2 announcements created`);
  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
