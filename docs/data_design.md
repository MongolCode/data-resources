
# Data Structure 
All data are located in a single JSON file: `data/db.json`

## Overview

The app should facilitate learning Mongolian script (ᠠ ᠡ ᠢ ᠤ ᠥ ᠦ) with 8 primary lessons covering vowels and consonants, vocabulary items with images and audio pronunciation, and supplementary poem content. The entire database is served by **json-server** and can be accessed via REST API at `http://localhost:3000`.

---

## 1. Course Index Data

**Source:** `data/db.json` → `courses` array

This is the entry point containing all available lessons, accessible via `GET http://localhost:3000/courses`

### Structure
```json
{
  "id": "a",                          // Unique course identifier
  "mongolian": "ᠠ",                  // Mongolian character in vertical script
  "english": "a",                     // English letter equivalent
  "image_uri": "",                    // Placeholder (currently unused)
  "mongolian_pronounce": ""           // Placeholder (currently unused)
}
```

### Available Courses (8 total)
| # | ID | Mongolian | English | Vocabulary Items | API Endpoint |
|---|-----|-----------|---------|------------------|--------------|
| 1 | a | ᠠ | A | 7 items | `GET /course_a` |
| 2 | e | ᠡ | E | 6 items | `GET /course_e` |
| 3 | i | ᠢ | I | 5 items | `GET /course_i` |
| 4 | o | ᠤ | O | 5 items | `GET /course_o` |
| 5 | u | ᠤ | U | 5 items | `GET /course_u` |
| 6 | v | ᠥ | V | 5 items | `GET /course_v` |
| 7 | w | ᠦ | W | 5 items | `GET /course_w` |
| 8 | shulug | ᠰᠢᠯᠦᠭ | Poem | 2 poems | `GET /course_shulug` |

---

## 2. Vocabulary/Lesson Data

**Source:** `data/db.json` → `course_a`, `course_e`, `course_i`, `course_o`, `course_u`, `course_v`, `course_w` arrays

Each course is a top-level array in the JSON database containing vocabulary items learners will master. Access via `GET http://localhost:3000/course_a` (replace 'a' with the course ID).

### Structure
```json
{
  "mongolian": "ᠠᠯᠮᠤᠷᠠᠳ",                          // Mongolian word in vertical script
  "english": "Apple",                              // English translation
  "chinese": "苹果",                                // Chinese translation (optional, may be empty)
  "image_uri": "http://localhost:3000/images/apple.svg",    // Image URL (served locally or external)
  "mongolian_pronounce": "audios/a_apple1.mp3"    // Audio file path for pronunciation (relative to data/)
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mongolian` | string | ✓ | Mongolian word in vertical script |
| `english` | string | ✓ | English translation |
| `chinese` | string | ✗ | Chinese translation (optional, may be empty string) |
| `image_uri` | string | ✓ | Image URL for visual reference (served from `/images` or external) |
| `mongolian_pronounce` | string | ✓ | Relative path to MP3 pronunciation audio (relative to `data/`) |

### Example: course_a.json Content (7 items)
- ᠠᠯᠮᠤᠷᠠᠳ - Apple (苹果)
- ᠠᠯᠲᠠ - Gold (金)
- ᠠᠮᠠ - Mouth
- ᠠᠯᠴᠢᠭᠤᠷ - Towel
- ᠠᠷᠰᠯᠠᠨ - Lion
- ᠠᠶᠠᠭ᠎ᠠ - Bowl (碗)
- ᠠᠨᠠᠱᠢ - Giraffe

### Similar Courses
- `course_e.json` (6 items)
- `course_i.json` (5 items)
- `course_o.json` (5 items)
- `course_u.json` (5 items)
- `course_v.json` (5 items)
- `course_w.json` (5 items)

---

## 3. Poem Content (Supplementary Material)

**Source:** `data/db.json` → `course_shulug` array

Poems provide cultural enrichment and reading practice. Access via `GET http://localhost:3000/course_shulug`. Each poem has a unique structure with a title, multiple verses/lines, and audio.

### Structure
```json
{
  "title": "ᠪᠢ ᠮᠣᠩᠭᠣᠯ ᠬᠥᠮᠦᠨ",                       // Poem title in Mongolian
  "lines": [                                          // Array of poem verses/lines
    "ᠠᠷᠭᠠᠯ ‍ᠤᠨ ᠤᠲᠤᠭ᠎ᠠ ᠪᠤᠷᠭᠢᠯᠤᠭᠰᠠᠨ",
    "ᠮᠠᠯᠴᠢᠨ ‍ᠤ ᠭᠡᠷ ᠲᠦ᠍ ᠲᠥᠷᠥᠭᠰᠡᠨ ᠪᠢ",
    "ᠠᠲᠠᠷ ᠬᠡᠭᠡᠷ᠎ᠡ ᠨᠤᠲᠤᠭ ‍ᠢᠶ᠋ᠠᠨ",
    "ᠥᠯᠥᠭᠡᠢ ᠮᠢᠨᠢ ᠬᠢᠵᠦ ᠪᠤᠳᠤᠳᠠᠭ ᠃"
  ],
  "image_uri": "",                                    // Placeholder (currently unused)
  "mongolian_pronounce": "audios/p_bi mongol huun.mp3"  // Audio pronunciation of poem (relative to data/)
}
```

