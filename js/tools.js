(() => {
  const $ = (s, e = document) => e.querySelector(s), $$ = (s, e = document) => [...e.querySelectorAll(s)];
  const kb = (b) => (b > 1048576 ? (b / 1048576).toFixed(2) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB");
  const tz = (v, a, b, c, d) => (v <= a || v >= d ? 0 : v < b ? ((v - a) / (b - a)) * 100 : v <= c ? 100 : ((d - v) / (d - c)) * 100);
  const lin = (l) => (l / 255) ** 2.2;
  const H = {};

  function load(f) {
    return new Promise((ok, no) => {
      if (!f || !/^image\//.test(f.type)) return no("فایل انتخاب‌شده تصویر معتبر نیست.");
      const i = new Image();
      i.onload = () => (i.naturalWidth < 64 || i.naturalHeight < 64 ? no("تصویر خیلی کوچک است (حداقل ۶۴ پیکسل).") : ok({ img: i, file: f }));
      i.onerror = () => no("تصویر خراب است یا باز نمی‌شود.");
      i.src = URL.createObjectURL(f);
    });
  }
  function px(img, max) {
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.max(1, Math.round(img.naturalWidth * s)), h = Math.max(1, Math.round(img.naturalHeight * s));
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d", { willReadFrequently: true }); x.drawImage(img, 0, 0, w, h);
    return { w, h, d: x.getImageData(0, 0, w, h).data };
  }
  function stats(p) {
    const n = p.w * p.h, y = new Float32Array(n), cols = new Set();
    let sum = 0, tr = 0, sat = 0, lm = 0, rm = 0;
    for (let i = 0; i < n; i++) {
      const r = p.d[i * 4], g = p.d[i * 4 + 1], b = p.d[i * 4 + 2];
      if (p.d[i * 4 + 3] < 250) tr++;
      const l = 0.2126 * r + 0.7152 * g + 0.0722 * b; y[i] = l; sum += l;
      if (i % p.w < p.w / 2) lm += l; else rm += l;
      const mx = Math.max(r, g, b); sat += mx ? (mx - Math.min(r, g, b)) / mx : 0;
      cols.add(((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4));
    }
    const m = sum / n; let v = 0, e = 0, wk = 0;
    for (let i = 0; i < n; i++) v += (y[i] - m) ** 2;
    for (let j = 0; j < p.h - 1; j++) for (let i = 0; i < p.w - 1; i++) {
      const k = j * p.w + i, g = Math.abs(y[k] - y[k + 1]) + Math.abs(y[k] - y[k + p.w]);
      if (g > 40) e++; else if (g > 14) wk++;
    }
    return { y, mean: m, sd: Math.sqrt(v / n), tr: tr / n, sat: sat / n, cols: cols.size, edge: e / n, weak: wk / n, bal: Math.abs(lm - rm) / (n / 2) };
  }
  const kind = (r, s) => (r > 2.3 ? "Banner" : r > 1.5 && r < 1.95 ? "Thumbnail" : r > 0.9 && r < 1.1 ? (s.tr > 0.1 || s.cols < 350 ? "Logo" : "Profile") : r > 0.55 && r < 0.8 ? "Poster" : null);
  const li = (a, m) => (a.length ? a.map((x) => `<li>${m} ${x}</li>`).join("") : "<li>—</li>");
  const res = (out, sc, t, G, B, T, C) => {
    out.innerHTML = `<div class="res"><div class="sring" style="--p:${sc}"><b>${sc}</b><small>/ 100</small></div><div><h3>${t}</h3><p>تحلیل خودکار بر اساس معیارهای بصری؛ جایگزین نظر طراح حرفه‌ای نیست.</p></div></div><h4>نقاط قوت</h4><ul>${li(G, "✓")}</ul><h4>مشکلات</h4><ul>${li(B, "⚠")}</ul><h4>پیشنهادها</h4><ul>${li(T, "→")}</ul>${C ? `<div class="crit">${C.map((c) => `<div><span>${c.n}</span><i><b style="width:${c.v}%"></b></i><span>${c.v}</span></div>`).join("")}</div>` : ""}`;
  };

  // ---- امتیازدهی ----
  H.score = (im, out) => {
    const { img, file } = im, W = img.naturalWidth, Ht = img.naturalHeight, r = W / Ht;
    const s = stats(px(img, 400)), s2 = stats(px(img, 120)), k = kind(r, s), C = [];
    const A = (n, v, g, b, t) => C.push({ n, v: Math.round(v), g, b, t });
    A("وضوح", tz(Math.max(W, Ht), 300, 1000, 4500, 9000), `وضوح ${W}×${Ht} مناسب است`, `وضوح ${W}×${Ht} پایین یا بیش‌ازحد بزرگ است`, "ضلع بلندتر را بین ۱۲۸۰ تا ۴۰۰۰ پیکسل نگه دارید");
    A("کنتراست", tz(s.sd, 10, 40, 80, 130), "کنتراست کلی خوب است", "کنتراست کلی کم یا بیش‌ازحد شدید است", "روشنایی سایه‌ها و هایلایت‌ها را بیشتر از هم جدا کنید");
    A("روشنایی", tz(s.mean, 30, 80, 175, 230), "روشنایی متعادل است", "تصویر بیش‌ازحد تاریک یا روشن است", "سطح روشنایی (Levels) را تنظیم کنید");
    A("حجم فایل", tz(file.size / 1048576, 0, 0.03, 2.5, 8), `حجم ${kb(file.size)} مناسب است`, `حجم ${kb(file.size)} برای انتشار مناسب نیست`, "از ابزار «بهینه‌ساز تصویر» استفاده کنید");
    const bal = tz(s.sat, 0.05, 0.25, 0.65, 0.9), den = tz(s.edge, 0.005, 0.05, 0.3, 0.5);
    if (k === "Thumbnail") {
      A("نسبت تصویر", tz(r, 1.4, 1.7, 1.85, 2.1), "نسبت ۱۶:۹ استاندارد است", "نسبت تصویر با ۱۶:۹ فاصله دارد", "بوم را ۱۲۸۰×۷۲۰ یا ۱۹۲۰×۱۰۸۰ بسازید");
      A("تعادل رنگ", bal, "رنگ‌ها زنده و متعادل‌اند", "اشباع رنگ‌ها خیلی کم یا خیلی زیاد است", "اشباع رنگ‌ها را کمی تنظیم کنید");
      A("تراکم بصری", den, "تراکم جزئیات مناسب است", "تصویر خیلی خالی یا خیلی شلوغ است", "عنصر اصلی را بزرگ‌تر و جزئیات فرعی را کمتر کنید");
      A("دیده‌شدن در اندازه کوچک", (tz(s2.sd, 12, 40, 90, 140) + tz(s2.edge, 0.01, 0.05, 0.35, 0.6)) / 2, "در اندازه کوچک هم خوانا می‌ماند", "در اندازه کوچک جزئیات از بین می‌رود", "تصویر را در عرض ۱۶۰ پیکسل ببینید و عنصر اصلی را درشت‌تر کنید");
    } else if (k === "Logo") {
      A("شفافیت", s.tr > 0.05 ? 100 : 45, "پس‌زمینه شفاف دارد", "پس‌زمینه شفاف ندارد", "خروجی PNG یا SVG با پس‌زمینه شفاف تهیه کنید");
      A("سادگی", tz(s.cols, 0, 0, 350, 1500), "ساده و قابل‌استفاده در اندازه‌های مختلف است", "تعداد رنگ و جزئیات زیاد است", "رنگ‌ها و جزئیات را کمتر کنید");
      A("نسبت تصویر", tz(r, 0.3, 0.8, 2.5, 4), "نسبت تصویر مناسب لوگو است", "نسبت تصویر غیرمعمول است", "فضای خالی اطراف لوگو را متعادل کنید");
      A("تراکم بصری", tz(s.edge, 0, 0.005, 0.15, 0.4), "تراکم بصری مناسب است", "تراکم بصری برای لوگو زیاد است", "لوگو را ساده‌تر کنید");
    } else if (k === "Banner") {
      A("نسبت تصویر", tz(r, 1.8, 2.3, 3.4, 4.6), "نسبت بنر مناسب است", "نسبت بنر استاندارد نیست", "برای یوتیوب ۲۵۶۰×۱۴۴۰ با محتوای مهم در ناحیه مرکزی بسازید");
      A("تعادل چپ و راست", 100 - Math.min(100, s.bal * 1.2), "توازن بصری چپ و راست خوب است", "یک سمت بنر خیلی سنگین‌تر از سمت دیگر است", "عناصر را متوازن‌تر پخش کنید");
      A("تراکم بصری", den, "تراکم بصری مناسب است", "بنر خیلی خالی یا شلوغ است", "برای متن، ناحیه‌ای آرام در نظر بگیرید");
    } else if (k === "Profile") {
      A("نسبت تصویر", tz(r, 0.8, 0.95, 1.05, 1.25), "نسبت مربعی مناسب پروفایل است", "پروفایل باید مربعی باشد", "بوم را ۱:۱ بسازید");
      A("تعادل رنگ", bal, "رنگ‌ها متعادل‌اند", "اشباع رنگ‌ها نامتعادل است", "پالت رنگ را محدودتر کنید");
      A("تراکم بصری", den, "تراکم بصری مناسب است", "تراکم بصری نامناسب است", "سوژه را در مرکز و درشت نگه دارید");
    } else if (k === "Poster") {
      A("نسبت تصویر", tz(r, 0.45, 0.6, 0.75, 0.9), "نسبت پوستری مناسب است", "نسبت پوستر استاندارد نیست", "از نسبت‌هایی مثل ۲:۳ یا ۳:۴ استفاده کنید");
      A("تعادل رنگ", bal, "رنگ‌ها متعادل‌اند", "اشباع رنگ‌ها نامتعادل است", "رنگ غالب و رنگ تأکیدی مشخص کنید");
      A("تراکم بصری", den, "تراکم بصری مناسب است", "پوستر خیلی خالی یا شلوغ است", "سلسله‌مراتب عنوان و متن را واضح‌تر کنید");
    } else A("تعادل رنگ", bal, "رنگ‌ها متعادل‌اند", "اشباع رنگ‌ها نامتعادل است", "رنگ‌ها را یکدست‌تر کنید");
    const sc = Math.round(C.reduce((a, c) => a + c.v, 0) / C.length);
    res(out, sc, k || "نوع طراحی مشخص نیست", C.filter((c) => c.v >= 75).map((c) => c.g), C.filter((c) => c.v < 55).map((c) => c.b), C.filter((c) => c.v < 75).map((c) => c.t), C);
  };

  // ---- چک‌خوانایی ----
  H.read = (im, out) => {
    const s = stats(px(im.img, 640)), s2 = stats(px(im.img, 160)), y = s.y.slice().sort();
    const lo = y[(y.length * 0.1) | 0], hi = y[(y.length * 0.9) | 0], cr = (lin(hi) + 0.05) / (lin(lo) + 0.05);
    const wk = s.weak / Math.max(s.weak + s.edge, 0.001), sz = s.edge > 0.18 ? "ریز" : s.edge > 0.07 ? "متوسط" : "درشت";
    const small = s2.sd > 35 && s2.edge > 0.03, G = [], B = [], T = [];
    if (cr >= 4.5) G.push(`نسبت کنتراست روشن‌ترین و تیره‌ترین نواحی ${cr.toFixed(1)}:۱ است`); else { B.push(`نسبت کنتراست ${cr.toFixed(1)}:۱ است؛ کمتر از ۴٫۵:۱`); T.push("رنگ متن و پس‌زمینه را از نظر روشنی بیشتر جدا کنید یا یک سایه/خط دور متن بگذارید"); }
    if (small) G.push("در اندازه کوچک هم جزئیات و کنتراست حفظ می‌شود"); else { B.push("در اندازه کوچک جزئیات و خوانایی کم می‌شود"); T.push("متن را درشت‌تر و کوتاه‌تر کنید و در اندازه ۱۶۰ پیکسل تست کنید"); }
    if (wk > 0.5 && s.weak > 0.03) { B.push("بخش زیادی از لبه‌ها کم‌کنتراست‌اند (احتمال متن کم‌رنگ)"); T.push("متن‌های کم‌رنگ را پررنگ‌تر کنید"); } else G.push("لبه‌های کم‌کنتراست قابل‌توجهی دیده نشد");
    if (sz === "ریز") { B.push("جزئیات/متن در تصویر ریز برآورد می‌شود"); T.push("اندازه فونت را بزرگ‌تر کنید"); } else G.push(`اندازه تقریبی جزئیات/متن: ${sz}`);
    const sc = Math.round(tz(cr, 1, 4.5, 21, 22) * 0.5 + (small ? 100 : 40) * 0.3 + (1 - Math.min(1, wk)) * 100 * 0.2);
    res(out, sc, "گزارش خوانایی", G, B, T);
    out.insertAdjacentHTML("beforeend", "<p><small>برآورد تقریبی از روی پیکسل‌هاست؛ متن را مستقیم تشخیص نمی‌دهد.</small></p>");
  };

  // ---- پالت رنگ ----
  const hx = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
  H.pal = (im, out) => {
    const p = px(im.img, 160), m = new Map();
    for (let i = 0; i < p.d.length; i += 4) {
      if (p.d[i + 3] < 128) continue;
      const k = ((p.d[i] >> 4) << 8) | ((p.d[i + 1] >> 4) << 4) | (p.d[i + 2] >> 4), e = m.get(k) || [0, 0, 0, 0];
      e[0]++; e[1] += p.d[i]; e[2] += p.d[i + 1]; e[3] += p.d[i + 2]; m.set(k, e);
    }
    const all = [...m.values()].sort((a, b) => b[0] - a[0]).map((e) => [(e[1] / e[0]) | 0, (e[2] / e[0]) | 0, (e[3] / e[0]) | 0]), pick = [];
    for (const c of all) { if (pick.every((q) => Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]) > 60)) pick.push(c); if (pick.length >= 8) break; }
    if (!pick.length) throw new Error("رنگ قابل‌استخراجی پیدا نشد (تصویر کاملاً شفاف است).");
    const sw = (c) => { const h = hx(c), l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; return `<button class="sw" data-h="${h}" style="background:${h};color:${l > 140 ? "#111" : "#fff"}" aria-label="کپی ${h}">${h}<small>کلیک برای کپی</small></button>`; };
    const d = pick[0], t = Math.max(...d) + Math.min(...d), comp = d.map((v) => t - v);
    out.innerHTML = `<h4>رنگ‌های اصلی</h4><div class="sws">${pick.map(sw).join("")}</div><h4>رنگ مکمل پیشنهادی برای رنگ اصلی</h4><div class="sws">${sw(comp)}</div>`;
  };

  // ---- بهینه‌ساز ----
  H.opt = async (im, out) => {
    const P = $("#p-opt"), f = $(".of", P).value, q = $(".oqr", P).value / 100, mw = +$(".ow", P).value, { img, file } = im;
    const W = img.naturalWidth, Ht = img.naturalHeight, s = mw && mw < W ? mw / W : 1, w = Math.round(W * s), h = Math.round(Ht * s);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d"); if (f === "image/jpeg") { x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); }
    x.drawImage(img, 0, 0, w, h);
    const b = await new Promise((r) => c.toBlob(r, f, q));
    if (!b || b.type !== f) throw new Error("مرورگر این فرمت را پشتیبانی نمی‌کند.");
    const ext = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" }[f], d = Math.round((1 - b.size / file.size) * 100);
    out.innerHTML = `<div class="cmp"><div><h4>قبل</h4><p>فرمت: ${file.type.split("/")[1] || "?"}<br>ابعاد: ${W}×${Ht}<br>حجم: ${kb(file.size)}</p></div><div><h4>بعد</h4><p>فرمت: ${ext}<br>ابعاد: ${w}×${h}<br>حجم: ${kb(b.size)}</p></div></div><p>${d > 0 ? `✓ ${d}٪ کاهش حجم` : "⚠ حجم خروجی بیشتر شد؛ کیفیت یا فرمت دیگری را امتحان کنید"}</p><a class="btn pri" download="nova-optimized.${ext}" href="${URL.createObjectURL(b)}">دانلود تصویر</a>`;
  };

  // ---- UI ----
  const T = [["score", "امتیازدهی", "تصویر طراحی را بدهید تا نوع آن حدس زده شود و بر اساس معیارهای بصری امتیاز بگیرد."], ["read", "چک‌خوانایی", "کنتراست و خوانایی متن را در اندازه‌های مختلف بررسی کنید."], ["pal", "پالت رنگ", "رنگ‌های اصلی تصویر را با کد HEX استخراج کنید."], ["opt", "بهینه‌ساز تصویر", "حجم تصویر را کم کنید یا فرمت آن را تغییر دهید."]];
  const optUI = '<div class="ctl"><label>فرمت<select class="of"><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label><label>کیفیت: <output class="oq">80</output>٪<input class="oqr" type="range" min="30" max="100" value="80"></label><label>حداکثر عرض (px)<input class="ow" type="number" min="100" inputmode="numeric" placeholder="اصلی"></label></div>';
  $("#tools").innerHTML = `<div class="tabs" role="tablist">${T.map((t, i) => `<button role="tab" data-t="${t[0]}" aria-selected="${!i}">${t[1]}</button>`).join("")}</div>` +
    T.map((t, i) => `<section class="card tp" id="p-${t[0]}" role="tabpanel" ${i ? "hidden" : ""}><h2 style="font-size:1.3rem">${t[1]}</h2><p>${t[2]}</p><label class="drop"><input type="file" accept="image/*"><b>انتخاب تصویر</b><small>پردازش فقط در مرورگر شما انجام می‌شود؛ تصویر آپلود نمی‌شود.</small></label>${t[0] === "opt" ? optUI : ""}<div class="out" aria-live="polite"></div></section>`).join("");
  const last = {};
  const run = async (k, f) => {
    const out = $("#p-" + k + " .out"); last[k] = f; out.innerHTML = "<p>در حال تحلیل…</p>";
    try { const im = await load(f); out.innerHTML = ""; await H[k](im, out); } catch (e) { out.innerHTML = `<p class="err">⚠ ${e.message || e}</p>`; }
  };
  $$(".tp").forEach((p) => { $("input[type=file]", p).onchange = (e) => { run(p.id.slice(2), e.target.files[0]); e.target.value = ""; }; });
  $("#p-opt").addEventListener("input", (e) => { if (e.target.matches(".oqr")) $(".oq").textContent = e.target.value; if (e.target.type !== "file" && last.opt) run("opt", last.opt); });
  const sel = (k) => { $$(".tabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.t === k)); $$(".tp").forEach((p) => (p.hidden = p.id !== "p-" + k)); };
  $(".tabs").onclick = (e) => { const b = e.target.closest("button"); if (b) { sel(b.dataset.t); history.replaceState(0, "", "#" + b.dataset.t); } };
  if (H[location.hash.slice(1)]) sel(location.hash.slice(1));
  document.addEventListener("click", (e) => { const b = e.target.closest(".sw"); if (b) navigator.clipboard.writeText(b.dataset.h).then(() => toast("کپی شد: " + b.dataset.h), () => toast(b.dataset.h)); });
})();
