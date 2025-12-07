# Migrating Your Data to Firebase

This guide will walk you through migrating your `db.json` data and static assets (`images`, `audios`) to Firebase.

## Step 1: Create a Firebase Project

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Click **"Add project"** and follow the on-screen instructions to create a new project.

## Step 2: Set Up Firebase Services

In your new Firebase project console, you need to enable the Realtime Database and Storage.

### Enable Realtime Database

1.  In the left-hand menu, go to **Build > Realtime Database**.
2.  Click **"Create Database"**.
3.  Choose a location for your database.
4.  Select **"Start in test mode"** for the security rules. This will allow you to read and write to the database during development. You can secure it later.
5.  Click **"Enable"**.

### Enable Storage

1.  In the left-hand menu, go to **Build > Storage**.
2.  Click **"Get started"**.
3.  Follow the on-screen instructions to set up your storage bucket. The default settings are fine.

## Step 3: Transform Data Structure

To ensure your data is optimized for Firebase Realtime Database (using a nested tree structure instead of flat arrays), we need to transform your local JSON file.

### Rationale
*   **Efficiency:** A nested structure (e.g., `courses/a/words`) allows fetching a specific course without downloading the entire database.
*   **Scalability:** Using unique keys (IDs) instead of array indices prevents data conflicts and allows for direct access to specific items.
*   **Security:** This granular structure enables precise security rules (e.g., validating that every word has an English translation).

1.  **Run the transformation script:**
    ```bash
    node ./firebase/transform_db.js
    ```
    This will create a new file at `data/db.transformed.json` with a structure like `courses/{courseId}/words/{wordId}`.

## Step 4: Upload Images and Audio to Storage

1.  Go to **Storage** in the Firebase console.
2.  You can recreate the directory structure (`images` and `audios`) here if you want, but it's not necessary for the script to work.
3.  Click **"Upload folder"** and select your local `data/images` directory.
4.  Repeat the process and upload the `data/audios` directory.
5.  After uploading, all your files will be in Firebase Storage. Note your **Storage bucket URL**. It looks like `gs://<your-project-id>.appspot.com`.

## Step 5: Update Asset URLs in the Database

The paths to your images and audio in the database are still local (e.g., `audios/a_apple1.mp3`). We need to replace them with their new public URLs in Firebase Storage.

1.  **Find your Storage Bucket URL:** In the Firebase Storage browser, you'll see your bucket URL at the top of the file view (e.g., `gs://my-project.appspot.com`). You only need the hostname part (`my-project.appspot.com`).

2.  **Run the update script:** Execute the following command in your terminal. Note that we are now updating the **transformed** file.

    ```bash
    node ./firebase/update_urls.js <your-bucket-hostname>
    ```
    *Note: The `update_urls.js` script has been updated to correctly encode the Firebase Storage paths (e.g., `images/file.svg` becomes `images%2Ffile.svg`), and it now reads from `data/db.transformed.json` and outputs to `data/db.firebase.json`.*

3.  This script saves a new file at `data/db.firebase.json`.

## Step 6: Import the Updated JSON to Firebase

1.  Go back to your **Realtime Database** in the Firebase console.
2.  **Delete the existing data** by clicking on the root of your database, then clicking the red 'X' to remove it (if any).
3.  Click the three-dots menu again and select **"Import JSON"**.
4.  Browse and select the newly created `data/db.firebase.json` file.
5.  Click **"Import"**.

## Step 7: Secure Your Database

We have created a `database.rules.json` file that provides granular security, allowing public read access to courses but restricting write access.

1.  **Go to the Rules tab** in the Realtime Database section of the Firebase Console.
2.  **Copy the content** of `database.rules.json`.
3.  **Paste it** into the rules editor in the console.
4.  Click **"Publish"**.

## Step 8: Connect Your Application

In your Angular application, you will now use the Firebase SDK to connect to the Realtime Database instead of making HTTP requests to `localhost:3000`.

You will need to install the Firebase SDK:

```bash
npm install firebase
```

And configure it with your project's credentials. You can find these in your Firebase project settings by clicking the gear icon > Project settings, and looking under the "Your apps" card for a web app.
