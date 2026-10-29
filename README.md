# SAJAN JADON Collaboration Studio — B (free-first setup)

This is a premium-looking static portfolio starter with an owner login, media gallery, Appwrite storage/database integration, YouTube embeds, and collaboration enquiries. It is **not live yet**. Replace the placeholder configuration and test before publishing.

## What is free / important limits
- Appwrite Cloud Free includes limited storage and bandwidth; currently the plan lists 2 GB storage and 5 GB bandwidth. Limits and terms can change.
- For longer videos, prefer YouTube embeds so the actual video file is not stored in your website bucket.
- This cannot promise unlimited storage, unlimited views, or zero cost forever. Stay inside free quotas and do not upgrade to a paid plan if your requirement is ₹0.
- Use small, compressed images and short videos. Keep a separate backup of original media.
- This folder uses the Appwrite Web SDK from a CDN. It does not contain or need an Appwrite server API key.

## 1. Create Appwrite project
1. Sign in at https://cloud.appwrite.io and create a project.
2. Add a Web platform. Add your eventual deployed domain as a hostname. While testing locally, add `localhost` if the platform allows it.
3. Copy the project endpoint and project ID into `config.js`.
4. In Authentication, enable Email/Password. Create your owner account in Appwrite Console.
5. Copy the owner account's user ID from Appwrite Console into `ownerUserId` in `config.js`.

## 2. Create database and collections
Create one database, then two collections:
- `work` collection (copy its ID into `collectionId`) with string attributes:
  - `title` (required, 140)
  - `type` (required, 20)
  - `description` (optional, 500)
  - `fileId` (optional, 100)
  - `youtubeUrl` (optional, 500)
- `enquiries` collection (copy its ID into `enquiriesCollectionId`) with string attributes:
  - `name` (required, 100)
  - `contact` (required, 160)
  - `type` (required, 100)
  - `message` (required, 3000)

Create a Storage bucket for media and copy its ID into `bucketId`.

## 3. Permissions — do not skip
In the `work` collection, enable **document-level security**. Collection-level permissions should allow public `read` only; do not allow public create/update/delete. Owner writes are granted per document by `studio.js` using the authenticated owner's user ID. In the `enquiries` collection, enable document-level security and allow public `create` only at collection level. Do not give public read/update/delete. Enquiry documents are created without public read permissions, so only a trusted server-side/admin workflow can read them by default. To display enquiries in this static dashboard, grant read permissions to the owner on each enquiry using a server-side Function or a secure automation; do not expose all enquiries publicly. The dashboard's enquiry list will otherwise show a permission warning until this is implemented.
For the media bucket, enable file-level security and allow public `read` at bucket level only; don't allow public create/update/delete. Uploaded files receive owner update/delete permissions in the browser. Appwrite permissions are the actual security boundary; hiding the dashboard link is not security.

**Important correction for public enquiries:** Because public users cannot securely be given owner permissions from browser code, the static starter form may be blocked by Appwrite permission rules depending on your configuration. For production, use an Appwrite Function as a server-side endpoint to validate and create enquiries, then let the owner read them. Do not make enquiries publicly readable just to make the dashboard work.

## 4. Configure `config.js`
Replace all placeholders:
```js
window.SAJAN_CONFIG = {
  endpoint: "https://YOUR-REGION.cloud.appwrite.io/v1",
  projectId: "YOUR_PROJECT_ID",
  databaseId: "YOUR_DATABASE_ID",
  collectionId: "YOUR_WORK_COLLECTION_ID",
  enquiriesCollectionId: "YOUR_ENQUIRIES_COLLECTION_ID",
  bucketId: "YOUR_MEDIA_BUCKET_ID",
  ownerUserId: "YOUR_OWNER_USER_ID"
};
```
Never put an Appwrite API key, secret, password, or server token in `config.js` or any browser file.

## 5. Publish
Upload the files to a new GitHub repository and enable GitHub Pages (Settings → Pages → Deploy from branch → `main` → `/ (root)`). Add your GitHub Pages domain in Appwrite Web platform allowed hosts. Update `robots.txt` and `sitemap.xml` with the real site URL. For a custom domain, update the DNS and Appwrite allowed host too.

## 6. Termux quick start
Download and extract the ZIP first, then:
```bash
pkg update
pkg install git unzip -y
mkdir -p ~/sajan-jadon-collab-studio
unzip -o ~/storage/downloads/sajan-jadon-collab-studio-b.zip -d ~/sajan-jadon-collab-studio
cd ~/sajan-jadon-collab-studio/sajan-jadon-collab-studio-b
```
Create an empty GitHub repository, then use the repository URL:
```bash
git init
git add .
git commit -m "Create SAJAN JADON Collaboration Studio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sajan-jadon-collab-studio.git
git push -u origin main
```
If Git asks for a password, use GitHub's supported sign-in/token flow; do not paste tokens into chats.

## Notes
- Sample design graphics are generated CSS placeholders, not Sajan's real photos.
- This project has not been deployed or independently production-tested.
- Test upload, login, mobile layout, permissions, and enquiry submission before sharing publicly.
