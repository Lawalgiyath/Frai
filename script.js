/* ============================================================
   FRAI · interactions
   Countdown · scroll reveal · interactive demo · forms
   ============================================================ */
(function () {
  "use strict";

  /* -------- CONFIG: edit these for your real studio limits -------- */
  const CONFIG = {
    // Client slots available for the current month.
    totalSlots: 4,
    slotsLeft: 1,

    // Where form submissions go (Formspree). Leave null to run in "demo /
    // no-backend" mode (submissions are logged + stored locally).
    endpoint: "https://formspree.io/f/xbdpoplj",
  };

  /* ----------------------- helpers ----------------------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ----------------------- slots left ------------------------- */
  $$("[data-slots-left]").forEach((el) => (el.textContent = CONFIG.slotsLeft));

  /* -------------------- scroll reveal -------------------- */
  (function reveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((e) => io.observe(e));
  })();

  /* ------------------- year in footer -------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------ interactive demo ------------------- */
  (function demo() {
    const body  = $("#demo-body");
    const chips = $("#demo-chips");
    if (!body || !chips) return;

    const ANSWERS = {
      "do-you-deliver": {
        q: "Do you deliver to Lekki?",
        a: "Yes, we deliver across Lagos including Lekki. Lekki Phase 1 is ₦2,500 and usually arrives same day if you order before 2pm.",
        src: "source: delivery_zones.pdf · row 4",
      },
      price: {
        q: "How much is a bag of rice?",
        a: "A 50kg bag of our Mama Gold rice is ₦78,000 today. The 25kg is ₦41,000. Prices update from our live inventory sheet.",
        src: "source: inventory.csv · SKU RICE-50",
      },
      hours: {
        q: "What time do you close?",
        a: "We're open Mon–Sat, 8:00am to 7:00pm. Closed on Sundays. Online orders can be placed any time.",
        src: "source: store_info.md · hours",
      },
      bulk: {
        q: "Do you do bulk discounts?",
        a: "Yes. Orders above ₦500,000 get 5% off, and above ₦1,000,000 get 8% plus free delivery within Lagos.",
        src: "source: pricing_policy.pdf · §3",
      },
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function bubble(cls, html) {
      const el = document.createElement("div");
      el.className = "bubble " + cls;
      el.innerHTML = html;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    let busy = false;
    function ask(key) {
      const item = ANSWERS[key];
      if (!item || busy) return;
      busy = true;
      bubble("bubble--user", item.q);

      const typing = bubble(
        "bubble--bot",
        '<span class="typing"><span></span><span></span><span></span></span>'
      );

      const delay = reduce ? 250 : 850;
      setTimeout(() => {
        typing.innerHTML =
          item.a + '<span class="src">↳ ' + item.src + "</span>";
        body.scrollTop = body.scrollHeight;
        busy = false;
      }, delay);
    }

    chips.addEventListener("click", (e) => {
      const btn = e.target.closest(".qchip");
      if (btn) ask(btn.dataset.q);
    });
  })();

  /* ----------------------- forms ------------------------- */
  async function submit(payload) {
    // No backend configured → graceful local "demo" success so the
    // page is fully functional before you wire an endpoint.
    if (!CONFIG.endpoint) {
      try {
        const key = "frai_submissions";
        const prev = JSON.parse(localStorage.getItem(key) || "[]");
        prev.push({ ...payload, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(prev));
      } catch (_) {}
      console.info("[frai] submission (no endpoint set):", payload);
      return new Promise((res) => setTimeout(res, 600));
    }
    const r = await fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error("Request failed: " + r.status);
    return r.json().catch(() => ({}));
  }

  function lockBtn(btn, text) {
    if (!btn) return () => {};
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = ".7";
    btn.innerHTML = text;
    return () => {
      btn.disabled = false;
      btn.style.opacity = "";
      btn.innerHTML = original;
    };
  }

  /* --- hero email capture --- */
  (function capture() {
    const form = $("#capture-form");
    if (!form) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[name="email"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const email = emailInput ? emailInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      
      // Reset any previous error states
      if (emailInput) emailInput.style.boxShadow = "";
      if (phoneInput) phoneInput.style.boxShadow = "";

      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        if (emailInput) {
          emailInput.focus();
          emailInput.style.boxShadow = "inset 0 0 0 2px var(--vermilion)";
        }
        return;
      }
      
      if (!phone) {
        if (phoneInput) {
          phoneInput.focus();
          phoneInput.style.boxShadow = "inset 0 0 0 2px var(--vermilion)";
        }
        return;
      }

      const restore = lockBtn(form.querySelector("button"), "Sending…");
      try {
        await submit({ type: "consultation_request", email, phone });
        form.innerHTML =
          '<div class="chip" style="background:var(--ink);color:var(--paper);border-color:var(--ink);font-size:var(--t-sm);padding:.7rem 1rem"><span class="dot"></span> Request received! We will reach out shortly. <a href="#apply" style="color:var(--amber);text-decoration:underline;margin-left:.3rem">Fill detail brief →</a></div>';
      } catch (err) {
        restore();
        alert("Something went wrong. Please try again.");
      }
    });
  })();

  /* --- application form --- */
  (function apply() {
    const form    = $("#apply-form");
    const success = $("#applied");
    const msg     = $("#apply-msg");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form__msg";

      const data = Object.fromEntries(new FormData(form).entries());
      const required = ["name", "business", "automate", "contact", "email"];
      const missing = required.filter((k) => !String(data[k] || "").trim());
      if (missing.length) {
        const first = form.querySelector(`[name="${missing[0]}"]`);
        if (first) first.focus();
        msg.textContent = "Please fill in the required fields.";
        msg.classList.add("show", "err");
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
        msg.textContent = "That email doesn't look right.";
        msg.classList.add("show", "err");
        form.querySelector('[name="email"]').focus();
        return;
      }

      const restore = lockBtn(form.querySelector("button[type=submit]"), "Submitting…");
      try {
        await submit({ type: "proposal_request", ...data });
        form.classList.add("hide");
        if (success) {
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } catch (err) {
        restore();
        msg.textContent = "Couldn't submit right now. Please try again or WhatsApp us.";
        msg.classList.add("show", "err");
      }
    });
  })();
})();