### Available Poems (2 total)

| # | Title | Lines | Audio File |
|---|-------|-------|-----------|
| 1 | ᠪᠢ ᠮᠣᠩᠭᠣᠯ ᠬᠥᠮᠦᠨ | 4 | `p_bi mongol huun.mp3` |
| 2 | ᠰᠠᠢᠬᠠᠨ ᠳ᠋ᠠ | 8 | `p_saihn da.mp3` |

### Field Details
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Poem title in Mongolian |
| `lines` | array | Array of poem verses/lines |
| `image_uri` | string | Placeholder (not used) |
| `mongolian_pronounce` | string | Path to MP3 audio file of poem recitation |

---

## Application Requirements

### Core Features
1. **Course Navigation** - Display all 8 courses with letter navigation
2. **Vocabulary Learning** - Present vocabulary items with:
   - Mongolian script and English/Chinese translations
   - Visual aids (images)
   - Audio pronunciation playback
3. **Poem Recitation** - Display poems with audio playback
4. **Progress Tracking** - Track user progress through lessons (optional but recommended)

### Technical Implementation
- Build using **Angular V20+** with TypeScript
- Serve data via **json-server** started with `npm run server` (runs on port 3000 by default)
- Fetch data from REST API endpoints (e.g., `http://localhost:3000/courses`, `http://localhost:3000/course_a`)
- Implement routing for each course (e.g., `/course/a`, `/course/e`, etc.)
- Audio files are served statically from `data/audios/` directory
- Images can be served from `data/images/` or external URLs
- Ensure responsive design for mobile and desktop
- Audio playback using HTML5 `<audio>` element or Angular audio library
- Lazy-load images from URLs

### User Experience
- Clean, intuitive navigation between courses
- Responsive text layout for Mongolian vertical script
- Playable audio for each vocabulary item and poem
- Visual feedback for selected items or completed lessons

---

## 4. Running the Server

Start the json-server using npm:

```bash
npm run server
```

This command:
- Starts a json-server instance on `http://localhost:3000`
- Watches `data/db.json` for changes and automatically reloads
- Serves static files from the `data/` directory (for audio and images)
- Provides full REST API for all data endpoints

### Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | Get all courses |
| GET | `/course_a` | Get vocabulary for course A |
| GET | `/course_e` | Get vocabulary for course E |
| GET | `/course_i` | Get vocabulary for course I |
| GET | `/course_o` | Get vocabulary for course O |
| GET | `/course_u` | Get vocabulary for course U |
| GET | `/course_v` | Get vocabulary for course V |
| GET | `/course_w` | Get vocabulary for course W |
| GET | `/course_shulug` | Get poems |

Example requests:
```javascript
// Fetch all courses
fetch('http://localhost:3000/courses')

// Fetch course A vocabulary
fetch('http://localhost:3000/course_a')

// Fetch single item (if items have IDs)
fetch('http://localhost:3000/course_a/0')
```

## 5. Audio & Image Assets

### Audio Files
**Location:** `data/audios/`

All audio files are in MP3 format with a consistent naming convention: `<letter_prefix>_<content>.mp3`

**Audio File Inventory (43 total):**
- **Letter A (7):** a_apple1.mp3, a_bowl.mp3, a_giraffe.mp3, a_gold.mp3, a_lion.mp3, a_mouth.mp3, a_towel.mp3
- **Letter E (6):** e_butterfly.mp3, e_cloud.mp3, e_donkey.mp3, e_grass.mp3, e_horn.mp3, e_nest.mp3
- **Letter I (5):** i_fly.mp3, i_goat.mp3, i_iron.mp3, i_kangaroo.mp3, i_smile.mp3
- **Letter O (5):** o_boat.mp3, o_night.mp3, o_socks.mp3, o_star.mp3, o_universe.mp3
- **Letter U (5):** u_read.mp3, u_red.mp3, u_sleep.mp3, u_string.mp3, u_water.mp3
- **Letter V (5):** v_egg.mp3, v_feather.mp3, v_hungry.mp3, v_pants.mp3, v_raisin.mp3
- **Letter W (5):** w_cow.mp3, w_fox.mp3, w_hair.mp3, w_root.mp3, w_seeds.mp3
- **Poems (2):** p_bi mongol huun.mp3, p_saihn da.mp3

### Image Files
**Location:** `data/images/`

Referenced in vocabulary items and served via json-server at `http://localhost:3000/images/<filename>`

Example: `apple.svg`, `gold.svg`, `mouth.svg`, etc. (41 total vocabulary images)
