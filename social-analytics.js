(() => {
  "use strict";

  const CONFIG = window.SAJAN_CONFIG || {};
  const KEY = "sajanJadonSocialControlV1";
  const $ = (id) => document.getElementById(id);

  const defaults = {
    instagramUsername: "",
    instagramUrl: "",
    youtubeUrl: "",
    otherUrl: "",
    followers: 0,
    views: 0,
    posts: 0,
    label: "मैन्युअल रूप से अपडेट किए गए आँकड़े",
    note: "आँकड़ों की आखिरी अपडेट तारीख नीचे दिखाई जाएगी।",
    updatedAt: ""
  };

  function validUrl(value) {
    if (!value) return "";
    try {
      const u = new URL(value);
      return u.protocol === "https:" ? u.href : "";
    } catch {
      return "";
    }
  }

  function clean(input) {
    return {
      instagramUsername: String(input.instagramUsername || "").replace(/^@/, "").trim(),
      instagramUrl: validUrl(input.instagramUrl),
      youtubeUrl: validUrl(input.youtubeUrl),
      otherUrl: validUrl(input.otherUrl),
      followers: Math.max(0, Number(input.followers) || 0),
      views: Math.max(0, Number(input.views) || 0),
      posts: Math.max(0, Number(input.posts) || 0),
      label: String(input.label || defaults.label).slice(0, 100),
      note: String(input.note || "").slice(0, 300),
      updatedAt: input.updatedAt || new Date().toISOString()
    };
  }

  function readLocal() {
    try {
      return clean(JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch {
      return { ...defaults };
    }
  }

  function writeLocal(data) {
    localStorage.setItem(KEY, JSON.stringify(clean(data)));
  }

  async function databaseRead() {
    const sdk = window.Appwrite;
    if (!sdk || !CONFIG.endpoint || !CONFIG.projectId ||
        !CONFIG.databaseId || !CONFIG.socialCollectionId) return null;

    try {
      const client = new sdk.Client()
        .setEndpoint(CONFIG.endpoint)
        .setProject(CONFIG.projectId);
      const db = new sdk.Databases(client);
      const result = await db.listDocuments(
        CONFIG.databaseId,
        CONFIG.socialCollectionId
      );
      const doc = result.documents.find(d => d.$id === "social-stats");
      return doc ? clean(doc) : null;
    } catch (error) {
      console.warn("Shared social data unavailable:", error.message);
      return null;
    }
  }

  async function databaseWrite(data) {
    const sdk = window.Appwrite;
    if (!sdk || !CONFIG.endpoint || !CONFIG.projectId ||
        !CONFIG.databaseId || !CONFIG.socialCollectionId) {
      throw new Error("Appwrite में Social Collection ID configure नहीं है।");
    }

    const client = new sdk.Client()
      .setEndpoint(CONFIG.endpoint)
      .setProject(CONFIG.projectId);
    const db = new sdk.Databases(client);
    const payload = clean(data);
    const { updatedAt, ...attributes } = payload;

    try {
      await db.updateDocument(
        CONFIG.databaseId,
        CONFIG.socialCollectionId,
        "social-stats",
        { ...attributes, updatedAt }
      );
    } catch (error) {
      if (error.code !== 404) throw error;
      await db.createDocument(
        CONFIG.databaseId,
        CONFIG.socialCollectionId,
        "social-stats",
        { ...attributes, updatedAt },
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.update(sdk.Role.user(CONFIG.ownerUserId))
        ]
      );
    }
    writeLocal(payload);
    return payload;
  }

  async function getData() {
    return (await databaseRead()) || readLocal();
  }

  function fmt(n) {
    return new Intl.NumberFormat("en-IN").format(Number(n) || 0);
  }

  async function renderPublic() {
    const data = await getData();
    document.querySelectorAll("[data-social-stat]").forEach(el => {
      const key = el.dataset.socialStat;
      if (["followers", "views", "posts"].includes(key)) {
        el.textContent = fmt(data[key]);
      } else if (key === "label") {
        el.textContent = data.label;
      } else if (key === "updated") {
        el.textContent = data.updatedAt
          ? "Updated: " + new Date(data.updatedAt).toLocaleString("en-IN")
          : "अभी तक अपडेट नहीं किया गया";
      } else if (key === "username") {
        el.textContent = data.instagramUsername
          ? "@" + data.instagramUsername : "@yourusername";
      }
    });

    document.querySelectorAll("[data-social-link]").forEach(el => {
      const key = el.dataset.socialLink;
      const url = data[key];
      if (url) {
        el.href = url;
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  window.SajanSocialAnalytics = {
    getData,
    save: databaseWrite,
    renderPublic,
    readLocal,
    writeLocal,
    defaults
  };

  document.addEventListener("DOMContentLoaded", renderPublic);
})();
