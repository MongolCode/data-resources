# Integrating Firebase with Your Angular Application

This guide explains the changes needed in your Angular application to fetch data from Firebase Realtime Database instead of your local `json-server`.

### High-Level Summary

1.  **Add Firebase to Your App**: You'll need to install the official Firebase and AngularFire libraries and configure your app with your Firebase project's credentials.
2.  **Refactor Your Data Service**: Instead of making HTTP requests to `http://localhost:3000`, you will use the `AngularFireDatabase` service to fetch data directly from the Realtime Database.
3.  **No Changes to Templates**: Your templates that display the images and play the audio should work as-is, because the database now contains the full public URLs to the files in Firebase Storage.

---

### Step-by-Step Guide

Here are the detailed steps to connect your Angular app to Firebase.

#### 1. Install Firebase and AngularFire

The easiest way to add Firebase to an Angular project is by using the `@angular/fire` schematic. In your Angular project's root directory, run:

```bash
ng add @angular/fire
```

This command will:
*   Install the necessary packages (`firebase` and `@angular/fire`).
*   Ask you which Firebase features you want to set up (select **Realtime Database**).
*   Prompt you to log in to your Google account.
*   Ask you to choose a Firebase project.
*   Update your `app.module.ts` and `environment.ts` files automatically.

#### 2. Verify Your Configuration

After running `ng add @angular/fire`, your `src/environments/environment.ts` should contain a `firebase` config object.

Your `src/app/app.module.ts` will also be updated to import and initialize Firebase. It will look something like this:

```typescript
// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// Firebase Imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // Connects to your Firebase project
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // Connects to the Realtime Database
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### 3. Refactor Your Data Service

This is the core change. You'll need to rewrite the service that was previously using `HttpClient`.

Let's say you have a service named `course.service.ts`.

**Before (using `HttpClient`):**

```typescript
// OLD service using HttpClient
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCourses() {
    return this.http.get<any[]>(`${this.API_URL}/courses`);
  }

  getCourseData(courseId: string) {
    return this.http.get<any[]>(`${this.API_URL}/course_${courseId}`);
  }
}
```

// After (using Firebase Realtime Database):

You'll inject `Database` from `@angular/fire/database` and use it to get your data as observables.

```typescript
// NEW service using AngularFire
import { Injectable, inject } from '@angular/core';
import { Database, listVal, objectVal } from '@angular/fire/database';
import { ref } from 'firebase/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private db: Database = inject(Database);

  getCourses(): Observable<any[]> {
    const coursesRef = ref(this.db, 'courses');
    // listVal returns an observable of the array of course objects (children of 'courses')
    return listVal(coursesRef);
  }

  getCourseWords(courseId: string): Observable<any[]> { // Renamed for clarity
    const courseWordsRef = ref(this.db, `courses/${courseId}/words`);
    return listVal(courseWordsRef); // Returns an array of word objects under the specified course
  }
  
  getPoems(): Observable<any[]> {
    const poemsRef = ref(this.db, 'courses/shulug/poems');
    return listVal(poemsRef); // Returns an array of poem objects
  }
}
```

By making these changes, your Angular application will be fully connected to your new Firebase backend, and it will fetch data in a reactive, real-time way.
