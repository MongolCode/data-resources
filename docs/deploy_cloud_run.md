# Deploying your FastAPI API to Google Cloud Run

This guide will walk you through deploying your FastAPI application as a public API using Google Cloud Run. This approach allows your Angular app to consume the data by simply updating its base API URL.

## Prerequisites

1.  **Google Cloud Project**: Make sure you have a Google Cloud project set up.
2.  **Google Cloud SDK (gcloud CLI)**: Install and initialize the `gcloud` CLI on your machine.
3.  **Docker**: Ensure Docker is installed and running on your machine.
4.  **Authenticated gcloud**: Run `gcloud auth login` and `gcloud config set project YOUR_PROJECT_ID` (replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID).

## Step 1: Build the Docker Image

Navigate to the project root directory and build your Docker image. Replace `YOUR_PROJECT_ID` with your Google Cloud project ID and `IMAGE_NAME` with a name for your image (e.g., `mongolcode-api`).

```bash
docker build -t gcr.io/YOUR_PROJECT_ID/IMAGE_NAME:latest -f cloud_run/Dockerfile .
```
For example:
```bash
docker build -t gcr.io/my-project-12345/mongolcode-api:latest -f cloud_run/Dockerfile .
```
*Note: The `-f cloud_run/Dockerfile` specifies the Dockerfile's location, and `.` specifies the build context. This allows Docker to copy the `api` and `data` directories into the image.*

## Step 2: Push the Docker Image to Google Container Registry (GCR)

Before you can push the image, you need to configure Docker to authenticate with Google Container Registry:

```bash
gcloud auth configure-docker
```

Then, push your built image to GCR:

```bash
docker push gcr.io/YOUR_PROJECT_ID/IMAGE_NAME:latest
```
For example:
```bash
docker push gcr.io/my-project-12345/mongolcode-api:latest
```

## Step 3: Deploy to Google Cloud Run

Now that your image is in GCR, you can deploy it to Cloud Run.

```bash
gcloud run deploy SERVICE_NAME \
  --image gcr.io/YOUR_PROJECT_ID/IMAGE_NAME:latest \
  --platform managed \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --port 3000
```
Replace:
*   `SERVICE_NAME`: A name for your Cloud Run service (e.g., `mongolcode-api`).
*   `YOUR_PROJECT_ID`: Your Google Cloud project ID.
*   `IMAGE_NAME`: The name you gave your Docker image (e.g., `mongolcode-api`).
*   `YOUR_REGION`: A Google Cloud region (e.g., `us-central1`, `europe-west1`).
*   `--allow-unauthenticated`: This makes your API publicly accessible without authentication.
*   `--port 3000`: Specifies that your container is listening on port 3000.

Example:
```bash
gcloud run deploy mongolcode-api \
  --image gcr.io/my-project-12345/mongolcode-api:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

After deployment, the `gcloud` CLI will output the **Service URL**. This is your new public API endpoint!

## Step 4: Update Your Angular Application

In your Angular application's data service, update the `baseUrl` to this new Cloud Run Service URL. Remember to use the dynamic `course/{course_id}` endpoint.

**Example Change:**

```typescript
// src/app/course.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {
  // Update this URL to your Cloud Run Service URL
  private API_URL = 'https://mongolcode-api-xxxxxxxxxx-uc.a.run.app'; 

  constructor(private http: HttpClient) {}

  getCourses() {
    return this.http.get<any[]>(`${this.API_URL}/courses`);
  }

  getCourseData(courseId: string) {
    // Use the new dynamic endpoint
    return this.http.get<any[]>(`${this.API_URL}/course/${courseId}`);
  }
}
```

Now your Angular application will be consuming data from your production-ready FastAPI service running on Google Cloud Run!
