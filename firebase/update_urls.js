const fs = require('fs');
const path = require('path');

const bucketUrl = process.argv[2];
if (!bucketUrl) {
  console.error('Error: Firebase Storage bucket URL not provided.');
  console.error('Usage: node firebase/update_urls.js <your-bucket-url.appspot.com>');
  process.exit(1);
}

const dbPath = path.join(__dirname, '..', 'data', 'db.transformed.json');
const dbFirebasePath = path.join(__dirname, '..', 'data', 'db.firebase.json');

let db;
try {
  const dbRaw = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(dbRaw);
} catch (error) {
  console.error(`Error reading or parsing ${dbPath}:`, error);
  console.error('Make sure you have run "node firebase/transform_db.js" first.');
  process.exit(1);
}

const buildFirebaseUrl = (filePath) => {
  // The path in storage will be something like 'images/apple.svg'
  // We need to encode the ENTIRE path, including slashes, for the Firebase Storage URL.
  // e.g. 'images/apple.svg' -> 'images%2Fapple.svg'
  const encodedPath = encodeURIComponent(filePath);
  return `https://firebasestorage.googleapis.com/v0/b/${bucketUrl}/o/${encodedPath}?alt=media`;
};

// Traverse the nested structure
if (db.courses) {
  Object.values(db.courses).forEach(course => {
    // Process words if they exist
    if (course.words) {
      Object.values(course.words).forEach(item => {
        updateItemUrls(item);
      });
    }
    
    // Process poems if they exist
    if (course.poems) {
       Object.values(course.poems).forEach(item => {
        updateItemUrls(item);
      });
    }
  });
}

function updateItemUrls(item) {
  // Handle image URIs
  if (item.image_uri) {
    // Extract the filename, e.g., 'apple.svg' from 'http://localhost:3000/images/apple.svg'
    // Or it might already be empty or a relative path? The transform script preserves original values.
    // Original values were: "http://localhost:3000/images/apple.svg"
    if (item.image_uri.includes('/images/')) {
        const imageName = item.image_uri.split('/').pop();
        if (imageName) {
            item.image_uri = buildFirebaseUrl(`images/${imageName}`);
        }
    }
  }

  // Handle audio pronunciations
  if (item.mongolian_pronounce) {
    const audioPath = item.mongolian_pronounce;
    // Original values were like: "audios/a_apple1.mp3"
    if (audioPath && !audioPath.startsWith('http')) {
        // The path is already in the correct format, e.g., 'audios/a_apple1.mp3'
        item.mongolian_pronounce = buildFirebaseUrl(audioPath);
    }
  }
}

try {
  fs.writeFileSync(dbFirebasePath, JSON.stringify(db, null, 2));
  console.log(`\nSuccessfully created ${dbFirebasePath}`);
  console.log('You can now import this file into your Firebase Realtime Database.');
} catch (error) {
  console.error(`Error writing ${dbFirebasePath}:`, error);
  process.exit(1);
}
