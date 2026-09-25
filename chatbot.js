const NW_CHAT = {
  apiUrl: "",
  botName: "Nichewick AI",
  waLink:
    "https://wa.me/918796678766?text=Hi%20Nichewick%2C%20I%27d%20like%20to%20connect.",
};

const NW_STORE_KEY = "nw-inbox-v1";
const NW_SESSION_KEY = "nw-chat-session";

const DEFAULT_CHIPS = ["How do you work?", "What is an audit?", "Talk on WhatsApp"];

const STAGES = [
  ["Spot gaps", "Find what is actually blocking growth."],
  ["Validate fast", "Test whether the demand is real before you spend more."],
  ["Build offer", "Design the offer and the system around it, not a one-off campaign."],
  ["Launch clean", "Go live without the usual mess."],
  ["Drive reach", "Put it in front of the people who can buy."],
  ["Grow revenue", "Repeat what is already working."],
  ["Scale engine", "Turn those wins into something that compounds."],
];

function matchIntents(q) {
  const found = [];
  const add = (name, ok) => {
    if (ok && !found.includes(name)) found.push(name);
  };

  add("pricing", /\b(price|pricing|cost|fee|fees|charge|budget|rates?)\b|how much|expensive/.test(q));
  add("contact", /whatsapp|e-?mail|phone|call me|reach you|contact|get in touch|talk to (you|the team|someone)/.test(q));
  add("clients", /client|portfolio|case stud|chilli|pack n carry|sherpuria|brajmiles|your work|brands you/.test(q));
  add("model", /model|process|stages?|method|framework|how (do|does) (you|nichewick) work|seven stage|7 stage/.test(q));
  add("audit", /audit|book|get started|where do (we|i) start|sign up|diagnos|blocker/.test(q));
  add("about", /who are you|what (is|are) nichewick|what do you do|about (you|nichewick)|growth house|are you (an )?(agency|ai|gpt|chatgpt)|what can you/.test(q));
  add("timeline", /how long|timeline|how many (weeks|months|days)|turnaround|when can you/.test(q));
  add("social", /instagram|reels?|social media|content|facebook|\bads?\b|campaign/.test(q));
  add("greeting", /^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/.test(q));
  add("thanks", /^(thanks|thank you|thx|great|perfect|cool)[.! ]*$/.test(q));

  if (found.length > 1) {
    return found.filter((name) => name !== "greeting");
  }
  return found;
}

function stageList() {
  return STAGES.map((stage, index) => `${index + 1}. ${stage[0]} — ${stage[1]}`).join("\n");
}

