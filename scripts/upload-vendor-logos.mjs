// One-off script: upload vendor logos to Cloudinary and print their secure URLs.
// Run: node scripts/upload-vendor-logos.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { v2 as cloudinary } from 'cloudinary';

// Load env from .env (simple parser; avoids adding a dependency)
const envRaw = readFileSync(new URL('../.env', import.meta.url), 'utf8');
const env = Object.fromEntries(
  envRaw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const CONTENT_DIR = '/Users/i590232/Desktop/GDDS/Pragna Content';

// vendor publicId -> { name, file }
const vendors = [
  { publicId: 'bel', name: 'Bharat Electronics Limited', file: 'BEL LOGO.png' },
  { publicId: 'vit-ap', name: 'VIT-AP University', file: 'VIT-AP_University_seal.png' },
  { publicId: 'srm-ap', name: 'SRM University, AP', file: 'srmap logo.png' },
  { publicId: 'nid-ap', name: 'NID, AP', file: 'NID AP.png' },
  { publicId: 'ultratech', name: 'UltraTech', file: 'ULTRA LOGO.png' },
  { publicId: 'blue-star', name: 'Blue Star', file: 'Blue start.jpg.jpeg' },
  { publicId: 'zomato', name: 'Zomato', file: 'ZOMATO LOGO.png' },
  { publicId: 'sentini', name: 'Sentini Group', file: 'SENTINI LOGO.jpg.jpeg' },
  { publicId: 'meil', name: 'MEIL', file: 'MEIL LOGO.jpg.jpeg' },
  { publicId: 'act-fibernet', name: 'ACT Fibernet', file: 'ACT LOGO.png' },
];

async function main() {
  const results = [];
  for (const v of vendors) {
    try {
      const res = await cloudinary.uploader.upload(join(CONTENT_DIR, v.file), {
        folder: 'pragna-techsols/vendors',
        public_id: v.publicId,
        resource_type: 'image',
        overwrite: true,
      });
      results.push({ name: v.name, url: res.secure_url });
      console.log(`✓ ${v.name}: ${res.secure_url}`);
    } catch (err) {
      console.error(`✗ ${v.name} (${v.file}):`, err.message);
    }
  }

  console.log('\n--- Copy into src/app/page.tsx vendors array ---\n');
  console.log(
    JSON.stringify(
      results.map((r) => ({ name: r.name, logo: r.url })),
      null,
      2
    )
  );
}

main();
