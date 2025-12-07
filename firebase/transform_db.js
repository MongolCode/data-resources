const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../data/db.json');
const outputFile = path.join(__dirname, '../data/db.transformed.json');

const rawData = fs.readFileSync(inputFile);
const db = JSON.parse(rawData);

const newDb = {
  courses: {}
};

// Helper to sanitize keys (e.g., "Bi Mongol Huun" -> "bi_mongol_huun")
const sanitizeKey = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
};

if (db.courses && Array.isArray(db.courses)) {
  db.courses.forEach(course => {
    const courseId = course.id;
    
    // Create the course node
    newDb.courses[courseId] = {
      ...course
    };

    // Look for the content in the original db (e.g., course_a, course_shulug)
    const contentKey = `course_${courseId}`;
    const content = db[contentKey];

    if (content && Array.isArray(content)) {
      if (courseId === 'shulug') {
        newDb.courses[courseId].poems = {};
        content.forEach(item => {
          let key = '';
          if (item.mongolian_pronounce) {
             const parts = item.mongolian_pronounce.split('/');
             const filename = parts[parts.length - 1]; // "p_bi mongol huun.mp3"
             key = sanitizeKey(filename.replace('.mp3', '').replace(/^p_/, ''));
          } else {
             key = `poem_${sanitizeKey(item.title.substring(0, 10))}`; // Fallback
          }
          
          newDb.courses[courseId].poems[key] = item;
        });
      } else {
        newDb.courses[courseId].words = {};
        content.forEach(item => {
          const key = sanitizeKey(item.english);
          newDb.courses[courseId].words[key] = item;
        });
      }
    }
  });
}

fs.writeFileSync(outputFile, JSON.stringify(newDb, null, 2));
console.log(`Successfully transformed data to ${outputFile}`);
