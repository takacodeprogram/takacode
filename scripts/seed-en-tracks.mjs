// Seed of ENGLISH-language tracks.
//
// These are NOT translations of the French tracks. Same TakaCode method
// (idea -> project -> build -> publish -> cash), but written for an
// international audience with English-language resources, English-speaking
// creator examples and international payment platforms (Stripe, Gumroad,
// Lemon Squeezy) instead of the mobile-money-first African market focus.
//
// Usage: node scripts/seed-en-tracks.mjs
// Idempotent (upsert by slug). Requires migration 20260720000000 (locale column).
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

function loadEnv(file) {
  try {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
    }
  } catch {}
}
loadEnv(".env.local");
loadEnv(".env");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const TRACKS = [
  {
    track: {
      slug: "ai-foundations-en",
      locale: "en",
      counterpart_slug: "ia-fondamentaux",
      goal_key: "ai_foundations",
      title: "AI Foundations",
      summary: "Understand how LLMs actually work, write prompts that deliver, and turn AI into a real force multiplier for your projects.",
      description:
        "Start here. You will learn what a large language model really is (and is not), how tokens and context windows shape every answer you get, and how to write prompts that produce reliable output instead of plausible noise. Then you move to the practical layer: iterating with AI on real work, spotting hallucinations, and building your own AI workflow. Every lesson ends with a micro-project applied to your own project, so the skill lands in your hands, not just in your notes.",
      level_label: "Beginner",
      duration_weeks: 3,
      accent_color: "#22D3EE",
      icon: "lucide:brain-circuit",
      objective: "Use AI deliberately and confidently on your own project.",
      resources: ["Anthropic Docs", "OpenAI Cookbook", "DeepLearning.AI", "Prompt Engineering Guide"],
      next_session: "Tuesday 7:00 PM",
      next_steps: [
        { label: "How LLMs work", state: "current" },
        { label: "Prompting that delivers", state: "locked" },
        { label: "Your AI workflow", state: "locked" }
      ],
      sort_order: 200,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "how-llms-work-en",
        title: "How LLMs actually work",
        summary: "Tokens, context windows and why models hallucinate — the mental model that makes everything else click.",
        sort_order: 10,
        lessons: [
          {
            slug: "what-is-an-llm-en",
            title: "What a language model really is",
            intro: "A large language model predicts the next token given everything before it. That single sentence explains most of what you will observe: why it is fluent, why it is confidently wrong sometimes, and why the way you phrase a request changes the answer so much.",
            why_important: "Most AI frustration comes from a wrong mental model. People treat an LLM like a database (it is not — it does not look things up) or like a person (it is not — it has no memory between chats unless you give it one). Get the model right and your results improve immediately, before you learn a single prompting trick.",
            how_to_use: "Read Anthropic's introduction to how Claude works, then run a deliberate experiment: ask the same factual question three times in three different phrasings and compare the answers. Note where the model is consistent and where it drifts. That drift is the thing you will learn to control.",
            objectives: [
              "Explain next-token prediction in your own words",
              "Distinguish an LLM from a search engine and from a database",
              "Recognise why identical questions can yield different answers"
            ],
            resources: [
              { label: "Anthropic — Intro to Claude", url: "https://docs.anthropic.com/en/docs/intro-to-claude", kind: "doc", why: "A clear, vendor-accurate explanation of what these models do and where they fit.", how: "Read the overview, then note the three capabilities most relevant to your project." },
              { label: "3Blue1Brown — But what is a GPT?", url: "https://www.youtube.com/watch?v=wjZofJX0v4M", kind: "video", why: "The best visual explanation of transformer models available anywhere, and it is free.", how: "Watch once for intuition; you do not need the maths to benefit." },
              { label: "Prompt Engineering Guide — Introduction", url: "https://www.promptingguide.ai/", kind: "doc", why: "A well-maintained open reference that grounds the vocabulary you will use all track.", how: "Skim the introduction and bookmark it as your glossary." }
            ],
            quiz: [
              { q: "What does a language model fundamentally do?", choices: ["It looks up answers in a database", "It predicts the next token given the preceding context", "It searches the live web by default"], answer: 1, explanation: "Everything else — fluency, reasoning, hallucination — follows from next-token prediction over context." },
              { q: "Why can the same question produce different answers?", choices: ["The model is broken", "Generation is probabilistic and highly sensitive to phrasing and context", "It depends on your internet speed"], answer: 1, explanation: "Small changes in wording shift the probability distribution over the next tokens." },
              { q: "What is a hallucination in this context?", choices: ["A rendering bug", "A fluent, confident answer that is not grounded in fact", "A refusal to answer"], answer: 1, explanation: "The model optimises for plausible continuation, not for truth — which is why verification stays your job." },
              { q: "Does a chat model remember your previous conversations by default?", choices: ["Yes, always", "No — unless the context or a memory system provides it", "Only on weekends"], answer: 1, explanation: "Memory is something you engineer (context, files, tools), not something you assume." }
            ],
            micro_project: {
              title: "Your LLM behaviour report",
              brief: "Run a small experiment to build your own evidence about how the model behaves.",
              steps: [
                "Pick one factual question relevant to your project",
                "Ask it three ways: minimal, detailed, and with explicit context",
                "Record how the answers differ in accuracy and usefulness",
                "Write the rule you will apply from now on"
              ],
              deliverable: "Your three prompts, the differences you observed, and the personal rule you derived from it.",
              validation: "ai"
            },
            xp_reward: 50,
            duration_minutes: 45,
            sort_order: 10
          },
          {
            slug: "tokens-and-context-en",
            title: "Tokens, context windows and cost",
            intro: "Models do not read words, they read tokens. The context window is the total budget of tokens the model can attend to at once — your prompt, your files, the conversation history and the answer all compete for the same space.",
            why_important: "Context is the resource you manage on every serious AI task. Understanding it explains why the model 'forgets' the start of a long chat, why costs climb, and why feeding an entire document is often worse than feeding the relevant three paragraphs.",
            how_to_use: "Use a tokenizer to see how your own text splits into tokens, then compare: English prose, code, and a non-English language. Notice how differently they consume budget. Then take a long prompt you actually use and cut it in half without losing intent — that skill pays every single day.",
            objectives: [
              "Explain tokens and context windows concretely",
              "Estimate the token cost of a real prompt",
              "Trim a prompt without losing its intent"
            ],
            resources: [
              { label: "Anthropic — Context windows", url: "https://docs.anthropic.com/en/docs/build-with-claude/context-windows", kind: "doc", why: "Official reference on how context is consumed and why it matters.", how: "Read it with your own longest prompt in mind." },
              { label: "OpenAI Tokenizer", url: "https://platform.openai.com/tokenizer", kind: "tool", why: "See your text turned into tokens instantly — the fastest way to build intuition.", how: "Paste prose, then code, then another language, and compare the counts." },
              { label: "Anthropic — Token counting", url: "https://docs.anthropic.com/en/docs/build-with-claude/token-counting", kind: "doc", why: "How to measure token usage properly when you build with the API.", how: "Skim now; return to it when you automate anything." }
            ],
            quiz: [
              { q: "What is a token?", choices: ["A single character", "A chunk of text (often a word piece) that the model processes as a unit", "A password"], answer: 1, explanation: "Tokens are sub-word units; that is why token counts rarely match word counts." },
              { q: "What competes for the context window?", choices: ["Only your question", "Prompt, attached content, conversation history and the generated answer", "Only the model's answer"], answer: 1, explanation: "Everything shares one budget — which is why long chats degrade without management." },
              { q: "Is feeding an entire document always better than feeding an excerpt?", choices: ["Yes, more context is always better", "No — relevant excerpts often beat bulk, and cost less", "It makes no difference"], answer: 1, explanation: "Signal beats volume: irrelevant context dilutes attention and inflates cost." },
              { q: "Why do costs rise on long conversations?", choices: ["The provider penalises long chats", "The whole history is re-sent as input on every turn", "Longer answers are charged double"], answer: 1, explanation: "Each turn re-processes the accumulated context — hence compaction and summarisation strategies." }
            ],
            micro_project: {
              title: "Cut your prompt in half",
              brief: "Take a real prompt you use and make it leaner without losing intent.",
              steps: [
                "Measure your original prompt in a tokenizer",
                "Rewrite it at roughly half the tokens, keeping the intent",
                "Run both versions and compare output quality",
                "Note which parts were pure filler"
              ],
              deliverable: "Both prompts with their token counts, the quality comparison, and what you learned about filler.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 45,
            sort_order: 20
          }
        ]
      },
      {
        slug: "prompting-that-delivers-en",
        title: "Prompting that delivers",
        summary: "From vague requests to reliable output: structure, examples, and iteration.",
        sort_order: 20,
        lessons: [
          {
            slug: "anatomy-of-a-good-prompt-en",
            title: "The anatomy of a prompt that works",
            intro: "A reliable prompt has four parts: role and context, the task stated precisely, the constraints (format, length, tone), and — when quality matters — an example of what good looks like. Vague in, vague out is not a joke, it is the mechanism.",
            why_important: "The gap between a beginner and an effective AI user is rarely the model; it is prompt structure. The same model produces throwaway text or genuinely useful work depending on how the request is framed, and that skill transfers across every tool you will ever use.",
            how_to_use: "Take a task you actually need done. Write the lazy one-line version, then the structured version with role, task, constraints and one example. Compare outputs honestly. Then iterate: tell the model precisely what was wrong rather than starting over — steering beats restarting.",
            objectives: [
              "Structure a prompt with role, task, constraints and example",
              "Steer a weak answer instead of restarting from zero",
              "Build a reusable prompt for a recurring task"
            ],
            resources: [
              { label: "Anthropic — Prompt engineering overview", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", kind: "doc", why: "The most practical, technique-by-technique guide from the model builders themselves.", how: "Apply one technique per day to real work rather than reading it all at once." },
              { label: "OpenAI Cookbook", url: "https://cookbook.openai.com/", kind: "repo", why: "Working examples and patterns you can adapt immediately.", how: "Find a recipe close to your use case and adapt it." },
              { label: "Prompt Engineering Guide — Techniques", url: "https://www.promptingguide.ai/techniques", kind: "doc", why: "Vendor-neutral coverage of zero-shot, few-shot and chain-of-thought.", how: "Read the few-shot section before the micro-project." }
            ],
            quiz: [
              { q: "What are the four parts of a reliable prompt?", choices: ["Role/context, task, constraints, example", "Greeting, question, thanks, signature", "Title, body, footer, link"], answer: 0, explanation: "Each part removes a category of ambiguity the model would otherwise fill on its own." },
              { q: "Your first answer is mediocre. What is usually better?", choices: ["Start a brand-new chat and hope", "Tell the model precisely what was wrong and iterate", "Switch model immediately"], answer: 1, explanation: "Steering uses the context you already built; restarting throws it away." },
              { q: "What does few-shot prompting mean?", choices: ["Asking very short questions", "Providing examples of the desired input/output in the prompt", "Limiting the answer length"], answer: 1, explanation: "Examples communicate format and standard far more efficiently than adjectives." },
              { q: "Why specify format and length explicitly?", choices: ["It is optional politeness", "Unstated constraints get filled by the model's defaults, not your needs", "It reduces cost only"], answer: 1, explanation: "Anything you leave unsaid, the model decides for you." }
            ],
            micro_project: {
              title: "Your reusable prompt template",
              brief: "Turn a recurring task into a prompt template you will actually reuse.",
              steps: [
                "Pick a task you repeat (summaries, outlines, code review, replies)",
                "Write the lazy version and the structured version",
                "Iterate three times, steering rather than restarting",
                "Save the final version as a template with placeholders"
              ],
              deliverable: "Your template with placeholders, the before/after comparison, and what iteration improved.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 50,
            sort_order: 10
          },
          {
            slug: "verify-and-avoid-hallucinations-en",
            title: "Verification: working with a confident machine",
            intro: "The model will state falsehoods with the same tone it states facts. That is not a bug you can prompt away entirely — it is a property you design around. Verification is a workflow, not an afterthought.",
            why_important: "One unverified hallucination published in your work costs more credibility than ten AI-assisted wins earn. Professionals are not the ones who avoid AI; they are the ones who have a verification habit.",
            how_to_use: "Adopt three habits: ask for sources and check them yourself (links are hallucinated too), cross-check consequential claims against a primary source, and mark AI-generated claims in your drafts until verified. For anything numeric, legal or medical, treat AI output as a draft to verify — never as a source.",
            objectives: [
              "Identify which claims require verification",
              "Apply a three-step verification habit",
              "Decide when AI output must never be used unverified"
            ],
            resources: [
              { label: "Anthropic — Reducing hallucinations", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations", kind: "doc", why: "Concrete techniques to lower hallucination rates in your own prompts.", how: "Apply the grounding technique to a task where accuracy matters." },
              { label: "Google Scholar", url: "https://scholar.google.com/", kind: "tool", why: "For claims that need a primary source rather than a plausible summary.", how: "Verify one AI-provided claim against the actual paper." },
              { label: "Prompt Engineering Guide — Risks", url: "https://www.promptingguide.ai/risks", kind: "doc", why: "A clear catalogue of failure modes to recognise in the wild.", how: "Read the factuality section before shipping AI-assisted work." }
            ],
            quiz: [
              { q: "Can links provided by a model be fabricated?", choices: ["No, links are always real", "Yes — URLs and citations are generated like any other text", "Only on free plans"], answer: 1, explanation: "A plausible-looking URL is exactly the kind of thing next-token prediction produces well." },
              { q: "Which claims deserve verification first?", choices: ["Stylistic choices", "Numbers, names, dates, legal and medical statements", "Formatting decisions"], answer: 1, explanation: "Consequential, checkable facts are where hallucination does real damage." },
              { q: "What is grounding?", choices: ["Turning the model off", "Providing the source material so the answer is based on it", "Shortening the prompt"], answer: 1, explanation: "Giving the model the actual text to work from dramatically reduces invention." },
              { q: "What is the professional stance on AI output?", choices: ["Publish as-is to move fast", "Treat it as a draft to verify, especially on consequential claims", "Never use AI at all"], answer: 1, explanation: "Speed with verification is the combination that compounds; speed without it destroys trust." }
            ],
            micro_project: {
              title: "Your verification checklist",
              brief: "Build the habit that protects your credibility.",
              steps: [
                "Take an AI-generated piece of work relevant to your project",
                "List every checkable claim it contains",
                "Verify three of them against primary sources and record the result",
                "Write your personal verification checklist"
              ],
              deliverable: "Your list of claims, the three verifications with outcomes (including anything the model got wrong), and your checklist.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 50,
            sort_order: 20
          }
        ]
      },
      {
        slug: "your-ai-workflow-en",
        title: "Build your AI workflow",
        summary: "Turn scattered prompting into a repeatable system that moves your project forward.",
        sort_order: 30,
        lessons: [
          {
            slug: "ai-in-your-real-workflow-en",
            title: "Putting AI where it actually pays",
            intro: "AI pays off in specific places: first drafts, structured extraction, code review, translation, brainstorming against your own constraints. It costs you where judgement, taste and accountability live. Mapping your own work against that line is the whole lesson.",
            why_important: "People either use AI for everything (and produce generic work) or for nothing (and lose hours). The winners map their tasks deliberately: delegate the mechanical, keep the judgement — that is what turns a chat toy into leverage on your project.",
            how_to_use: "List your recurring project tasks for one week. Mark each one delegate, assist or keep. Then build one small AI-assisted routine for your top delegate task and run it for real — a template plus a verification step, nothing fancy.",
            objectives: [
              "Map tasks into delegate / assist / keep",
              "Build one repeatable AI-assisted routine",
              "Measure the time it actually saves"
            ],
            resources: [
              { label: "Anthropic — Use cases", url: "https://docs.anthropic.com/en/docs/about-claude/use-case-guides", kind: "doc", why: "Concrete, structured patterns you can lift into your own workflow.", how: "Find the guide closest to your task and adapt its structure." },
              { label: "DeepLearning.AI short courses", url: "https://www.deeplearning.ai/short-courses/", kind: "doc", why: "Free, focused courses on applied AI workflows taught by practitioners.", how: "Pick one short course matching your project domain." },
              { label: "Claude", url: "https://claude.ai/", kind: "tool", why: "Your working environment for the routine you are about to build.", how: "Save your routine as a reusable project or template." }
            ],
            quiz: [
              { q: "Which task type is the best AI delegation candidate?", choices: ["Final accountability for a decision", "Mechanical, repetitive, rule-describable work", "Anything you personally enjoy"], answer: 1, explanation: "Delegate the mechanical; keep the judgement — accountability never transfers." },
              { q: "What happens when everything is delegated to AI?", choices: ["Maximum productivity", "Generic output with no personal signal", "Lower costs only"], answer: 1, explanation: "Without your judgement and voice, the output is indistinguishable from anyone else's." },
              { q: "What makes a routine repeatable?", choices: ["Doing it differently each time", "A saved template plus a verification step", "Using a different model each time"], answer: 1, explanation: "Template plus verification is the minimum viable system — everything else is decoration." },
              { q: "How do you know a routine is worth keeping?", choices: ["It feels modern", "You measure the time saved and the quality held", "Someone on social media recommended it"], answer: 1, explanation: "Measured time saved at equal quality is the only honest test." }
            ],
            micro_project: {
              title: "Your first AI routine, running",
              brief: "Ship one repeatable AI-assisted routine for your project and measure it.",
              steps: [
                "Map one week of recurring tasks as delegate / assist / keep",
                "Pick the top delegate task and build the routine (template + verification)",
                "Run it for real at least three times",
                "Measure time saved and quality held"
              ],
              deliverable: "Your task map, the routine template, and your measured results after three real runs.",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 55,
            sort_order: 10
          },
          {
            slug: "ship-something-with-ai-en",
            title: "Ship something real with AI this week",
            intro: "Knowledge that never ships evaporates. This final lesson closes the loop: you take your own project, pick one concrete deliverable, and produce it end to end with AI assistance — verification included — then connect it back to your project cockpit.",
            why_important: "On TakaCode the project is the product; the track is the accelerator. A finished deliverable proves the skill landed, gives you something to show, and moves your project one real step closer to being live and earning.",
            how_to_use: "Choose a deliverable you can finish in one sitting: a landing page section, a specification, a set of product descriptions, an outreach sequence, a code module. Use everything from this track: structured prompt, iteration, verification. Then ship it into your actual project and record what AI accelerated and what it could not do.",
            objectives: [
              "Produce one real deliverable with AI assistance",
              "Apply structured prompting, iteration and verification together",
              "Connect the result to your project"
            ],
            resources: [
              { label: "Your TakaCode project cockpit", url: "https://takacode.vercel.app/dashboard", kind: "tool", why: "Your track exists to move this project forward — that is where the deliverable lands.", how: "Attach the result and update your project status." },
              { label: "Anthropic — Prompt library", url: "https://docs.anthropic.com/en/prompt-library/library", kind: "doc", why: "Ready-made prompts to adapt for your specific deliverable.", how: "Find the closest prompt and adapt it rather than starting blank." },
              { label: "Claude", url: "https://claude.ai/", kind: "tool", why: "Where you will actually do the work.", how: "Work in one focused session, iterating rather than restarting." }
            ],
            quiz: [
              { q: "Why finish a real deliverable rather than more exercises?", choices: ["Exercises are forbidden", "Shipped work proves the skill and advances your project", "It is faster to fake"], answer: 1, explanation: "On TakaCode every micro-project is a brick of your real project, not a throwaway drill." },
              { q: "What should the deliverable be scoped to?", choices: ["Something that takes months", "Something you can finish in one focused session", "Something impossible on purpose"], answer: 1, explanation: "Small and finished beats large and abandoned — momentum is the asset." },
              { q: "What must accompany AI-assisted deliverables?", choices: ["Nothing", "Verification of consequential claims", "A public apology"], answer: 1, explanation: "The verification habit from module two applies to everything you ship." },
              { q: "Where does the deliverable go?", choices: ["In a folder nobody opens", "Into your real project, tracked in your cockpit", "Deleted after review"], answer: 1, explanation: "Idea to project to build to publish to cash — every step must land in the project." }
            ],
            micro_project: {
              title: "Ship it",
              brief: "Produce and ship one real deliverable for your project, AI-assisted end to end.",
              steps: [
                "Choose a deliverable finishable in one session",
                "Produce it using structured prompting and iteration",
                "Verify every consequential claim",
                "Ship it into your project and update your cockpit"
              ],
              deliverable: "The deliverable itself (or its link), what AI accelerated, what it could not do, and how your project moved forward.",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 60,
            sort_order: 20
          }
        ]
      }
    ]
  },
  {
    track: {
      slug: "digital-products-en",
      locale: "en",
      counterpart_slug: "produits-digitaux",
      goal_key: "digital_business",
      title: "Digital Products: Build and Sell",
      summary: "Ebooks, templates, mini-courses: build once, sell repeatedly — the shortest path from skill to first revenue.",
      description:
        "TakaCode's Build-to-Earn track for an international audience. You pick a digital product that matches your skills, validate demand before you build anything, produce it with AI as your assistant, then set up your storefront on Gumroad, Lemon Squeezy or Stripe, write a sales page that converts, price it without underselling yourself, and launch. Every micro-project is a piece of your actual product: by the end, your store is live and your first-revenue plan is running in your project cockpit.",
      level_label: "Beginner",
      duration_weeks: 4,
      accent_color: "#F59E0B",
      icon: "lucide:package",
      objective: "Put your first digital product on sale and earn your first revenue.",
      resources: ["Gumroad", "Lemon Squeezy", "Stripe", "Canva"],
      next_session: "Thursday 7:00 PM",
      next_steps: [
        { label: "Choose your product", state: "current" },
        { label: "Build it with AI", state: "locked" },
        { label: "Launch and earn", state: "locked" }
      ],
      sort_order: 210,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "choose-your-product-en",
        title: "Choose and validate your product",
        summary: "What sells, what fits your skills, and proof of demand before you build.",
        sort_order: 10,
        lessons: [
          {
            slug: "digital-product-landscape-en",
            title: "The digital product landscape",
            intro: "A digital product is built once and sold indefinitely: no stock, no shipping, near-total margin. Ebooks and guides, templates (Notion, Canva, code), mini-courses, presets, small tools — each family has its own effort profile, price range and natural sales channel.",
            why_important: "Choosing the product TYPE before you build prevents the classic mistake: two months spent on something nobody was waiting for. Marketplaces are a free market study — the bestsellers tell you what people actually pay for, at what price, with what promise.",
            how_to_use: "Browse Gumroad's discover section, the Notion template gallery and a few creator storefronts. For five products that clearly sell, record the type, price, promise and the precise problem solved. Look for the gap you could fill.",
            objectives: [
              "Name the main families of digital products and their price ranges",
              "Explain the economics: build once, sell many",
              "Identify what already sells in your area of interest"
            ],
            resources: [
              { label: "Gumroad", url: "https://gumroad.com/", kind: "tool", why: "The reference marketplace for independent digital products, with a public discover section.", how: "Browse Discover and record five products that sell in a niche you care about." },
              { label: "Notion template gallery", url: "https://www.notion.com/templates", kind: "doc", why: "Thousands of templates, free and paid — an entire market to observe.", how: "Study the top paid templates: what problem does each one solve?" },
              { label: "Lemon Squeezy", url: "https://www.lemonsqueezy.com/", kind: "tool", why: "Merchant-of-record platform popular with software and tech-adjacent products.", how: "Compare its storefronts with Gumroad's to see positioning differences." }
            ],
            quiz: [
              { q: "What is the core economic advantage of a digital product?", choices: ["Built once, sold indefinitely with no stock", "It is free to produce", "It always sells for more than physical goods"], answer: 0, explanation: "No stock, no shipping, near-total margin — that is the entire leverage." },
              { q: "Which of these is NOT a digital product?", choices: ["A Notion template", "One-to-one hourly coaching", "A PDF guide"], answer: 1, explanation: "Coaching sells your time and does not duplicate; a digital product sells without you." },
              { q: "Why study marketplaces before building?", choices: ["To clone a product exactly", "To see what genuinely sells, at what price, with what promise", "It is legally required"], answer: 1, explanation: "Bestsellers are proven demand and a price benchmark — a free market study." },
              { q: "Which product is the best starting point?", choices: ["A ten-hour video course", "A focused template or short guide solving ONE precise problem", "A full software platform"], answer: 1, explanation: "Start small: a simple entry product proves you can sell before you invest weeks." }
            ],
            micro_project: {
              title: "Your rapid market study",
              brief: "Observe what already sells to find your opening.",
              steps: [
                "Pick two marketplaces relevant to your interests",
                "Record five products that sell: type, price, promise",
                "Note the precise problem each one solves",
                "Identify the gap or angle you could own"
              ],
              deliverable: "Your five-product study (type, price, promise, problem) and the opening you identified.",
              validation: "ai"
            },
            xp_reward: 50,
            duration_minutes: 40,
            sort_order: 10
          },
          {
            slug: "validate-before-you-build-en",
            title: "Validate demand before you build",
            intro: "The golden rule of digital products: build nothing until you have a demand signal. A waitlist page, a handful of real conversations or a pre-sale tells you in one week what two months of building cannot guarantee.",
            why_important: "Most products that fail to sell were built without validation. A five-dollar pre-order is worth more than a hundred polite compliments: people vote with their card, not with their encouragement.",
            how_to_use: "Stand up a minimum validation in about two hours: a simple page describing the promise, the outline and the price, with either a pre-order button (Stripe Payment Links or Gumroad pre-order) or an interest form (Tally). Share it with twenty people in your target audience and count real signals only.",
            objectives: [
              "Build a validation page in under two hours",
              "Distinguish real signals from polite ones",
              "Decide objectively: build, pivot or drop"
            ],
            resources: [
              { label: "Stripe Payment Links", url: "https://stripe.com/payment-links", kind: "tool", why: "A payment link in five minutes with no website — ideal for a pre-sale test.", how: "Create a low-price pre-order link for your product idea." },
              { label: "Tally", url: "https://tally.so/", kind: "tool", why: "The simplest free way to collect interest emails and qualifying answers.", how: "Build a two-question 'notify me at launch' form." },
              { label: "Carrd", url: "https://carrd.co/", kind: "tool", why: "A one-page site in minutes for your validation landing page.", how: "Promise, three benefits, outline, price, call to action — nothing more." }
            ],
            quiz: [
              { q: "Which validation signal is most reliable?", choices: ["Likes on a post", "A payment or pre-order", "A friend saying 'great idea'"], answer: 1, explanation: "People vote with their card; everything else is politeness." },
              { q: "How long should minimum validation take?", choices: ["Two months", "About two hours to set up, one week to gather signals", "One hour per year"], answer: 1, explanation: "Fast and cheap is the entire point compared with building blind." },
              { q: "What must the validation page contain?", choices: ["The promise, outline, price and a call to action", "Your full CV", "The finished product for download"], answer: 0, explanation: "You are validating the PROMISE and the PRICE — the product does not exist yet." },
              { q: "Twenty targeted shares produce no pre-orders. What now?", choices: ["Build it anyway, they are wrong", "Pivot the promise, price or audience and retest", "Give up on digital products entirely"], answer: 1, explanation: "A no from the market is information, not a verdict — adjust and retest." }
            ],
            micro_project: {
              title: "Your validation page, live",
              brief: "Stand up your minimum validation and gather real signals.",
              steps: [
                "Write the promise and outline (AI first draft, then your voice)",
                "Build the page or form (Carrd, Tally, or Gumroad pre-order)",
                "Share with at least ten people in your target audience",
                "Count real signals and make your call"
              ],
              deliverable: "Your validation page link, how many people you reached, the signals you got, and your decision.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 65,
            duration_minutes: 55,
            sort_order: 20
          }
        ]
      },
      {
        slug: "build-and-sell-en",
        title: "Build it, price it, launch it",
        summary: "Produce with AI, set up your store, write the page, and run a real launch.",
        sort_order: 20,
        lessons: [
          {
            slug: "build-with-ai-en",
            title: "Build your product with AI",
            intro: "Whether it is a guide, a template or a mini-course, the method is the same: AI produces structure and first drafts, you bring the examples, the experience and the standard. Eighty percent volume from the machine, twenty percent from you — and that twenty percent is what people actually pay for.",
            why_important: "Buyers spot a one-prompt PDF instantly: generic, padded, no lived experience. What sells is actionable material with real examples and a voice. It is also what prevents refunds and bad reviews.",
            how_to_use: "Four passes: co-write a detailed outline from your validated promise; generate a first draft section by section and rewrite each with your own examples; run an editing pass where AI improves rhythm while keeping your voice; then lay it out cleanly in Canva and export.",
            objectives: [
              "Structure the product around one problem and one outcome",
              "Apply the 80/20 rule: AI produces, you embody",
              "Lay out a professional deliverable"
            ],
            resources: [
              { label: "Claude", url: "https://claude.ai/", kind: "tool", why: "Strong at outlines, drafts and editorial passes that preserve your voice.", how: "Give it your validated promise and ask for an action-oriented outline." },
              { label: "Canva", url: "https://www.canva.com/", kind: "tool", why: "Hundreds of ebook and course templates: cover, contents, page layouts.", how: "Start from a template, apply your colours, export a high-quality PDF." },
              { label: "Notion", url: "https://www.notion.com/", kind: "tool", why: "If your product is a template, this is where you build and share it by duplication.", how: "Clean your system, remove personal data, enable duplication sharing." }
            ],
            quiz: [
              { q: "What gives a paid guide its value?", choices: ["Its page count", "The precise problem it solves, with real examples and a method", "Its cover design alone"], answer: 1, explanation: "People buy an outcome, not volume: thirty actionable pages beat two hundred padded ones." },
              { q: "What signals a one-prompt product?", choices: ["Concrete personal examples", "Generic, padded text with no lived experience or opinion", "A clear table of contents"], answer: 1, explanation: "That is exactly what the 80/20 rule corrects: AI supplies material, you supply experience." },
              { q: "What is the correct production order?", choices: ["Layout first, content later", "Outline, section drafts rewritten, editing pass, then layout", "Everything at once with no outline"], answer: 1, explanation: "Structure locks the shape, rewriting adds your voice, layout comes last." },
              { q: "Why have a target reader review it before launch?", choices: ["Politeness", "To confirm it is actionable for someone who truly has the problem", "It is unnecessary if AI reviewed it"], answer: 1, explanation: "AI checks form; only a real target reader checks that the promise is kept." }
            ],
            micro_project: {
              title: "Your product's first chapter",
              brief: "Produce the full outline and one finished section of your product.",
              steps: [
                "Co-write the outline from your validated promise",
                "Draft the first section, then rewrite it with your examples",
                "Run an AI editing pass that preserves your voice",
                "Lay out that section (cover plus a few pages)"
              ],
              deliverable: "Your full outline plus the finished first section (paste the text and describe the layout, or share a link).",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 60,
            sort_order: 10
          },
          {
            slug: "store-page-and-price-en",
            title: "Store, sales page and price",
            intro: "Three decisions decide whether your product earns: where you sell it, how you argue for it, and what you charge. Merchant-of-record platforms like Gumroad and Lemon Squeezy handle international VAT and sales tax for you — which is why they are the sane starting point.",
            why_important: "A good product with a lazy page and a fearful price earns nothing. The sales page is the most profitable asset you own: every hour invested there pays on every future sale. And underpricing does not reassure buyers, it worries them.",
            how_to_use: "Pick your platform on four criteria: fees, tax handling (merchant of record or not), features (emails, discounts, affiliates) and simplicity. Then write the page in seven blocks: promise headline, the problem in your audience's words, what the product contains, concrete benefits, proof, objection-answering FAQ, price and guarantee. Price from value and comparable products — and use a time-limited launch offer rather than a permanently slashed price.",
            objectives: [
              "Choose a platform on fees, tax handling and features",
              "Write a seven-block sales page",
              "Price from value, not from fear"
            ],
            resources: [
              { label: "Gumroad", url: "https://gumroad.com/", kind: "tool", why: "Fastest start: merchant of record, storefront live in minutes.", how: "Create your store, then draft your product page there." },
              { label: "Lemon Squeezy", url: "https://www.lemonsqueezy.com/", kind: "tool", why: "Merchant of record with licensing and subscription options for software-like products.", how: "Compare fees and features against Gumroad for YOUR product." },
              { label: "Stripe", url: "https://stripe.com/", kind: "tool", why: "Maximum flexibility and lowest fees — but you handle tax compliance yourself.", how: "Consider it once volume justifies the extra responsibility." }
            ],
            quiz: [
              { q: "What does a merchant of record do for you?", choices: ["Builds your product", "Handles VAT/sales tax compliance on your behalf", "Runs your marketing"], answer: 1, explanation: "That is the key administrative simplification when selling internationally." },
              { q: "What is the difference between a feature and a benefit?", choices: ["None", "A feature describes the product; a benefit describes the buyer's outcome", "A benefit is the price"], answer: 1, explanation: "'50 pages' is a feature; 'the exact plan to launch in 30 days' is a benefit." },
              { q: "What is the most common pricing mistake for beginners?", choices: ["Charging far too much", "Charging too little out of fear", "Not displaying a price"], answer: 1, explanation: "Floor pricing attracts bargain hunters, worries real buyers and funds nothing." },
              { q: "Launch offer or permanent discount?", choices: ["Permanent discount forever", "Time-limited launch offer, then the normal price", "Never any offer"], answer: 1, explanation: "Honest launch urgency rewards early buyers; permanent discounting destroys perceived value." }
            ],
            micro_project: {
              title: "Your store and sales page, published",
              brief: "Set up your store and publish the page that will sell your product.",
              steps: [
                "Compare three platforms on the four criteria and choose",
                "Write the seven blocks (AI draft, rewritten in your audience's words)",
                "Create three visuals (cover, preview, banner)",
                "Set your price and launch offer, then publish the page"
              ],
              deliverable: "Your published page link, your platform choice with justification, and your price with a three-sentence rationale.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 70,
            duration_minutes: 65,
            sort_order: 20
          },
          {
            slug: "launch-and-first-revenue-en",
            title: "Launch, measure, earn",
            intro: "A launch is not one post on the day: it is a week-long sequence that warms your audience before the doors open. Then content keeps selling in the background, numbers tell you what to fix, and your first revenue proves the whole system works.",
            why_important: "The same product posted once makes three sales; launched as a sequence it makes thirty. And once it sells, three numbers — visitors, conversion rate, average order value — tell you exactly where the next improvement lives.",
            how_to_use: "Run the seven-day sequence: tease the problem, show the build, announce with promise and time, open with the launch offer, share proof, remind before the offer ends. Publish where your audience already is. After launch, track your three numbers weekly, pick ONE improvement, collect reviews, and declare your first revenue in your project cockpit.",
            objectives: [
              "Plan and run a seven-day launch sequence",
              "Track visitors, conversion and average order value",
              "Declare first revenue and plan the next product"
            ],
            resources: [
              { label: "Product Hunt", url: "https://www.producthunt.com/", kind: "tool", why: "The reference launch venue for tools and tech-adjacent products.", how: "Study three successful launches in your category before yours." },
              { label: "ConvertKit", url: "https://convertkit.com/", kind: "tool", why: "Email is still the highest-converting launch channel; the free tier is enough to start.", how: "Import your validation-page emails and write the launch sequence." },
              { label: "Your TakaCode project cockpit", url: "https://takacode.vercel.app/dashboard", kind: "tool", why: "Your store IS your project: track the path to first revenue here.", how: "Add your store link, set the revenue model, and declare your first revenue when it lands." }
            ],
            quiz: [
              { q: "Why a sequence instead of a single post?", choices: ["To spam people", "Because an audience needs warming: launch day converts attention you already built", "There is no difference"], answer: 1, explanation: "Teasing, build-in-public and proof create the anticipation that opening day converts." },
              { q: "Which three numbers should you track weekly?", choices: ["Followers, likes, shares", "Page visitors, conversion rate, average order value", "Only total revenue"], answer: 1, explanation: "Together they localise the problem: no visitors means channel; visitors without sales means page or price." },
              { q: "Why ask every buyer for a review?", choices: ["For your ego", "Social proof feeds the page and lifts conversion", "It is pointless"], answer: 1, explanation: "Reviews are conversion fuel: each satisfied buyer attracts the next." },
              { q: "What do creators who last do after one product sells?", choices: ["Stop there", "Build a range: complementary products for the same audience", "Switch industry entirely"], answer: 1, explanation: "The same audience buys repeatedly: entry product, flagship, bundle." }
            ],
            micro_project: {
              title: "Launch and first-revenue dashboard",
              brief: "Run your launch and close the loop in your project cockpit.",
              steps: [
                "Write the six messages of your seven-day sequence",
                "Launch on the channels where your audience already is",
                "Record your three numbers and pick ONE improvement",
                "Update your project and declare first revenue when it lands"
              ],
              deliverable: "Your sequence, your live store link, your three numbers, and your next-product idea.",
              validation: "ai",
              requires_link: true
            },
            xp_reward: 75,
            duration_minutes: 60,
            sort_order: 30
          }
        ]
      }
    ]
  }
];

// Tant que la migration 20260720000000 n'est pas poussee, les colonnes locale
// et counterpart_slug n'existent pas : on seede sans elles pour ne pas bloquer,
// et la migration renseignera la locale ensuite (voir le fichier SQL).
let localeColumnsMissing = false;

async function upsertTrack(track) {
  const attempt = await supabase
    .from("learning_tracks")
    .upsert(track, { onConflict: "slug" })
    .select("id, slug")
    .single();

  if (!attempt.error) return attempt;
  if (!/locale|counterpart/i.test(attempt.error.message)) return attempt;

  localeColumnsMissing = true;
  const { locale, counterpart_slug, ...withoutLocale } = track;
  return supabase
    .from("learning_tracks")
    .upsert(withoutLocale, { onConflict: "slug" })
    .select("id, slug")
    .single();
}

async function main() {
  for (const { track, modules } of TRACKS) {
    const { data: trackData, error: trackError } = await upsertTrack(track);
    if (trackError) {
      console.error(`learning_tracks ${track.slug}:`, trackError.message);
      process.exit(1);
    }
    console.log(`Track "${trackData.slug}" OK (${trackData.id})`);

    for (const mod of modules) {
      const { lessons, ...moduleRow } = mod;
      const { data: moduleData, error: moduleError } = await supabase
        .from("track_modules")
        .upsert({ ...moduleRow, track_id: trackData.id, is_published: true }, { onConflict: "track_id,slug" })
        .select("id, slug")
        .single();
      if (moduleError) {
        console.error(`module ${mod.slug}:`, moduleError.message);
        process.exit(1);
      }
      for (const lesson of lessons) {
        const { error: lessonError } = await supabase
          .from("track_lessons")
          .upsert({ ...lesson, module_id: moduleData.id, is_published: true }, { onConflict: "module_id,slug" });
        if (lessonError) {
          console.error(`  lesson ${lesson.slug}:`, lessonError.message);
          process.exit(1);
        }
      }
      console.log(`  Module "${moduleData.slug}" OK (${lessons.length} lessons)`);
    }
  }

  // Lien croise : les parcours FR pointent vers leur equivalent EN.
  if (!localeColumnsMissing) {
    for (const { track } of TRACKS) {
      if (!track.counterpart_slug) continue;
      const { error } = await supabase
        .from("learning_tracks")
        .update({ counterpart_slug: track.slug })
        .eq("slug", track.counterpart_slug);
      if (error) console.error(`counterpart ${track.counterpart_slug}:`, error.message);
    }
  }

  console.log("\nEnglish tracks seeded. They are NOT translations: own resources, own angle.");
  if (localeColumnsMissing) {
    console.log(
      "\n⚠  Colonnes locale/counterpart_slug absentes : contenu seede sans elles.\n" +
      "   Applique supabase/migrations/20260720000000_track_locale.sql (supabase db push),\n" +
      "   puis relance ce script pour renseigner locale='en' et les liens croises."
    );
  }
}

await main();