function renderIntent(intent, depth, q) {
  if (intent === "greeting") {
    return "Hello. I am Nichewick’s growth assistant.\n\nI can explain what is usually stopping a business from growing, walk through how we work, or help you start an audit. Ask in a normal sentence — you do not need a special command.";
  }

  if (intent === "thanks") {
    return "You are welcome.\n\nIf you want to go further, I can explain the seven-stage model or open WhatsApp so the team can look at your business specifically.";
  }

  if (intent === "about") {
    const base =
      "Nichewick is The Growth House — a venture growth partner for founders in India.\n\nWe do three things together: find what is blocking growth, decide the strategy, and execute it. The point is a system the business can run, not another deck that sits in a folder.";
    if (depth < 2) {
      return `${base}\n\nIf you tell me whether you want the method, the clients, or how an audit starts, I will answer that directly.`;
    }
    return `${base}\n\nFounders usually come when effort is high and growth is flat. The first job is to name the blocker. After that we validate demand, build the offer, launch it cleanly, and only then push reach and revenue.\n\nI can go stage by stage, or we can start with an audit.`;
  }

  if (intent === "model") {
    const base =
      "We work in seven stages, in this order. Each stage exists so the next one is not a guess.\n\n" +
      stageList();
    if (depth < 2) {
      return `${base}\n\nMost businesses are stuck in the first three. An audit is how we find out which one is yours.`;
    }
    return `${base}\n\nWe do not skip ahead to ads or content if the offer is unclear. Reach on a weak offer just spends money faster. Validation comes before the build, and revenue work comes after something has already launched cleanly.\n\nIf you want, tell me where you think you are stuck and I will say which stage that sounds like.`;
  }

  if (intent === "audit") {
    const base =
      "An audit is where we start. We look at the business and name what is actually stopping it from growing — offer, demand, launch, reach, or the system behind revenue.\n\nYou leave with a clear blocker and the next stage to work on, not a long slide deck.";
    if (depth < 2) {
      return `${base}\n\nSay “book an audit” when you want me to open WhatsApp. Until then I will keep explaining.`;
    }
    return `${base}\n\nIn practice we look at where effort is going, what has already been tried, and which of the seven stages is unfinished. That tells us whether you need validation, a rebuilt offer, a cleaner launch, or a reach system.\n\nBooking is a WhatsApp conversation with the team. I can open it when you ask.`;
  }

  if (intent === "clients") {
    const base =
      "The clients on the site are The Chilli Wok, Pack n Carry, Ravi Sherpuria, and Brajmiles.\n\nThe published work is The Chilli Wok: a reel-first content system for a food brand that needed to find its audience. That reel is live on Instagram.";
    if (depth < 2) return `${base}\n\nI can also explain how that kind of work sits inside the seven-stage model.`;
    return `${base}\n\nA reel is not the whole engagement. For a food brand it usually sits in “drive reach,” after the offer and the launch are clear enough to show. If reach is the only problem, we still check the earlier stages so the content has something solid to point at.`;
  }

  if (intent === "pricing") {
    return "There is no single public price, and I should not invent one.\n\nWhat changes the fee is the stage and the scope. An audit is smaller than building the offer, and both are smaller than a full growth partnership where we stay through launch, reach, and revenue.\n\nThe useful next step is a short WhatsApp conversation. Tell the team the stage you are in and they will recommend the fit. Say “talk on WhatsApp” and I will open it.";
  }

  if (intent === "contact") {
    return "The team is on WhatsApp only. That is the fastest way to reach a person, not just this assistant.\n\nI can open a chat for you. You will land on a message to Nichewick, and someone on the team replies there.\n\nSay “talk on WhatsApp” if you want me to open it now.";
  }

  if (intent === "timeline") {
    return "I cannot give you a fixed number of weeks from here. It depends on which stage is unfinished.\n\nAn audit comes first, because a timeline before the blocker is known is a guess. After that, validating demand is shorter than building and launching a full offer, and a growth partnership runs longer because it includes reach and revenue.\n\nIf you describe the business in a sentence, I can say which stage it sounds like. The team can put a real timeline on it over WhatsApp.";
  }

  if (intent === "social") {
    return "Yes. Content and reels are part of the work, not a separate product.\n\nThey sit in “drive reach” — after the gaps are clear, demand is tested, and the offer is built. The Chilli Wok project is the example on the site: a reel-first system for a food brand, with the reel live on Instagram.\n\nIf reach is all you want, we still check the earlier stages. Posting more on a weak offer does not fix growth.";
  }

  const food = /restaurant|cafe|café|food brand|cloud kitchen|dhaba|\bmenu\b/.test(q);
  const stuck = /stuck|not growing|plateau|flat|struggling|help me/.test(q);
  if (food || stuck) {
    const opening = food
      ? "For a food business, I would not start with more posts."
      : "If growth feels stuck, I would not start with more activity.";
    return `${opening} I would start by naming the blocker.\n\nIt is usually one of three things: the offer is not sharp, demand was never really tested, or reach is being pushed before those two are solid. The Chilli Wok project is the food example on this site, and the reels came after there was a clear offer to point at.\n\nTell me what you have already tried, in one sentence, and I will say which of the seven stages that sounds like.`;
  }

  return "I can answer that in the context of how Nichewick works. I will not invent a metric, a price, or a promise the team has not made.\n\nWhat I can be precise about: we audit the blocker, then we build the strategy and execute it across seven stages — from spotting gaps through to a scale engine. Clients on the site include The Chilli Wok, Pack n Carry, Ravi Sherpuria, and Brajmiles.\n\nAsk me about the model, an audit, pricing, or the work. Or say “talk on WhatsApp” and I will hand you to the team.";
}

