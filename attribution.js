// First-party campaign-label carry-over. See /privacy.html, "Advertising and campaign measurement".
// When a visitor arrives from one of our ads, this reads only the approved campaign labels from the
// page address and adds them to links to our own landing pages and to customer-portal signup, so the
// labels reach signup. It sets no cookie, uses no browser storage and makes no network request.
(function (root) {
  "use strict";
  var FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "msclkid"];
  var VALUE = /^[A-Za-z0-9._~-]{1,120}$/;
  var CARRY = {
    "norrisstand.com": ["/", "/index.html", "/drive-folder-sync.html", "/pricing.html", "/support.html"],
    "portal.norrisstand.com": ["/signup"]
  };

  function approvedLabels(search) {
    var params = new URLSearchParams(search);
    var labels = [];
    FIELDS.forEach(function (key) {
      var value = params.get(key);
      if (value && VALUE.test(value)) labels.push([key, value]);
    });
    var hasCampaign = labels.some(function (pair) { return pair[0] === "utm_campaign" || pair[0] === "msclkid"; });
    return hasCampaign ? labels : [];
  }

  function carryHref(href, base, labels) {
    var url;
    try { url = new URL(href, base); } catch (error) { return href; }
    var paths = CARRY[url.hostname.replace(/^www\./, "")];
    if (url.protocol !== "https:" || !paths || paths.indexOf(url.pathname) < 0) return href;
    labels.forEach(function (pair) { if (!url.searchParams.has(pair[0])) url.searchParams.set(pair[0], pair[1]); });
    return url.toString();
  }

  function apply(doc, location) {
    var labels = approvedLabels(location.search);
    if (!labels.length) return 0;
    var changed = 0;
    Array.prototype.forEach.call(doc.querySelectorAll("a[href]"), function (link) {
      var before = link.getAttribute("href");
      var after = carryHref(before, location.href, labels);
      if (after !== before) { link.setAttribute("href", after); changed += 1; }
    });
    return changed;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { approvedLabels: approvedLabels, carryHref: carryHref, apply: apply };
  } else if (root && root.document) {
    apply(root.document, root.location);
  }
})(typeof window !== "undefined" ? window : null);
