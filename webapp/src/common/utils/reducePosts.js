import _ from 'lodash';

export default function reducePosts(posts) {
  return _.reduceRight(posts, (feed, { feelingId, userId }, idx) => {
    const prev = feed[feed.length - 1];
    if (prev && prev.feelingId === feelingId && prev.userId === userId) {
      feed[feed.length - 1].count += 1;
      feed[feed.length - 1].firstIndex = idx;
      return feed;
    }
    return _.concat(feed, {
      feelingId,
      userId,
      firstIndex: idx,
      count: 1,
    });
  }, []);
}
