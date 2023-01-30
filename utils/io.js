import sharp from 'sharp';
import lod from 'lodash';
import KMeans from './kmeans.js';
// import fs from 'fs';

const fetchImage = async url => {
  const fimg = await fetch(url);
  return Buffer.from(await fimg.arrayBuffer());
};

export const processFromUrl = async (url, clusters) => {
  const imageBuffer = await fetchImage(url);
  const {data, info: {width, height, channels}} = await sharp(imageBuffer).raw().toBuffer({resolveWithObject: true});
  if (width * height > 3_500_000) throw new Error('Too big image');
  const points = lod.chunk([...data], channels);
  const [centers, labels] = KMeans(points, clusters);
  const processed = Array.from({length: points.length}, (_, i) => centers[labels[i]]).flat();
  return await sharp(Uint8Array.from(processed), {raw: {width, height, channels}}).png().toBuffer();
}

// const main = async () => {
  // fs.writeFile('random.png', await processFromUrl(), 'binary', err => console.log(err));
// }
// main();