function chipsFor(intent) {
  if (intent === "model") return ["What is an audit?", "Your clients", "Talk on WhatsApp"];
  if (intent === "audit") return ["How do you work?", "Book an audit", "Talk on WhatsApp"];
  if (intent === "clients" || intent === "social") return ["How do you work?", "Book an audit", "Talk on WhatsApp"];
  if (intent === "pricing" || intent === "contact" || intent === "timeline") return ["What is an audit?", "How do you work?", "Talk on WhatsApp"];
  return DEFAULT_CHIPS;
}

function composeReply(text, ctx) {
  const q = text.trim().toLowerCase();
  const follow = /^(more|tell me more|go on|explain( more)?|elaborate|continue|why\??)$/.test(q) || /\b(tell me more|more detail|elaborate|go deeper)\b/.test(q);
  const affirm = /^(yes|yeah|yep|sure|ok|okay|please|please do|do it)$/.test(q);
  const wantsBook = /\b(book( an)? audit|book it|i want to book|sign me up)\b/.test(q);
  const wantsWa = wantsBook || /\b(talk on whatsapp|open whatsapp|see contact|message (them|the team|on whatsapp))\b/.test(q) || (affirm && (ctx.lastOffer === "whatsapp" || ctx.lastIntent === "contact"));

  let intents = matchIntents(q);
  const depth = follow ? 2 : 1;

  if ((follow || (affirm && !wantsWa)) && intents.length === 0) {
    intents = [ctx.lastIntent || "about"];
  }

  if (wantsWa && intents.length === 0) {
    intents = [wantsBook ? "audit" : "contact"];
  }

  const shown = (intents.length ? intents : ["other"]).slice(0, 2);
  const reply = shown.map((intent) => renderIntent(intent, depth, q)).join("\n\n");
  const intent = shown[0] === "other" ? "other" : shown[0];

  let action = null;
  if (wantsWa) {
    action = wantsBook
      ? { type: "audit", label: "Sent visitor to book an audit" }
      : { type: "whatsapp", label: "Opened WhatsApp" };
  }

  const handoff = wantsBook
    ? "Opening WhatsApp so you can book the audit. The message is ready — send it and the team will take it from there."
    : "Opening WhatsApp now. You will get a chat with Nichewick, and the team replies there.";

  return {
    reply: action ? `${handoff}\n\n${reply}` : reply,
    chips: chipsFor(intent),
    intent,
    action,
    offer: action || intent === "pricing" || intent === "contact" || intent === "audit" ? "whatsapp" : "",
  };
}

function loadInbox() {
  try {
    const data = JSON.parse(localStorage.getItem(NW_STORE_KEY) || "");
    if (!data || !Array.isArray(data.sessions)) return { sessions: [] };
    return data;
  } catch {
    return { sessions: [] };
  }
}

function saveInbox(store) {
  localStorage.setItem(NW_STORE_KEY, JSON.stringify(store));
}

function sessionId() {
  let id = sessionStorage.getItem(NW_SESSION_KEY);
  if (!id) {
    id = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    sessionStorage.setItem(NW_SESSION_KEY, id);
  }
  return id;
}

function logChat({ userText, reply, intent, action }) {
  const store = loadInbox();
  const id = sessionId();
  const now = new Date().toISOString();
  let session = store.sessions.find((item) => item.id === id);

  if (!session) {
    session = {
      id,
      startedAt: now,
      updatedAt: now,
      messages: [],
      intents: [],
      actions: [],
    };
    store.sessions.unshift(session);
  }

  if (userText) {
    session.messages.push({ role: "user", text: userText, at: now, intent });
    if (intent && intent !== "other" && !session.intents.includes(intent)) {
      session.intents.push(intent);
    }
  }

  if (reply) {
    session.messages.push({ role: "assistant", text: reply, at: now });
  }

  if (action) {
    session.actions.push({ type: action.type, label: action.label, at: now });
  }

  session.updatedAt = now;
  store.sessions = store.sessions.slice(0, 80);
  saveInbox(store);
}

