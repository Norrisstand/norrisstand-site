// Run with: node --test tests/attribution.test.js
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { approvedLabels, carryHref, apply } = require("../attribution.js");

const ROOT = path.join(__dirname, "..");
const AD = "?utm_source=microsoft&utm_medium=cpc&utm_campaign=ns-pilot-v1&utm_term=sync-folder&utm_content=rsa-1&msclkid=abc123XYZ";
const LANDING = "https://norrisstand.com/pricing.html";

function fakeDocument(hrefs) {
  const links = hrefs.map((href) => ({ href, getAttribute() { return this.href; }, setAttribute(_, value) { this.href = value; } }));
  return { links, querySelectorAll: () => links };
}

test("only the six approved, well-formed labels are carried", () => {
  const labels = approvedLabels(AD + "&gclid=zzz&fbclid=yyy&email=a@b.com");
  assert.deepStrictEqual(labels.map((pair) => pair[0]),
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "msclkid"]);
  assert.deepStrictEqual(approvedLabels("?utm_campaign=ok&utm_term=%3Cscript%3E&msclkid=a%20b").map((p) => p[0]), ["utm_campaign"]);
});

test("nothing is carried without a campaign or click identifier", () => {
  assert.deepStrictEqual(approvedLabels("?utm_source=microsoft&utm_medium=cpc"), []);
  assert.deepStrictEqual(approvedLabels(""), []);
});

test("labels go to portal signup and our own landing pages only", () => {
  const labels = approvedLabels(AD);
  const signup = new URL(carryHref("https://portal.norrisstand.com/signup", LANDING, labels));
  assert.strictEqual(signup.searchParams.get("msclkid"), "abc123XYZ");
  assert.strictEqual(signup.searchParams.get("utm_campaign"), "ns-pilot-v1");
  assert.ok(carryHref("drive-folder-sync.html", LANDING, labels).includes("utm_campaign=ns-pilot-v1"));
  for (const other of ["https://portal.norrisstand.com/customers/login", "https://privacy.microsoft.com/privacystatement",
    "https://example.com/signup", "/downloads/", "terms.html", "privacy.html", "mailto:hello@norrisstand.com",
    "http://portal.norrisstand.com/signup"]) {
    assert.strictEqual(carryHref(other, LANDING, labels), other, other);
  }
});

test("existing values on a link are not overwritten", () => {
  const href = carryHref("https://portal.norrisstand.com/signup?utm_campaign=keep", LANDING, approvedLabels(AD));
  assert.strictEqual(new URL(href).searchParams.get("utm_campaign"), "keep");
});

test("every live signup link on each landing page is decorated; nothing changes without ad labels", () => {
  for (const page of ["index.html", "drive-folder-sync.html", "pricing.html", "support.html"]) {
    const html = fs.readFileSync(path.join(ROOT, page), "utf8");
    assert.ok(html.includes('<script src="/attribution.js" defer></script>'), page);
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
    const signups = hrefs.filter((h) => h === "https://portal.norrisstand.com/signup").length;
    assert.ok(signups >= 1, page);
    const doc = fakeDocument(hrefs);
    apply(doc, new URL("https://norrisstand.com/" + page + AD));
    const decorated = doc.links.filter((l) => l.href.startsWith("https://portal.norrisstand.com/signup?")).length;
    assert.strictEqual(decorated, signups, page);
    const untouched = fakeDocument(hrefs);
    assert.strictEqual(apply(untouched, new URL("https://norrisstand.com/" + page)), 0, page);
  }
});

test("the script stores nothing and makes no request", () => {
  const source = fs.readFileSync(path.join(ROOT, "attribution.js"), "utf8").replace(/^\s*\/\/.*$/gm, "");
  for (const forbidden of ["cookie", "localStorage", "sessionStorage", "indexedDB", "fetch(", "XMLHttpRequest", "sendBeacon", "Image("]) {
    assert.ok(!source.includes(forbidden), forbidden);
  }
});
