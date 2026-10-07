(() => {
  const N = window.NOVA, L = N.links;
  const $ = (s, e = document) => e.querySelector(s), $$ = (s, e = document) => [...e.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const fa = (n) => (+n).toLocaleString("fa-IR");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safe = (f) => { try { return f(); } catch (e) { console.error(e); } };

  let tt; window.toast = (m) => { const t = $("#toast"); if (!t) return; t.textContent = m; t.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("on"), 2600); };

  // ---------- icons ----------
  const P = (d) => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IC = {
    cube: P('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>'),
    user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>'),
    banner: P('<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 12h6"/>'),
    logo: P('<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>'),
    poster: P('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
    tg: P('<path d="M21 4L3 11l6 2 2 6 3-4 5 4z"/>'),
    rb: P('<circle cx="12" cy="12" r="9"/><path d="M9 8h4a2.5 2.5 0 010 5H9zM9 13l5 4"/>'),
    x: P('<path d="M4 4l16 16M20 4L4 20"/>'),
    sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>'),
    moon: P('<path d="M20 14A8 8 0 019.5 4 8 8 0 1020 14z"/>'),
    eye: P('<circle cx="12" cy="12" r="3"/><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>'),
    zoom: P('<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8v6M8 11h6"/>'),
    spark: P('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>'),
    shield: P('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
    pen: P('<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>'),
    link: P('<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>'),
  };
  const nav = [["home", "index.html", "خانه"], ["portfolio", "portfolio.html", "نمونه‌کارها"], ["tools", "tools.html", "ابزارها"], ["contact", "contact.html", "سفارش و ارتباط"], ["about", "about.html", "درباره ما"]];
  const brand = `<i class="logo-mark" role="img" aria-label="لوگوی NOVA GRAPHIC"></i><span class="wordmark">NOVA <b>GRAPHIC</b></span>`;
  const navLinks = nav.map(([k, h, t]) => `<a href="${h}" ${k === page ? 'aria-current="page"' : ""}>${t}</a>`).join("");

  // ---------- background layers ----------
  document.body.insertAdjacentHTML("afterbegin", '<div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div><canvas id="bg" aria-hidden="true"></canvas><div class="grain" aria-hidden="true"></div><div id="glow" aria-hidden="true"></div>');

  // ---------- header / footer ----------
  $("#site-header").innerHTML = `<div class="wrap bar">
    <a class="brand" href="index.html" aria-label="NOVA GRAPHIC - خانه">${brand}</a>
    <nav id="nav" aria-label="منوی اصلی">${navLinks}</nav>
    <div class="tools">
      <button class="icon-btn" id="theme" aria-label="تغییر تم"><span class="i-moon">${IC.moon}</span><span class="i-sun">${IC.sun}</span></button>
      <button class="icon-btn menu-btn" id="menu" aria-label="باز کردن منو" aria-expanded="false" aria-controls="mnav"><i></i><i></i><i></i></button>
    </div></div>`;
  document.body.insertAdjacentHTML("beforeend", `<nav id="mnav" aria-label="منوی موبایل">${navLinks}</nav>`);
  $("#site-footer").innerHTML = `<div class="wrap foot">
    <div class="fb"><i class="logo-mark"></i><div><div class="wordmark">NOVA <b>GRAPHIC</b></div><p>Amir Nasiri</p></div></div>
    <nav aria-label="پیوندهای فوتر">${nav.map(([, h, t]) => `<a href="${h}">${t}</a>`).join("")}</nav>
    <div class="soc"><a href="${L.tgChannel}" target="_blank" rel="noopener" aria-label="کانال تلگرام">${IC.tg}</a><a href="${L.rubikaChannel}" target="_blank" rel="noopener" aria-label="کانال روبیکا">${IC.rb}</a><a href="${L.x}" target="_blank" rel="noopener" aria-label="X">${IC.x}</a></div>
    <p class="copy" dir="ltr">© 2026 NOVA GRAPHIC — All Rights Reserved</p></div>`;
  $$("[data-ic]").forEach((e) => (e.innerHTML = IC[e.dataset.ic] || ""));

  // ---------- theme ----------
  const themeMeta = $('meta[name="theme-color"]');
  const applyTheme = (t) => { root.dataset.theme = t; if (themeMeta) themeMeta.content = t === "light" ? "#f4f2ff" : "#07060f"; readColors(); };
  $("#theme").onclick = () => { const t = root.dataset.theme === "light" ? "dark" : "light"; applyTheme(t); try { localStorage.setItem("nova-theme", t); } catch (e) {} };

  // ---------- mobile menu ----------
  const menu = $("#menu"), setMenu = (o) => { document.body.classList.toggle("menu-open", o); menu.setAttribute("aria-expanded", o); menu.setAttribute("aria-label", o ? "بستن منو" : "باز کردن منو"); };
  menu.onclick = () => setMenu(!document.body.classList.contains("menu-open"));
  matchMedia("(min-width:861px)").addEventListener?.("change", (e) => e.matches && setMenu(false));

  // ---------- services ----------
  const sv = $("#services");
  if (sv) sv.innerHTML = N.services.map((s) => `<article class="card svc rv"><span class="ico">${IC[s.icon] || IC.spark}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><a class="buy" href="contact.html?type=${encodeURIComponent(s.title)}#order">سفارش این طرح</a></article>`).join("");

  // ---------- stats ----------
  const st = $("#stats");
  if (st) st.innerHTML = [[N.portfolio.length, "نمونه‌کار منتشرشده"], [N.services.length, "نوع خدمات طراحی"], [4, "قدم تا تحویل نهایی"], [4, "ابزار رایگان طراحی"]]
    .map(([n, t]) => `<div class="card stat rv"><b data-count="${n}">${fa(0)}</b><span>${t}</span></div>`).join("");

  // ---------- portfolio ----------
  const grid = $("#work-grid");
  const media = (w, big) => w.image
    ? `<img src="${w.image}" alt="${esc(w.title || "")} — نمونه‌کار ${esc(w.type)} NOVA GRAPHIC" ${big ? "" : 'loading="lazy"'} decoding="async">`
    : `<div class="ph" role="img" aria-label="جایگاه تصویر"><span>${IC.eye}</span><small>جایگاه تصویر</small></div>`;
  let io, Q = "", F = "all", shown = [], cur = 0;
  const fav = (i) => { try { return JSON.parse(localStorage.getItem("nova-fav") || "[]").includes(+i); } catch (e) { return false; } };

  let lb = null;
  if (grid) {
    document.body.insertAdjacentHTML("beforeend", `<dialog id="lightbox" aria-label="نمایش نمونه‌کار"><button class="lb-close" aria-label="بستن">✕</button><button class="lb-nav lb-prev" aria-label="قبلی">‹</button><button class="lb-nav lb-next" aria-label="بعدی">›</button><div class="lb-media"></div><div class="lb-cap"></div></dialog>`);
    lb = $("#lightbox");
  }
  const openW = (i, push = true) => {
    const w = N.portfolio[i]; if (!w || !lb) return;
    cur = +i;
    $(".lb-media", lb).innerHTML = media(w, true); $(".lb-media", lb).scrollTo?.(0, 0);
    $(".lb-cap", lb).innerHTML = `<h3>${esc(w.title || "")}</h3><span class="lab">${esc(w.type)}</span><button class="btn sm" data-a="cp">کپی لینک</button><button class="btn sm" data-a="sh">اشتراک‌گذاری</button><button class="btn sm" data-a="fv">${fav(i) ? "★ علاقه‌مندی" : "☆ علاقه‌مندی"}</button>`;
    if (!lb.open) lb.showModal();
    if (push) safe(() => history.replaceState(0, "", "#w=" + i));
  };
  const step = (d) => { if (!shown.length) return; const p = shown.indexOf(cur), n = shown[(p + d + shown.length) % shown.length]; openW(n); };

  function renderWork(filter = F) {
    F = filter;
    const lim = +grid.dataset.limit || 999;
    const list = N.portfolio.map((w, i) => ({ ...w, i })).filter((w) => (filter === "all" || w.category === filter) && (!Q || (w.type + " " + (w.title || "")).toLowerCase().includes(Q)));
    shown = list.map((w) => w.i);
    grid.innerHTML = list.slice(0, lim).map((w) => `<button class="card work rv" data-i="${w.i}" aria-label="نمایش ${esc(w.title || w.type)}"><div class="thumb" style="aspect-ratio:${(w.ratio || "16/10").replace("/", " / ")}">${media(w)}</div><div class="meta"><div><span class="lab">${esc(w.type)}</span><h3>${esc(w.title || "")}</h3></div><span class="zoom">${IC.zoom}</span></div></button>`).join("") || `<p class="empty">موردی پیدا نشد. فیلتر یا عبارت جستجو را تغییر دهید.</p>`;
    observe();
  }
  if (grid) {
    renderWork();
    grid.addEventListener("click", (e) => {
      const b = e.target.closest(".work"); if (!b) return;
      if (page === "home") { openW(b.dataset.i); return; }
      openW(b.dataset.i);
    });
    $$(".filters button").forEach((b) => b.addEventListener("click", () => { $$(".filters button").forEach((x) => x.setAttribute("aria-pressed", x === b)); renderWork(b.dataset.f); }));
    $("#q")?.addEventListener("input", (e) => { Q = e.target.value.trim().toLowerCase(); renderWork(); });
  }
  if (lb) {
    $(".lb-close", lb).onclick = () => lb.close();
    $(".lb-prev", lb).onclick = () => step(-1);
    $(".lb-next", lb).onclick = () => step(1);
    lb.addEventListener("close", () => safe(() => history.replaceState(0, "", location.pathname + location.search)));
    lb.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") step(-1); if (e.key === "ArrowLeft") step(1); });
    let sx = 0;
    $(".lb-media", lb).addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    $(".lb-media", lb).addEventListener("touchend", (e) => { const im = $(".lb-media img", lb); if (im && im.classList.contains("z")) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1); }, { passive: true });
    lb.addEventListener("click", async (e) => {
      if (e.target === lb) return lb.close();
      const im = e.target.closest(".lb-media img"); if (im) return im.classList.toggle("z");
      const a = e.target.closest("[data-a]"); if (!a) return;
      const url = location.origin + "/portfolio#w=" + cur;
      const copy = async () => { try { await navigator.clipboard.writeText(url); toast("لینک کپی شد"); } catch (_) { toast(url); } };
      if (a.dataset.a === "cp") copy();
      if (a.dataset.a === "sh") { if (navigator.share) { try { await navigator.share({ title: "NOVA GRAPHIC", url }); } catch (_) {} } else copy(); }
      if (a.dataset.a === "fv") { let f = []; try { f = JSON.parse(localStorage.getItem("nova-fav") || "[]"); } catch (_) {} f = f.includes(cur) ? f.filter((x) => x !== cur) : [...f, cur]; try { localStorage.setItem("nova-fav", JSON.stringify(f)); } catch (_) {} a.textContent = f.includes(cur) ? "★ علاقه‌مندی" : "☆ علاقه‌مندی"; toast(f.includes(cur) ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد"); }
    });
    const fromHash = () => { const m = location.hash.match(/^#w=(\d+)/); if (m && N.portfolio[+m[1]]) { shown = shown.length ? shown : N.portfolio.map((_, i) => i); openW(m[1], false); } };
    fromHash(); addEventListener("hashchange", fromHash);
  }

  // ---------- order form ----------
  const form = $("#order-form"), dlg = $("#send");
  if (form) {
    let msg = "";
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!$$("input[name=type]:checked", form).length) return toast("حداقل یک سرویس انتخاب کنید");
      if (!form.reportValidity()) return;
      const d = new FormData(form), f = d.get("file"), ts = d.getAll("type").join("، ");
      if (f && f.size > 8e6) return toast("حجم فایل باید کمتر از ۸ مگابایت باشد");
      msg = [`سلام، سفارش جدید از سایت NOVA GRAPHIC:`, `نام: ${d.get("name")}`, `راه ارتباطی: ${d.get("contact")}`, `نوع طراحی: ${ts}`, `توضیحات: ${d.get("details")}`, `بودجه تقریبی: ${d.get("budget") || "مشخص نشده"}`, f && f.name ? `فایل پیوست: ${f.name}` : ""].filter(Boolean).join("\n");
      const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "در حال ارسال…";
      try {
        const r = await fetch("/", { method: "POST", body: d }); if (!r.ok) throw 0;
        form.reset(); $("h3", dlg).textContent = "سفارش شما با موفقیت ثبت شد"; $("#send-note").textContent = "قیمت پس از بررسی سفارش توسط NOVA اعلام می‌شود. برای پیگیری سریع‌تر می‌توانید متن سفارش را در چت هم بفرستید.";
      } catch (_) { $("h3", dlg).textContent = "ارسال مستقیم ممکن نشد؛ سفارش را از اینجا بفرستید"; $("#send-note").textContent = ""; toast("ارسال مستقیم انجام نشد"); }
      $("#msg-preview").value = msg; btn.disabled = false; btn.textContent = "ثبت سفارش"; dlg.showModal();
    });
    $$("[data-send]", dlg).forEach((b) => b.addEventListener("click", async () => {
      const url = b.dataset.send === "tg" ? `${L.tgPersonal}?text=${encodeURIComponent(msg)}` : L.rubikaPersonal;
      let copied = false;
      try { await navigator.clipboard.writeText(msg); copied = true; } catch (e) {}
      $("#send-note").textContent = copied ? "متن سفارش کپی شد. اگر در چت نمایش داده نشد، آن را جای‌گذاری (Paste) کنید." : "متن را از کادر بالا کپی کرده و در چت ارسال کنید.";
      window.open(url, "_blank", "noopener");
    }));
    $(".dlg-close", dlg).onclick = () => dlg.close();
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }
  const q = new URLSearchParams(location.search).get("type"); $$("input[name=type]").forEach((c) => { if (c.value === q) c.checked = true; });

  // ---------- dock / progress / toast ----------
  document.body.insertAdjacentHTML("beforeend", `<nav class="dock" aria-label="دسترسی سریع"><a href="portfolio.html">نمونه‌کارها</a><a class="pri" href="contact.html#order">سفارش طراحی</a><a href="${L.tgPersonal}" target="_blank" rel="noopener">تلگرام</a></nav><div id="prog"></div><div id="toast" role="status" aria-live="polite"></div>`);
  const hd = $("#site-header"), pg = $("#prog");
  let tick = false;
  const sc = () => { tick = false; const h = root; hd.classList.toggle("sc", scrollY > 20); pg.style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, h.scrollHeight - innerHeight))})`; };
  addEventListener("scroll", () => { if (!tick) { tick = true; requestAnimationFrame(sc); } }, { passive: true }); sc();

  // ---------- 3D tilt, spotlight, hero tilt, cursor glow ----------
  const tilt = $(".tiltbox"), glow = $("#glow");
  let hot = null;
  const reset = (c) => { if (!c) return; c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); c.classList.remove("tilting"); };
  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    if (glow) { glow.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; glow.classList.add("on"); }
    const c = e.target.closest && e.target.closest(".card");
    if (c !== hot) { reset(hot); hot = c; }
    if (c && !reduce) {
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty("--x", e.clientX - r.left + "px"); c.style.setProperty("--y", e.clientY - r.top + "px");
      if (!c.matches(".stat,.cta,form")) { c.classList.add("tilting"); c.style.setProperty("--ry", (px - .5) * 12 + "deg"); c.style.setProperty("--rx", (.5 - py) * 12 + "deg"); }
    }
    if (tilt && !reduce) { tilt.style.setProperty("--ry", (e.clientX / innerWidth - .5) * 36 + "deg"); tilt.style.setProperty("--rx", (.5 - e.clientY / innerHeight) * 24 + "deg"); }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { glow?.classList.remove("on"); reset(hot); hot = null; });
  const stage = $(".stage");
  if (stage && !reduce) {
    // lets phone users rotate the 3D cube by dragging
    let sx = 0, sy = 0, ry = 0, rx = 0, on = false;
    stage.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") return; on = true; sx = e.clientX; sy = e.clientY; });
    stage.addEventListener("pointermove", (e) => { if (!on || e.pointerType === "mouse") return; ry = Math.max(-45, Math.min(45, (e.clientX - sx) * .4)); rx = Math.max(-25, Math.min(25, (sy - e.clientY) * .3)); tilt.style.setProperty("--ry", ry + "deg"); tilt.style.setProperty("--rx", rx + "deg"); });
    const end = () => { on = false; tilt.style.setProperty("--ry", "0deg"); tilt.style.setProperty("--rx", "0deg"); };
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => stage.addEventListener(ev, end));
  }

  // ---------- scroll reveal + counters ----------
  const count = (el) => {
    const to = +el.dataset.count, t0 = performance.now(), dur = 1400;
    if (reduce) return (el.textContent = fa(to));
    const f = (t) => { const p = Math.min(1, (t - t0) / dur); el.textContent = fa(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  function observe() {
    const els = $$(".rv:not(.in)");
    els.forEach((e) => { const sibs = e.parentElement ? [...e.parentElement.children].filter((x) => x.classList.contains("rv")) : []; e.style.setProperty("--d", Math.min(sibs.indexOf(e), 8) * 0.08 + "s"); });
    if (!("IntersectionObserver" in window)) { els.forEach((e) => { e.classList.add("in"); $("[data-count]", e) && count($("[data-count]", e)); }); return; }
    io = io || new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("in"); const c = x.target.matches("[data-count]") ? x.target : $("[data-count]", x.target); if (c) count(c); io.unobserve(x.target); } }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => io.observe(e));
  }
  observe();

  // ---------- particles (light, auto-pauses) ----------
  let colA = "155,134,255", colB = "34,224,255";
  const rgb = (v) => { const m = v.trim().match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i); return m ? [1, 2, 3].map((i) => parseInt(m[i], 16)).join(",") : null; };
  function readColors() { const cs = getComputedStyle(root); colA = rgb(cs.getPropertyValue("--ac2")) || colA; colB = rgb(cs.getPropertyValue("--ac3")) || colB; }
  readColors();
  const cv = $("#bg");
  if (cv && !reduce) {
    const ctx = cv.getContext("2d"); let w, h, dpr, pts = [], run = true;
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; const n = innerWidth < 700 ? 26 : 56; pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35 * dpr, vy: (Math.random() - .5) * .35 * dpr, r: (Math.random() * 1.6 + .6) * dpr, c: Math.random() > .5 })); };
    size(); let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(size, 200); });
    const link = 120 * (innerWidth < 700 ? 1 : 1.3);
    const draw = () => {
      if (!run) return;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]; p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = `rgba(${p.c ? colA : colB},.75)`; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) { const q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy), L2 = link * dpr; if (d < L2) { ctx.strokeStyle = `rgba(${colA},${(1 - d / L2) * .22})`; ctx.lineWidth = dpr * .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } }
      }
      requestAnimationFrame(draw);
    };
    draw();
    document.addEventListener("visibilitychange", () => { run = !document.hidden; if (run) draw(); });
  }

  // ---------- loader ----------
  const hide = () => $("#loader")?.classList.add("done");
  document.readyState === "complete" ? setTimeout(hide, 250) : addEventListener("load", () => setTimeout(hide, 250));
  setTimeout(hide, 1600);

  // ---------- smooth page transitions ----------
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]"); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button || a.target || a.hasAttribute("download")) return;
    const u = new URL(a.href, location.href); if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    if (reduce) return; e.preventDefault(); document.body.classList.add("leaving"); setTimeout(() => (location.href = a.href), 200);
  });
  addEventListener("pageshow", (e) => { if (e.persisted) { document.body.classList.remove("leaving"); setMenu(false); } });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  $$("#mnav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
})();