function initChatbot() {
  const root = document.getElementById("nwChat");
  if (!root) return;

  const panel = root.querySelector(".nw-chat-panel");
  const fab = root.querySelector(".nw-chat-fab");
  const closeBtn = root.querySelector(".nw-chat-close");
  const form = root.querySelector(".nw-chat-form");
  const input = root.querySelector(".nw-chat-input");
  const messages = root.querySelector(".nw-chat-messages");
  const chipsWrap = root.querySelector(".nw-chat-chips");

  const history = [];
  let open = false;
  let typing = false;
  let lastIntent = "about";
  let lastOffer = "";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const scrollDown = () => {
    messages.scrollTop = messages.scrollHeight;
  };

  const addMessage = (text, role, opts = {}) => {
    const row = document.createElement("div");
    row.className = `nw-chat-msg nw-chat-msg--${role}`;
    if (opts.typing) row.classList.add("is-typing");

    const bubble = document.createElement("div");
    bubble.className = "nw-chat-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    scrollDown();
    return row;
  };

  const setChips = (labels) => {
    chipsWrap.innerHTML = "";
    labels.forEach((label) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nw-chat-chip";
      btn.textContent = label;
      btn.addEventListener("click", () => handleUser(label));
      chipsWrap.appendChild(btn);
    });
  };

  const openWa = () => {
    window.open(NW_CHAT.waLink, "_blank", "noopener,noreferrer");
  };

  const localReply = (text) => {
    const result = composeReply(text, { lastIntent, lastOffer });
    lastIntent = result.intent || lastIntent;
    lastOffer = result.offer || "";
    if (result.action) openWa();
    return result;
  };

  const writeReply = async (text) => {
    const row = addMessage("", "bot");
    const bubble = row.querySelector(".nw-chat-bubble");
    if (reduced || text.length < 80) {
      bubble.textContent = text;
      scrollDown();
      return;
    }

    const step = Math.max(3, Math.ceil(text.length / 48));
    for (let i = step; i < text.length; i += step) {
      bubble.textContent = text.slice(0, i);
      scrollDown();
      await new Promise((resolve) => setTimeout(resolve, 16));
    }
    bubble.textContent = text;
    scrollDown();
  };

  const apiReply = async (text) => {
    const res = await fetch(NW_CHAT.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history }),
    });
    if (!res.ok) throw new Error("Chat API failed");
    const data = await res.json();
    return {
      reply: data.reply || data.message || DEFAULT_REPLY,
      chips: data.chips || DEFAULT_CHIPS,
    };
  };

  const respond = async (text) => {
    if (typing) return;
    typing = true;
    const typingRow = addMessage("Thinking…", "bot", { typing: true });

    try {
      await new Promise((r) => setTimeout(r, 350));
      const result = NW_CHAT.apiUrl ? await apiReply(text) : localReply(text);
      typingRow.remove();
      await writeReply(result.reply);
      history.push({ role: "assistant", content: result.reply });
      logChat({
        userText: text,
        reply: result.reply,
        intent: result.intent,
        action: result.action,
      });
      setChips(result.chips);
    } catch {
      typingRow.remove();
      const fallback = localReply(text);
      await writeReply(fallback.reply);
      logChat({
        userText: text,
        reply: fallback.reply,
        intent: fallback.intent,
        action: fallback.action,
      });
      setChips(fallback.chips);
    } finally {
      typing = false;
    }
  };

  const handleUser = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed, "user");
    history.push({ role: "user", content: trimmed });
    input.value = "";
    respond(trimmed);
  };

  const setOpen = (next) => {
    open = next;
    root.classList.toggle("is-open", open);
    fab.setAttribute("aria-expanded", String(open));
    panel.setAttribute("aria-hidden", String(!open));
    if (open) {
      input.focus();
      scrollDown();
    }
  };

  fab.addEventListener("click", () => setOpen(!open));
  closeBtn.addEventListener("click", () => setOpen(false));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleUser(input.value);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setOpen(false);
  });

  addMessage(
    "Hello. I am Nichewick’s growth assistant.\n\nAsk me what is stopping a business from growing, how the seven stages work, or what an audit actually is. I will answer in full, then you can decide if you want WhatsApp.",
    "bot"
  );
  setChips(DEFAULT_CHIPS);
}

if (typeof document !== "undefined") initChatbot();
