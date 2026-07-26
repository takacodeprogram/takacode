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
  },
  {
    track: {
      slug: "full-vibe-coding-en",
      locale: "en",
      counterpart_slug: "full-vibe-coding",
      goal_key: "vibe_coding",
      title: "Full Vibe Coding",
      summary: "Ship a real project online with AI writing the code — you stay the director, not the developer.",
      description:
        "Vibe coding is not about learning to code, it is about learning to direct AI agents that write code for you. You will pick the AI stack that fits your project (Claude Code, Cursor, Bolt, v0, Lovable), learn to scope a project so an AI can actually deliver it, iterate quickly without breaking your app, and publish a real version online. The bar is not a toy demo: by the end of the track, real users can visit the URL and use the thing.",
      level_label: "Beginner",
      duration_weeks: 6,
      accent_color: "#4F8EF7",
      icon: "lucide:sparkles",
      objective: "Ship one real, live product built entirely with AI-directed coding.",
      resources: ["Claude Code", "Cursor", "Lovable", "Bolt.new", "Vercel"],
      next_session: "Wednesday 6:00 PM",
      next_steps: [
        { label: "Pick your AI stack", state: "current" },
        { label: "Frame and iterate", state: "locked" },
        { label: "Ship it live", state: "locked" }
      ],
      sort_order: 210,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "pick-your-ai-stack-en",
        title: "Pick your AI coding stack",
        summary: "The tools decide half the outcome — choose the ones that match your project shape and skill.",
        sort_order: 10,
        lessons: [
          {
            slug: "vibe-coding-landscape-en",
            title: "The vibe coding landscape in 2026",
            intro: "Vibe coding tools fall into three families: chat-first agents that live in your terminal or IDE (Claude Code, Cursor, Codex), one-shot app generators (Lovable, Bolt, v0), and hybrid platforms that mix a visual builder with AI editing. Each optimises for a different phase — exploration, first draft, or ongoing maintenance.",
            why_important: "Picking the wrong tool for the stage you are in wastes weeks. A one-shot generator is unbeatable to get a working shell in an hour, but painful to maintain once your app has real logic. A terminal agent is powerful for real work but overwhelming when you just want to see something on screen. Understanding the split lets you pick deliberately instead of following hype.",
            how_to_use: "Read Anthropic's Claude Code documentation and Lovable's launch guide back to back. Notice what each one is proud of and what each one avoids talking about — that is a good signal for its strengths and limits. Then map your own project idea to the family that fits it today.",
            objectives: [
              "Name the three families of vibe coding tools and one strength of each",
              "Describe when a one-shot generator beats an agent, and vice versa",
              "Pick a stack for your own project and defend the choice in one paragraph"
            ],
            resources: [
              { label: "Claude Code — Introduction", url: "https://docs.claude.com/en/docs/claude-code/overview", kind: "doc", why: "The reference agent that runs in your terminal and can touch your whole repo.", how: "Read the overview and the getting-started, ignore the advanced flags for now." },
              { label: "Lovable — Docs", url: "https://docs.lovable.dev/", kind: "doc", why: "The reference one-shot app generator for full-stack apps.", how: "Skim what it can and cannot do so you know when to reach for it." },
              { label: "Cursor — Getting started", url: "https://docs.cursor.com/en/get-started/introduction", kind: "doc", why: "The reference AI-first IDE, popular with people who want to see the code.", how: "Read the intro and note how it differs from a pure agent workflow." }
            ],
            quiz: [
              { q: "Which tool family is best to get a working shell of an app in under an hour?", choices: ["A terminal agent like Claude Code", "A one-shot generator like Lovable or Bolt", "A visual page builder"], answer: 1, explanation: "One-shot generators are optimised for producing a full first draft — perfect for exploration." },
              { q: "Which tool family is best for iterating on a codebase over months?", choices: ["A one-shot generator", "An agent or AI-first IDE that reads and edits your repo", "A no-code form builder"], answer: 1, explanation: "Long-term maintenance needs a tool that operates on the actual code, not a black-box regeneration." },
              { q: "Vibe coding means…", choices: ["Never looking at code", "Directing AI to write and modify code while you own the product decisions", "Copy-pasting Stack Overflow"], answer: 1, explanation: "You stay the director; the AI is the developer — you still own scope, priorities and quality." },
              { q: "Is one tool always the right answer?", choices: ["Yes, pick one and commit", "No — most serious projects use one for the shell, another for ongoing work", "You need at least five"], answer: 1, explanation: "Different phases reward different tools; combining is normal, not indecisive." }
            ],
            micro_project: {
              title: "Stack pick, one page",
              brief: "Commit to a stack for your project in writing so future you cannot drift.",
              steps: [
                "Describe your project in three sentences",
                "Rate each tool family against your project (shell, iteration, deployment)",
                "Pick one primary tool and one backup",
                "Write one paragraph defending the choice"
              ],
              deliverable: "A one-page document with your project brief, the ratings, and your stack decision with rationale.",
              validation: "ai"
            },
            xp_reward: 50,
            duration_minutes: 45,
            sort_order: 10
          },
          {
            slug: "your-first-vibe-session-en",
            title: "Your first productive vibe session",
            intro: "A good vibe session is not 'chat until something works'. It has a goal, a small change surface, a test, and a rollback path. Once you internalise that loop, you go from fighting the AI to steering it — and the difference in output quality is enormous.",
            why_important: "Most vibe coding disappointments come from asking for too much at once. The AI does something plausible, breaks two other things silently, and by the tenth message you cannot remember what state the app is in. A tight loop with small changes and immediate verification is the single habit that separates people who ship from people who abandon.",
            how_to_use: "Open your chosen tool and run one small session on a throwaway project. Follow the loop deliberately: state the goal, describe the smallest possible change, ask the AI to make it, run and verify, commit. Then journal what worked and what tripped you up — those notes are your personal playbook.",
            objectives: [
              "Run a session using the goal → small change → verify → commit loop",
              "Recover cleanly when the AI breaks something",
              "Journal three concrete lessons from the session"
            ],
            resources: [
              { label: "Claude Code — Best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", kind: "article", why: "Field-tested habits from the team that built the tool — worth reading twice.", how: "Read it before the session and again after; different sentences will hit each time." },
              { label: "Cursor — Working with agents", url: "https://docs.cursor.com/en/agent/overview", kind: "doc", why: "How to think about the agent loop when you can also touch the code yourself.", how: "Read once, then apply during the micro-project." },
              { label: "Git — Basic branching", url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging", kind: "doc", why: "You cannot recover cleanly from a bad AI edit without a working git baseline.", how: "Learn commit, branch, and reset — the rest can wait." }
            ],
            quiz: [
              { q: "What is the single most important habit in a vibe session?", choices: ["Longer prompts", "Small changes with immediate verification and commits", "Using multiple tools at once"], answer: 1, explanation: "Small verified changes preserve your ability to reason about the state of the app." },
              { q: "The AI breaks a working feature. What is the fastest recovery?", choices: ["Ask it to fix it in the same chat", "git checkout the last known-good commit and restart the change smaller", "Delete the project"], answer: 1, explanation: "Version control is your undo button; use it before spending an hour debugging a compounded mess." },
              { q: "Why journal after each session?", choices: ["Compliance", "You build a personal playbook of what works with your tool, model and project", "It looks good on LinkedIn"], answer: 1, explanation: "Your notes become the shortcut for every future session — much more valuable than generic tips." },
              { q: "How big should a single AI change be?", choices: ["As big as possible to save time", "The smallest change that moves you forward and can be verified in under two minutes", "Whatever the AI proposes"], answer: 1, explanation: "Small verified steps compound; big unverified steps corrupt state." }
            ],
            micro_project: {
              title: "Your first clean vibe session",
              brief: "Run a real session on a throwaway repo using the goal → change → verify → commit loop.",
              steps: [
                "Spin up a throwaway app in your chosen tool",
                "Pick one micro-goal (add a button, change a colour, wire an input)",
                "Run the loop three times, committing between each",
                "Write down three concrete lessons for future sessions"
              ],
              deliverable: "Link to the repo, three commits, and your three lessons in the README.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 60,
            sort_order: 20
          }
        ]
      },
      {
        slug: "frame-and-iterate-en",
        title: "Frame your project and iterate",
        summary: "How you describe the project and how you iterate on it determine what AI can build for you.",
        sort_order: 20,
        lessons: [
          {
            slug: "scope-your-mvp-en",
            title: "Scope the MVP an AI can actually finish",
            intro: "An AI can build almost anything, but not all at once. The projects that ship in six weeks have one clear user, one core action, and one honest success metric. The projects that die have a feature list and a vibe.",
            why_important: "Scope is where most solo projects fail before writing a line of code. When you hand a bloated brief to an AI you get a bloated app: half-working features everywhere, none convincing. A tight MVP forces you to pick what actually matters and makes every AI session sharper.",
            how_to_use: "Write your project as one sentence in the form 'X helps Y do Z in under N minutes'. If you cannot, keep cutting until you can. Then list the three screens the user absolutely needs and mark everything else as post-launch. That list is your brief for every future AI session.",
            objectives: [
              "State your project in one 'X helps Y do Z' sentence",
              "List the three must-have screens and cut the rest",
              "Define one measurable success signal for launch"
            ],
            resources: [
              { label: "Y Combinator — How to build an MVP", url: "https://www.ycombinator.com/library/6f-how-to-plan-an-mvp", kind: "article", why: "The most cited framework for scoping a first version — vendor-neutral and short.", how: "Read once with your idea in mind, then rewrite your brief in the YC format." },
              { label: "Basecamp — Shape Up (chapter 2)", url: "https://basecamp.com/shapeup/1.2-chapter-03", kind: "book", why: "Ryan Singer's approach to fixed-time, variable-scope projects — a natural fit for vibe coding.", how: "Read chapter 2 and 3, ignore the rest for now." },
              { label: "Marty Cagan — Discovery vs Delivery", url: "https://www.svpg.com/discovery-versus-delivery/", kind: "article", why: "Explains why solving the right problem beats shipping fast on the wrong one.", how: "Read once before you commit to your MVP scope." }
            ],
            quiz: [
              { q: "What is the shape of a scoping sentence that works?", choices: ["A feature list", "'X helps Y do Z in under N minutes'", "A vibe description"], answer: 1, explanation: "Users, outcome, and constraint — three unambiguous slots the AI can build against." },
              { q: "How many must-have screens for an MVP?", choices: ["One", "Around three", "As many as needed"], answer: 1, explanation: "One is usually too little to feel like a product, five is usually a second project pretending to be one." },
              { q: "What kills solo projects before shipping?", choices: ["Bad AI models", "Bloated scope disguised as ambition", "Slow internet"], answer: 1, explanation: "Ambition is fine; unscoped ambition compounds into an app that never quite works." },
              { q: "When do you add post-MVP features?", choices: ["Now, so you do not forget", "After the MVP is live and you have talked to real users", "Never"], answer: 1, explanation: "Post-MVP features cost you MVP quality if you build them first." }
            ],
            micro_project: {
              title: "The one-page project brief",
              brief: "Turn your idea into a brief tight enough to build against.",
              steps: [
                "Write the 'X helps Y do Z' sentence",
                "List the three must-have screens with one action each",
                "Cut everything else into a post-launch list",
                "Pick one success signal you will measure at launch"
              ],
              deliverable: "The one-page brief with sentence, screens, cut list, and success signal.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 60,
            sort_order: 10
          },
          {
            slug: "iterate-without-breaking-en",
            title: "Iterate fast without breaking your app",
            intro: "Every serious vibe-coded project reaches a moment where new changes silently break old features. The projects that survive have two habits: they commit often, and they use the AI to write a minimal test before each meaningful change.",
            why_important: "The reason 'vibe coding' still has a bad reputation in some circles is that people ship without tests, then panic when the app degrades. You do not need enterprise test coverage — you need one honest test per critical path, written by the AI, run automatically. That single habit turns your project from fragile to compoundable.",
            how_to_use: "Ask your AI to add one integration test for each of your three must-have screens. Wire them into your dev loop so a failing test blocks the change. Then work normally: when the AI proposes a change, ask it to run the tests first, and only commit when green.",
            objectives: [
              "Write one integration test per must-have screen with AI help",
              "Wire tests into your dev loop so failures block commits",
              "Recover a broken change cleanly using git and tests"
            ],
            resources: [
              { label: "Playwright — Getting started", url: "https://playwright.dev/docs/intro", kind: "doc", why: "The most vibe-coding-friendly end-to-end testing framework for web apps.", how: "Install, generate one test, understand the anatomy — the AI does the rest." },
              { label: "Kent C. Dodds — Testing trophy", url: "https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications", kind: "article", why: "A pragmatic view of what to test and what to skip when time is short.", how: "Read once and apply the priorities to your own app." },
              { label: "Vitest — Overview", url: "https://vitest.dev/guide/", kind: "doc", why: "Lighter alternative for unit-level checks, works well in modern JS stacks.", how: "Pick this or Playwright based on what your project needs — do not run both to start." }
            ],
            quiz: [
              { q: "How many tests do you need to start?", choices: ["Full 100% coverage", "One per critical path", "Zero — vibe coding is testing-free"], answer: 1, explanation: "Coverage is a distraction early; one test per screen catches the most painful regressions." },
              { q: "When do you run the tests?", choices: ["Before shipping to prod", "Before every commit — ideally after every AI change", "Once a week"], answer: 1, explanation: "Tests are only useful when they run so often that failures point at the last small change." },
              { q: "Who writes the tests?", choices: ["You, by hand", "The AI — you review and adjust", "A dedicated QA engineer"], answer: 1, explanation: "Vibe coding scales when the AI writes tests too; you become the reviewer." },
              { q: "The AI change breaks a test. What do you do?", choices: ["Delete the test", "Revert the change, ask the AI to fix the root cause, commit again", "Ship anyway and hope"], answer: 1, explanation: "The test is doing its job — respect it, or you lose the safety net you just built." }
            ],
            micro_project: {
              title: "Three tests, three green runs",
              brief: "Add one test per must-have screen and prove they run in your loop.",
              steps: [
                "Pick a testing framework (Playwright or Vitest)",
                "Ask the AI to write one integration test per must-have screen",
                "Run them locally and commit only when all green",
                "Break one screen on purpose, watch a test fail, then fix and re-run"
              ],
              deliverable: "Repo with three tests, a green run, and a screenshot of the deliberate red-then-green cycle.",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 75,
            sort_order: 20
          }
        ]
      },
      {
        slug: "ship-it-live-en",
        title: "Ship it live",
        summary: "A URL real people can visit — deployment, domain, and the first launch checklist.",
        sort_order: 30,
        lessons: [
          {
            slug: "deploy-to-vercel-en",
            title: "Deploy your app the vibe-friendly way",
            intro: "For a modern web app, deployment is not an event — it is a git push. Vercel, Netlify and Cloudflare Pages all give you a public URL in minutes from a GitHub repo. Pick one, wire it up, and never think about it again.",
            why_important: "Deployment procrastination is real: people polish forever because publishing feels scary. Getting your app live on a public URL early (even under a random subdomain) changes everything — you start thinking as an operator, not just a builder, and you can start showing it to real people.",
            how_to_use: "Push your repo to GitHub, import it in Vercel with two clicks, watch it deploy. Then wire a custom domain if you own one — most registrars now have a Vercel preset that takes minutes. From that moment, every push updates the live URL.",
            objectives: [
              "Push a repo to GitHub with a clean README",
              "Deploy it on Vercel via GitHub in under ten minutes",
              "Wire a custom domain with SSL"
            ],
            resources: [
              { label: "Vercel — Deploy a project", url: "https://vercel.com/docs/deployments/git", kind: "doc", why: "The reference on the git-to-URL pipeline that powers vibe coding shipping.", how: "Read the git-integration and custom-domain sections; skip the rest for now." },
              { label: "Netlify — Deploy a site", url: "https://docs.netlify.com/site-deploys/create-deploys/", kind: "doc", why: "Equivalent option, same idea — use it if you prefer Netlify's DX.", how: "Compare with Vercel and pick one; do not run both." },
              { label: "GitHub — Quickstart", url: "https://docs.github.com/en/get-started/quickstart", kind: "doc", why: "You cannot deploy from git without a working GitHub setup.", how: "Create an account and push one repo — done." }
            ],
            quiz: [
              { q: "How does modern deployment actually work?", choices: ["You upload files by FTP", "A push to your git branch triggers a build and a new live URL", "You email a zip to the hoster"], answer: 1, explanation: "Git-driven deployment is the standard; it enables preview URLs, rollbacks and shipping speed." },
              { q: "When should you deploy for the first time?", choices: ["When the app is perfect", "As early as possible, even to a random subdomain", "After you have paying users"], answer: 1, explanation: "Early deploys change your mindset from builder to operator and unblock feedback." },
              { q: "SSL certificates on Vercel/Netlify are…", choices: ["Manual and paid", "Automatic and free (Let's Encrypt)", "Optional"], answer: 1, explanation: "Both platforms provision certs automatically — one less thing to manage." },
              { q: "What blocks most first deploys?", choices: ["The platforms", "Missing environment variables and forgotten build commands", "Slow internet"], answer: 1, explanation: "Env vars and build scripts are the top-two culprits; document them in the README as you go." }
            ],
            micro_project: {
              title: "Your app on a public URL",
              brief: "Take your project from local to live in one afternoon.",
              steps: [
                "Push to GitHub with a real README",
                "Deploy on Vercel or Netlify via git",
                "Set the environment variables the app needs",
                "Verify the public URL from your phone"
              ],
              deliverable: "The live URL and a screenshot of the app running on your phone.",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 60,
            sort_order: 10
          },
          {
            slug: "launch-checklist-en",
            title: "Launch checklist and first users",
            intro: "A soft launch is not a marketing campaign; it is a controlled way of exposing your app to real users before you spend a euro on ads. The checklist matters less than the fact that you have one and follow it.",
            why_important: "Most first launches leak signal in the same three places: no analytics so you cannot see what happens, no clear call to action so users bounce, and no way for interested people to come back. Fixing these three before launch turns your first ten visitors from noise into learning.",
            how_to_use: "Wire Plausible or PostHog for basic analytics, put one obvious call to action above the fold, and add an email capture for people who are not ready. Then post in one or two small communities (indie hackers, subreddit) and watch what happens.",
            objectives: [
              "Ship analytics, one CTA, and one email capture before launch",
              "Post your app in two aligned communities with a real ask",
              "Interpret the first ten visitor sessions honestly"
            ],
            resources: [
              { label: "Plausible — Getting started", url: "https://plausible.io/docs", kind: "doc", why: "Privacy-friendly analytics with zero setup pain — ideal for a first launch.", how: "Add the script, verify one event fires, done." },
              { label: "Indie Hackers — Launching", url: "https://www.indiehackers.com/post/how-to-launch-your-product-a-detailed-guide-b96ce9c7fe", kind: "article", why: "Concrete launch playbook from someone who has run many.", how: "Adapt the checklist to your product; skip the parts that do not apply." },
              { label: "PostHog — Product analytics", url: "https://posthog.com/docs/getting-started", kind: "doc", why: "Alternative when you want session replay and funnels early.", how: "Choose between Plausible and PostHog; do not run both to start." }
            ],
            quiz: [
              { q: "What is the point of analytics on day one?", choices: ["Vanity metrics", "See what real users actually do vs. what you assumed", "SEO"], answer: 1, explanation: "The gap between assumed and observed behaviour is where your MVP learns." },
              { q: "How many primary calls to action per page?", choices: ["Three or more", "One clear one", "Zero, users will figure it out"], answer: 1, explanation: "One CTA compounds attention; multiple dilute it and slow decisions." },
              { q: "Why capture email even from bouncing users?", choices: ["Spam later", "So you can tell interested people when the product improves", "GDPR requirements"], answer: 1, explanation: "Warm re-engagement beats cold traffic — email is your second chance." },
              { q: "What is a healthy launch community fit?", choices: ["The biggest subreddit you find", "A small community where your target user actually spends time", "Whichever accepts self-promotion"], answer: 1, explanation: "Small aligned communities give real feedback; big generic ones give noise or bans." }
            ],
            micro_project: {
              title: "Ten real visitors report",
              brief: "Get your first ten real visitors and learn from what they actually did.",
              steps: [
                "Wire analytics, one CTA, and an email capture",
                "Post in two aligned communities with a specific ask",
                "Watch the first ten sessions",
                "Write one paragraph of what surprised you and what you will change"
              ],
              deliverable: "Screenshots of the analytics, the two posts, and your one-paragraph learning report.",
              validation: "ai"
            },
            xp_reward: 75,
            duration_minutes: 90,
            sort_order: 20
          }
        ]
      }
    ]
  },
  {
    track: {
      slug: "ai-automations-en",
      locale: "en",
      counterpart_slug: "automatisation-ia",
      goal_key: "automation_ai",
      title: "AI Automations & Chatbots",
      summary: "Automate the repetitive work and build an AI chatbot for WhatsApp or your site — then sell it as a service.",
      description:
        "Automation is one of the highest-leverage skills you can learn in 2026 — small businesses will pay real money to make their operations run without them. This track teaches you to think in automations (trigger → actions → outcome), build reliable workflows in n8n, and deploy an AI chatbot trained on your own content to WhatsApp and your website. The final module turns the skill into revenue: the automation you built for yourself becomes a productised service you can sell to real clients.",
      level_label: "Intermediate",
      duration_weeks: 4,
      accent_color: "#22D3EE",
      icon: "lucide:bot",
      objective: "Build one production automation and one deployed AI chatbot you can bill for.",
      resources: ["n8n", "Make", "OpenAI API", "WhatsApp Cloud API", "Zapier"],
      next_session: "Thursday 7:30 PM",
      next_steps: [
        { label: "Think in automations", state: "current" },
        { label: "Build with n8n", state: "locked" },
        { label: "Deploy your AI chatbot", state: "locked" }
      ],
      sort_order: 220,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "think-in-automations-en",
        title: "Think in automations",
        summary: "Before you touch a tool, learn to see triggers, actions and outcomes in the wild.",
        sort_order: 10,
        lessons: [
          {
            slug: "spot-what-to-automate-en",
            title: "Spot the tasks worth automating",
            intro: "Not every repetitive task deserves an automation. The ones that pay back are frequent, rule-based, and boring — with a clear input, a clear output, and a cost of manual error. Learn to recognise those and you will always have projects worth building.",
            why_important: "People burn weeks automating tasks they do once a month, then wonder why the ROI is negative. The framework is simple: automate what you already do the same way, multiple times a week, where a mistake has a cost. That filter alone separates useful automations from expensive toys.",
            how_to_use: "Log every repetitive task you do for one week — a spreadsheet is enough. For each, note frequency, time cost, and rule-based-ness. The tasks that score high on all three are your automation backlog. Pick the top one for this track.",
            objectives: [
              "Log one week of repetitive tasks with three attributes",
              "Score them on frequency, cost and rule-based-ness",
              "Pick one automation candidate you will build"
            ],
            resources: [
              { label: "Zapier — What to automate", url: "https://zapier.com/blog/best-things-to-automate/", kind: "article", why: "Practical lens on which categories of tasks are actually worth automating.", how: "Read once and map their examples to your own life." },
              { label: "Make — Use cases", url: "https://www.make.com/en/use-cases", kind: "article", why: "Real templates you can copy — good idea starter.", how: "Skim the categories closest to your work." },
              { label: "n8n — Templates library", url: "https://n8n.io/workflows/", kind: "repo", why: "Hundreds of open workflows to inspire your backlog.", how: "Search for your industry, note two you would build for yourself." }
            ],
            quiz: [
              { q: "What makes a task worth automating?", choices: ["It is boring", "Frequent, rule-based, and costly if done wrong", "It looks impressive on a resume"], answer: 1, explanation: "The three criteria protect you from investing in low-ROI automations that feel productive." },
              { q: "How often should the task happen to justify automation?", choices: ["Once ever", "Multiple times a week at minimum", "Once a year"], answer: 1, explanation: "Frequency multiplies your saved time — one-off tasks rarely pay back the build cost." },
              { q: "Non-rule-based tasks…", choices: ["Are the best to automate", "Rarely automate well and usually need a human loop", "Do not exist"], answer: 1, explanation: "Judgement calls resist automation; keep humans in the loop where discretion matters." },
              { q: "How do you pick your first project?", choices: ["The most complex one", "The highest score on frequency × cost × rule-based-ness", "Whatever the client wants first"], answer: 1, explanation: "Score-based selection removes ego from the equation and picks the automation that will actually pay back." }
            ],
            micro_project: {
              title: "Your automation backlog",
              brief: "Build a real backlog and commit to a first automation.",
              steps: [
                "Log every repetitive task for one week",
                "Score each on frequency, cost, and rule-based-ness (1–5)",
                "Rank the top five",
                "Pick the winner and write the one-sentence brief"
              ],
              deliverable: "The scored backlog and your one-sentence brief for the automation you will build.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 60,
            sort_order: 10
          },
          {
            slug: "map-the-workflow-en",
            title: "Map the workflow before you build it",
            intro: "The best automations are drawn on paper before they are built in a tool. A flow diagram forces you to name every trigger, every action, every branch — and reveals the surprises before you waste a day fighting a tool that is doing exactly what you asked.",
            why_important: "Building an automation without a diagram is like coding without a plan: you will make it work eventually, but through five times more debugging than needed. A diagram takes twenty minutes and saves you half a day per automation, forever.",
            how_to_use: "Take your chosen automation and draw it in FigJam, Excalidraw or on paper. One box per step. Arrows show data flow. Diamonds are decisions. Then trace one real example through it end to end and note every place the diagram is wrong or missing — before you touch a tool.",
            objectives: [
              "Draw a complete flow diagram for your chosen automation",
              "Trace one real example through it and mark gaps",
              "List every input, every output and every failure mode"
            ],
            resources: [
              { label: "Excalidraw", url: "https://excalidraw.com/", kind: "tool", why: "Fast, free, no account required — perfect for a quick flow diagram.", how: "Draw boxes for steps, diamonds for decisions, arrows for data." },
              { label: "Miro — Flow diagram basics", url: "https://miro.com/blog/how-to-create-flow-charts/", kind: "article", why: "Explains the standard symbols you will read in other people's diagrams.", how: "Read once, use only the four shapes you actually need." },
              { label: "n8n — Nodes reference", url: "https://docs.n8n.io/integrations/", kind: "doc", why: "Knowing which nodes exist lets you draw diagrams that map cleanly to real n8n workflows.", how: "Browse the categories relevant to your automation." }
            ],
            quiz: [
              { q: "Why diagram first?", choices: ["Because it looks professional", "It surfaces gaps and decisions before you spend hours in a tool", "It replaces the tool"], answer: 1, explanation: "The diagram is the cheapest place to make and fix mistakes." },
              { q: "What is a decision diamond?", choices: ["A step that runs unconditionally", "A branch based on a condition (yes/no or multi-way)", "A trigger"], answer: 1, explanation: "Diamonds isolate the yes/no choices your automation must make." },
              { q: "What is the value of tracing a real example?", choices: ["Documentation", "It exposes edge cases your abstract diagram missed", "Compliance"], answer: 1, explanation: "Real data is the fastest way to find the gaps your imagination missed." },
              { q: "When is the diagram 'done'?", choices: ["When it is pretty", "When one real example flows through it without missing steps or unclear decisions", "Never, always in flux"], answer: 1, explanation: "The bar is 'a stranger could build this from the diagram alone'." }
            ],
            micro_project: {
              title: "The buildable diagram",
              brief: "Produce a diagram tight enough to hand to a stranger.",
              steps: [
                "Draw the flow in Excalidraw or FigJam",
                "Trace one real example through it and note every gap",
                "Fix the diagram until the example flows cleanly",
                "List every failure mode you can imagine as a side note"
              ],
              deliverable: "The final diagram (PNG or link), the traced example, and the failure-mode list.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 60,
            sort_order: 20
          }
        ]
      },
      {
        slug: "build-with-n8n-en",
        title: "Build with n8n",
        summary: "n8n is the vibe-coding-friendly automation platform: open source, self-hostable, AI-native.",
        sort_order: 20,
        lessons: [
          {
            slug: "n8n-fundamentals-en",
            title: "n8n fundamentals in one lesson",
            intro: "n8n gives you a node-based canvas where triggers start workflows and nodes transform data. Once you understand triggers, nodes, expressions and the data structure that flows between them, you can build almost any automation you can diagram.",
            why_important: "n8n is the sweet spot between Zapier (easy but expensive at scale, locked ecosystem) and code (unlimited but slow to start). It is what most serious automation freelancers and small agencies use in 2026 — learning it is a direct path to paid client work.",
            how_to_use: "Sign up for n8n Cloud (free tier) or spin up a local instance with Docker. Follow the official quickstart to build a one-step workflow, then progressively add nodes matching your diagram. Watch the executions panel obsessively — the data you see is what your automation actually has to work with.",
            objectives: [
              "Explain triggers, nodes and expressions in your own words",
              "Build a two-node workflow that runs end to end",
              "Read the executions panel and debug from what you see"
            ],
            resources: [
              { label: "n8n — Quickstart", url: "https://docs.n8n.io/try-it-out/", kind: "doc", why: "The official first workflow in under ten minutes — the fastest way to learn the canvas.", how: "Do the quickstart in full before touching your own workflow." },
              { label: "n8n — Expressions", url: "https://docs.n8n.io/code/expressions/", kind: "doc", why: "Expressions are how you route data between nodes — the skill that unlocks 80% of use cases.", how: "Read once, then experiment with the ones from your diagram." },
              { label: "n8n — Data structure", url: "https://docs.n8n.io/data/data-structure/", kind: "doc", why: "Understanding the JSON array n8n passes between nodes stops the top-three beginner mistakes.", how: "Read before your first multi-node workflow." }
            ],
            quiz: [
              { q: "What starts an n8n workflow?", choices: ["A node", "A trigger", "A schedule expression only"], answer: 1, explanation: "Triggers (schedule, webhook, chat, file, etc.) start execution; nodes run afterwards." },
              { q: "What is an expression in n8n?", choices: ["A comment", "A snippet that reads or transforms data from other nodes", "A schema definition"], answer: 1, explanation: "Expressions are the JavaScript-flavoured mini-language that wires nodes together." },
              { q: "Where do you debug?", choices: ["Blindly", "The executions panel — it shows the actual data at each step", "In production only"], answer: 1, explanation: "n8n's biggest strength is that you can see the data flow through your workflow live." },
              { q: "n8n Cloud vs self-hosted?", choices: ["Cloud is always better", "Self-hosted is always better", "Cloud is faster to start; self-hosted is cheaper at scale and gives you more control"], answer: 2, explanation: "Both work; picking depends on your volume, budget and comfort with ops." }
            ],
            micro_project: {
              title: "Your first working n8n workflow",
              brief: "Build the first three nodes of your automation and see the data flow.",
              steps: [
                "Sign up for n8n Cloud or spin up locally",
                "Build the first three nodes of your automation",
                "Trigger it manually and inspect the executions panel",
                "Fix at least one thing you learned from the actual data"
              ],
              deliverable: "A screenshot of the workflow canvas and the executions panel with successful data.",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 90,
            sort_order: 10
          },
          {
            slug: "ship-the-automation-en",
            title: "Ship a production-ready automation",
            intro: "A workflow that runs once on your machine is a demo. A production automation runs on a schedule or a real trigger, has error handling, alerts you when it breaks, and stores just enough logs to diagnose problems next Tuesday.",
            why_important: "Every automation eventually breaks: an API changes, a token expires, a downstream service is down. The difference between a hobby project and a service you can charge for is that the paid one tells you before the client notices.",
            how_to_use: "Add error-handling branches to your workflow, wire a notification (email, Slack, WhatsApp) when a run fails, and add basic logging to a database or spreadsheet. Then run it on a schedule for a week and audit the executions — real usage reveals problems you did not imagine.",
            objectives: [
              "Add error handling and failure notifications to your workflow",
              "Log every run to a database or spreadsheet",
              "Run it on a schedule for a week and audit the executions"
            ],
            resources: [
              { label: "n8n — Error handling", url: "https://docs.n8n.io/flow-logic/error-handling/", kind: "doc", why: "Official patterns for catching and routing errors gracefully.", how: "Apply the error-workflow pattern from the docs to your own workflow." },
              { label: "n8n — Executions", url: "https://docs.n8n.io/workflows/executions/", kind: "doc", why: "How to inspect and re-run failed executions — essential for maintenance.", how: "Read before you run in production." },
              { label: "n8n — Community forum", url: "https://community.n8n.io/", kind: "community", why: "Every non-obvious edge case has been discussed there before.", how: "Search before you post; post when your search comes up empty." }
            ],
            quiz: [
              { q: "What is the minimum for 'production'?", choices: ["A workflow that runs once", "Scheduled or triggered, with error handling and failure alerts", "A workflow with tests"], answer: 1, explanation: "A production automation notifies you when it fails — that is the bar." },
              { q: "Why log every run?", choices: ["Compliance", "So you can diagnose failures without reproducing them live", "Vanity metrics"], answer: 1, explanation: "Past logs are the fastest debugging tool when a client reports something broke last week." },
              { q: "Should the workflow tell you when it fails?", choices: ["No, you will notice", "Yes, via email, Slack, WhatsApp or similar", "Only for critical steps"], answer: 1, explanation: "Silent failures are the number-one client complaint; alerts stop them." },
              { q: "How do you validate a production automation?", choices: ["Run it once and assume", "Run it on a schedule for a week and audit the executions", "Wait for a client complaint"], answer: 1, explanation: "A week of real runs surfaces edge cases no test would find." }
            ],
            micro_project: {
              title: "One production week",
              brief: "Run your automation as if a client depended on it for a week.",
              steps: [
                "Add error-handling and failure alerts",
                "Wire a run log to a database or Google Sheet",
                "Schedule it or expose the trigger",
                "Audit the executions after seven days and note every fix"
              ],
              deliverable: "Screenshots of alerts, the run log with real entries, and your audit notes.",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 90,
            sort_order: 20
          }
        ]
      },
      {
        slug: "ai-chatbot-en",
        title: "Deploy your AI chatbot",
        summary: "A chatbot trained on your content, deployed where your customers actually are (WhatsApp, your site).",
        sort_order: 30,
        lessons: [
          {
            slug: "rag-chatbot-basics-en",
            title: "The chatbot that knows your content",
            intro: "A generic ChatGPT wrapper is useless; a chatbot that answers using your own documentation is a product people pay for. The pattern is called retrieval-augmented generation (RAG): store your content in a vector database, retrieve the relevant chunks at query time, and pass them to the model as context.",
            why_important: "RAG is the underrated force multiplier of AI apps in 2026 — nearly every 'AI assistant' product a business buys is a RAG pipeline under the hood. Learning to build one lets you productise the pattern for any client vertical: real-estate FAQ, restaurant menu, medical practice booking rules.",
            how_to_use: "Pick a vector store (Supabase pgvector is enough), ingest your source content by chunking and embedding each piece, then wire a query flow that retrieves the top matches and hands them to the model. n8n has native nodes for all of this — you can prototype in a day.",
            objectives: [
              "Explain the RAG pattern in your own words",
              "Ingest a small corpus into a vector database",
              "Build a query flow that retrieves relevant chunks and answers with them"
            ],
            resources: [
              { label: "Supabase — pgvector", url: "https://supabase.com/docs/guides/ai", kind: "doc", why: "The simplest vector database to start with — Postgres you already know.", how: "Follow the intro tutorial with your own content." },
              { label: "n8n — AI Agent node", url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/", kind: "doc", why: "n8n's AI Agent node wires RAG in a few clicks.", how: "Read the tutorial, adapt to your corpus." },
              { label: "Pinecone — RAG explainer", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", kind: "article", why: "Vendor-neutral explanation of the pattern's mechanics.", how: "Read once for the mental model, then build." }
            ],
            quiz: [
              { q: "What does RAG stand for?", choices: ["Random Answer Generation", "Retrieval-Augmented Generation", "Rapid Application Generation"], answer: 1, explanation: "Retrieve the relevant chunks, then augment the generation with them as context." },
              { q: "Why not just fine-tune a model instead?", choices: ["Fine-tuning is always better", "RAG is cheaper, faster to update, and lets you cite sources", "They are the same thing"], answer: 1, explanation: "For most business use cases, RAG beats fine-tuning on cost, freshness and traceability." },
              { q: "What is a vector database?", choices: ["A spreadsheet", "A store optimised for finding text by semantic similarity", "A backup service"], answer: 1, explanation: "Vector DBs store embeddings and let you retrieve semantically similar chunks fast." },
              { q: "Chunking is…", choices: ["Optional", "Splitting your source content into small pieces the retriever can match against", "Only for audio"], answer: 1, explanation: "Retrieval quality depends heavily on how you cut your source content into chunks." }
            ],
            micro_project: {
              title: "A chatbot that knows your content",
              brief: "Build a working RAG chatbot on your own documents.",
              steps: [
                "Pick a corpus (product docs, past emails, a knowledge base)",
                "Ingest it into pgvector or a similar store",
                "Wire the retrieval + generation flow in n8n or a small script",
                "Ask five real questions and evaluate the answers honestly"
              ],
              deliverable: "The working chat surface, the corpus, and your evaluation of the five questions.",
              validation: "ai"
            },
            xp_reward: 75,
            duration_minutes: 120,
            sort_order: 10
          },
          {
            slug: "deploy-whatsapp-website-en",
            title: "Deploy on WhatsApp and your website",
            intro: "The chatbot only matters where your customers already are. For most businesses that means WhatsApp Business (in most of the world outside North America) and a chat widget on the site. Both have well-documented paths — the trick is picking the one your clients need.",
            why_important: "A chatbot behind a login nobody uses is worthless. Meeting customers on their preferred channel — WhatsApp for support, the site for pre-sale — turns a technical toy into a service that generates leads or reduces support load. That is what businesses will pay for.",
            how_to_use: "Register a WhatsApp Business account, connect it to the WhatsApp Cloud API via Meta for Developers, and wire it through n8n or a lightweight backend. For the website, embed a chat widget (Botpress, Chatwoot, or your own) and connect it to the same RAG backend. One backend, two surfaces.",
            objectives: [
              "Register a WhatsApp Business number and connect it to the Cloud API",
              "Embed a chat widget on a website",
              "Wire both surfaces to the same RAG backend"
            ],
            resources: [
              { label: "WhatsApp Cloud API — Getting started", url: "https://developers.facebook.com/docs/whatsapp/cloud-api/get-started", kind: "doc", why: "The official path to a live WhatsApp bot — mandatory reading.", how: "Follow the getting-started end to end with a test number." },
              { label: "Chatwoot — Documentation", url: "https://www.chatwoot.com/docs/", kind: "doc", why: "Open-source live-chat platform that handles the website widget and WhatsApp in one inbox.", how: "Read the deployment guide and the WhatsApp integration section." },
              { label: "Botpress — Getting started", url: "https://botpress.com/docs", kind: "doc", why: "Alternative if you want a hosted platform to skip the ops.", how: "Compare with self-hosted Chatwoot and pick based on your comfort." }
            ],
            quiz: [
              { q: "Why deploy on WhatsApp first (outside North America)?", choices: ["It looks modern", "It is where most business customers already are", "It is cheaper than a website"], answer: 1, explanation: "The best channel is the one your users already open every day." },
              { q: "Can one backend serve both WhatsApp and a web widget?", choices: ["No, one bot per channel", "Yes — one RAG backend, multiple thin channel adapters", "Only with enterprise plans"], answer: 1, explanation: "Separating the intelligence from the channel is the standard architecture." },
              { q: "What is required to send WhatsApp Business messages via API?", choices: ["Nothing", "A registered business account and access to the Cloud API", "Just a phone number"], answer: 1, explanation: "Meta requires business verification and API access for programmatic messaging." },
              { q: "The chat widget on the site should…", choices: ["Auto-open aggressively", "Be visible but discreet, with a clear label of what it can help with", "Be hidden"], answer: 1, explanation: "Discreet visibility with a clear purpose converts better than intrusive pop-ups." }
            ],
            micro_project: {
              title: "Your bot, live on two channels",
              brief: "Get your chatbot running on WhatsApp AND a real website.",
              steps: [
                "Connect a WhatsApp test number via the Cloud API",
                "Embed the widget on a real website (yours or a client demo)",
                "Route both to the RAG backend from the previous lesson",
                "Ask three real questions on each channel and compare"
              ],
              deliverable: "Screen recordings of both channels answering, and your comparison notes.",
              validation: "ai"
            },
            xp_reward: 80,
            duration_minutes: 120,
            sort_order: 20
          }
        ]
      }
    ]
  },
  {
    track: {
      slug: "wordpress-elementor-en",
      locale: "en",
      counterpart_slug: "wordpress-elementor",
      goal_key: "wordpress_nocode",
      title: "WordPress + Elementor: Ship a Pro Site No-Code",
      summary: "Build, publish and monetize a professional WordPress site with Elementor — no code, no compromise on quality.",
      description:
        "WordPress still powers over 40% of the web because it stays the best trade-off between control, cost, and freedom. This track teaches you to install WordPress cleanly, pick a theme that will not fight you, master Elementor Free and Pro to build any layout, handle responsive design, and publish a fast site that actually converts. The final module turns the site into an asset: how to sell it as a service, or turn your own site into a lead-generating machine.",
      level_label: "Beginner",
      duration_weeks: 8,
      accent_color: "#9C59D6",
      icon: "lucide:pen-tool",
      objective: "Ship one professional WordPress + Elementor site that you own and can sell replicas of.",
      resources: ["WordPress", "Elementor Free & Pro", "Astra Theme", "Kadence", "SiteGround"],
      next_session: "Monday 8:00 PM",
      next_steps: [
        { label: "WordPress foundations", state: "current" },
        { label: "Elementor essentials", state: "locked" },
        { label: "Publish and monetize", state: "locked" }
      ],
      sort_order: 230,
      is_published: true,
      is_active: true
    },
    modules: [
      {
        slug: "wordpress-foundations-en",
        title: "WordPress foundations",
        summary: "Install, host and secure — the boring layer that decides whether your site lasts or falls over.",
        sort_order: 10,
        lessons: [
          {
            slug: "install-and-host-en",
            title: "Install WordPress on solid hosting",
            intro: "The hosting you pick is the single most important technical decision on a WordPress project. Cheap shared hosting will haunt you with slow load times, mysterious downtime and painful support. Managed WordPress hosts cost twice as much and save you ten times the trouble.",
            why_important: "Every WordPress freelancer eventually inherits a site on bad hosting and understands, too late, that speed and reliability are baked in at this layer. Starting on the right host means your Core Web Vitals are green from day one, your backups run automatically, and your client never has to hear the word 'phpMyAdmin'.",
            how_to_use: "Compare SiteGround, Kinsta and Hostinger managed WordPress plans against your budget. Register a domain, one-click install WordPress, and enable HTTPS in the host panel. Verify page speed and uptime monitoring from day one — do not wait until a client complains.",
            objectives: [
              "Compare three managed WordPress hosts on price, performance and support",
              "Install WordPress with HTTPS and automatic backups on your chosen host",
              "Enable basic uptime and speed monitoring"
            ],
            resources: [
              { label: "SiteGround — WordPress hosting", url: "https://www.siteground.com/wordpress-hosting.htm", kind: "doc", why: "One of the most respected managed WordPress hosts for freelancers.", how: "Read the plan comparison and the support policy." },
              { label: "Kinsta — What is managed WordPress hosting", url: "https://kinsta.com/knowledgebase/what-is-managed-wordpress-hosting/", kind: "article", why: "Clear explanation of what you get for the extra cost.", how: "Read once before you commit to a plan." },
              { label: "WordPress — Installation", url: "https://developer.wordpress.org/advanced-administration/wordpress/", kind: "doc", why: "The official reference if you ever need to install manually.", how: "Skim; managed hosts do this for you now." }
            ],
            quiz: [
              { q: "Why does hosting matter this much?", choices: ["It is a status symbol", "Speed, reliability and security are largely determined at this layer", "It is not important"], answer: 1, explanation: "Everything you do above the hosting layer inherits its performance and uptime." },
              { q: "What is managed WordPress hosting?", choices: ["A hosting plan where updates, backups, caching and security are handled for you", "The same as shared hosting", "A specific plugin"], answer: 0, explanation: "Managed hosts take care of the boring but critical WordPress ops for you." },
              { q: "Should backups be manual?", choices: ["Yes, monthly", "No — daily automatic backups with off-site storage are the standard now", "Never, they are unnecessary"], answer: 1, explanation: "The only backup that saves you is the one that ran last night without you thinking about it." },
              { q: "HTTPS is…", choices: ["Optional", "Mandatory — for SEO, trust, and modern browsers", "For e-commerce only"], answer: 1, explanation: "HTTPS is a baseline in 2026; missing it hurts your SEO and scares users." }
            ],
            micro_project: {
              title: "A live WordPress in one hour",
              brief: "Get a working WordPress install online with HTTPS and backups.",
              steps: [
                "Pick your managed host and register a domain",
                "One-click install WordPress with HTTPS",
                "Verify daily automatic backups are enabled",
                "Enable an uptime monitor (UptimeRobot free is fine)"
              ],
              deliverable: "The live site URL, a screenshot of the backup schedule, and the uptime monitor dashboard.",
              validation: "ai"
            },
            xp_reward: 55,
            duration_minutes: 60,
            sort_order: 10
          },
          {
            slug: "pick-your-theme-en",
            title: "Pick a theme that will not fight you",
            intro: "Themes are the second choice that determines your future pain level. Bloated multi-purpose themes lock you into their page builder and their conventions, which fights Elementor and hurts speed. Lightweight, Elementor-friendly themes stay out of your way and let you build what you want.",
            why_important: "The freelance graveyard is full of sites built on trendy themes that became abandoned six months later. Sticking to well-maintained, Elementor-native themes (Astra, Kadence, Hello Elementor) protects you from theme lock-in and keeps your sites fast and easy to hand off.",
            how_to_use: "Install Astra, Kadence and Hello Elementor on staging installs and try building the same simple page in each. Notice which one gets out of your way. Then pick one as your default for client work and learn it deeply — one deep beats three shallow.",
            objectives: [
              "Test three lightweight themes on the same page",
              "Pick one default theme and defend the choice",
              "Understand the difference between a theme and a page builder"
            ],
            resources: [
              { label: "Astra — Documentation", url: "https://wpastra.com/docs/", kind: "doc", why: "The most-installed lightweight WordPress theme, deeply integrated with Elementor.", how: "Read the getting-started and the starter templates sections." },
              { label: "Kadence — Documentation", url: "https://www.kadencewp.com/help-center/", kind: "doc", why: "Serious alternative to Astra with a strong theme-builder feature set.", how: "Compare its header/footer builder with Astra's before you pick." },
              { label: "Hello Elementor — Theme", url: "https://wordpress.org/themes/hello-elementor/", kind: "doc", why: "The minimalist theme built by Elementor themselves — best when you want zero interference.", how: "Try it if you plan to build 100% with Elementor Pro's theme builder." }
            ],
            quiz: [
              { q: "Why not use a multi-purpose theme with a bundled builder?", choices: ["They are illegal", "They lock you in and often fight Elementor, hurting speed and flexibility", "They are outdated"], answer: 1, explanation: "Themes and builders that overlap create conflicts and lock-in — avoid the trap." },
              { q: "What is the role of a theme with Elementor?", choices: ["Design the whole site", "Set base styles and stay out of Elementor's way", "Replace Elementor"], answer: 1, explanation: "In an Elementor-first workflow, the theme is the foundation, not the builder." },
              { q: "Astra, Kadence, Hello Elementor share…", choices: ["Poor performance", "Lightweight code, deep Elementor integration, and active maintenance", "The same author"], answer: 1, explanation: "Those three are the safe defaults in 2026 for Elementor-based projects." },
              { q: "Should you master multiple themes at once?", choices: ["Yes, always three or more", "No — pick one, learn it deeply, then expand", "Only one is available"], answer: 1, explanation: "One theme mastered beats three themes half-learned when a client emergency hits." }
            ],
            micro_project: {
              title: "Your default theme decision",
              brief: "Test and commit to one theme for your future client work.",
              steps: [
                "Spin up three staging installs (or reset one)",
                "Build the same one-section page in Astra, Kadence and Hello Elementor",
                "Compare speed, flexibility and pain",
                "Pick one and write the one-paragraph rationale"
              ],
              deliverable: "The three test pages (screenshots), the comparison table, and your written pick.",
              validation: "ai"
            },
            xp_reward: 60,
            duration_minutes: 90,
            sort_order: 20
          }
        ]
      },
      {
        slug: "elementor-essentials-en",
        title: "Elementor essentials",
        summary: "The 20% of Elementor that lets you build 80% of any client site — including responsive and templates.",
        sort_order: 20,
        lessons: [
          {
            slug: "sections-columns-widgets-en",
            title: "Sections, columns, widgets — the Elementor mental model",
            intro: "Elementor pages are built from sections (full-width blocks), columns (horizontal slots), and widgets (the actual elements). Once that hierarchy clicks, every layout you have ever seen becomes reproducible. Add flex containers (the modern replacement for sections/columns) and you have every tool you need.",
            why_important: "Most Elementor beginners fight the tool because they treat it like Photoshop — dropping elements anywhere. The tool is a nested layout system, and the productivity gap between someone who understands the hierarchy and someone who does not is huge.",
            how_to_use: "Read Elementor's introduction to containers, then rebuild a simple landing-page section (hero + three-column features) from scratch. Do it three times, faster each time. The third rebuild is where the mental model locks in.",
            objectives: [
              "Explain sections, columns, containers and widgets in your own words",
              "Rebuild a hero and three-column features section from scratch",
              "Choose between flex containers and legacy sections on purpose"
            ],
            resources: [
              { label: "Elementor — Containers", url: "https://elementor.com/help/introducing-container/", kind: "doc", why: "The modern layout primitive that replaces sections/columns — start here.", how: "Read once, then use containers by default in the micro-project." },
              { label: "Elementor Academy — Free courses", url: "https://elementor.com/academy/", kind: "video", why: "Structured beginner-to-advanced courses maintained by Elementor.", how: "Do the fundamentals module before the micro-project." },
              { label: "Elementor — Widgets reference", url: "https://elementor.com/help/", kind: "doc", why: "Every widget documented — your reference when you cannot find a feature.", how: "Bookmark and search when needed." }
            ],
            quiz: [
              { q: "What is a widget in Elementor?", choices: ["A theme", "The actual element you drop on the page (heading, image, button…)", "A plugin"], answer: 1, explanation: "Widgets are the atoms; containers/columns are the layout scaffolding." },
              { q: "Containers replace…", choices: ["Widgets", "The old sections + columns paradigm", "The theme"], answer: 1, explanation: "Containers are the modern, flex-based layout primitive introduced by Elementor." },
              { q: "Why rebuild sections from scratch three times?", choices: ["Muscle memory and mental model", "Compliance", "It is required by Elementor"], answer: 0, explanation: "The third rebuild is where speed and confidence lock in — worth the time." },
              { q: "Should you always use containers over legacy sections?", choices: ["Yes, by default on new projects", "No, always use sections", "It does not matter"], answer: 0, explanation: "Containers are the future; new projects should start there unless there is a specific reason not to." }
            ],
            micro_project: {
              title: "Three fast rebuilds",
              brief: "Build a hero + three-column features section three times, faster each time.",
              steps: [
                "Pick a real landing page you admire as your reference",
                "Rebuild the hero + feature section from scratch in Elementor with containers",
                "Do it two more times, timing each attempt",
                "Note where you gained speed and where you still hesitated"
              ],
              deliverable: "Screenshots of the three rebuilds, your times, and your speed-gain notes.",
              validation: "ai"
            },
            xp_reward: 65,
            duration_minutes: 90,
            sort_order: 10
          },
          {
            slug: "templates-and-responsive-en",
            title: "Templates and responsive design",
            intro: "Elementor Pro's template kits let you reuse whole layouts across pages and sites. Combined with responsive controls (per-breakpoint padding, hide-on-mobile, custom columns), they turn one master design into a full multi-page site that looks good on any device.",
            why_important: "Freelancers who build one page at a time will never compete on price with freelancers who reuse templates. Learning to build a header, a footer, and a section library once — then apply it — cuts your build time in half and raises your quality floor.",
            how_to_use: "Build a header, a footer, and three reusable section templates in Elementor's Theme Builder. Save each as a template. Then build a new page by inserting them and only editing the unique content — a full landing page in under an hour.",
            objectives: [
              "Build reusable header, footer and section templates",
              "Configure per-breakpoint responsive controls confidently",
              "Assemble a full landing page from templates in under an hour"
            ],
            resources: [
              { label: "Elementor Pro — Theme Builder", url: "https://elementor.com/help/theme-builder/", kind: "doc", why: "The reference for building headers, footers and templates that apply site-wide.", how: "Follow the header and footer tutorials before the micro-project." },
              { label: "Elementor — Responsive editing", url: "https://elementor.com/help/responsive-editing/", kind: "doc", why: "Per-breakpoint controls are the difference between a page that looks good on desktop and one that looks good everywhere.", how: "Read once, then apply on the micro-project." },
              { label: "Elementor — Template library", url: "https://elementor.com/library/", kind: "repo", why: "Hundreds of pre-built templates you can adapt, saving hours per project.", how: "Browse, copy, edit — do not build from zero when a good template exists." }
            ],
            quiz: [
              { q: "What do reusable templates give you?", choices: ["Vanity", "Speed and consistency across pages and sites", "SEO"], answer: 1, explanation: "Templates are how freelancers scale build speed without dropping quality." },
              { q: "Responsive editing means…", choices: ["A single design for all devices", "Per-breakpoint controls so each device gets the right layout", "Building three separate sites"], answer: 1, explanation: "Elementor lets you tweak padding, alignment and visibility per breakpoint from the same source." },
              { q: "Where does the Theme Builder live?", choices: ["Elementor Free", "Elementor Pro", "The theme"], answer: 1, explanation: "The Theme Builder is a Pro-only feature — worth the licence for freelancers." },
              { q: "Should you build every page from scratch?", choices: ["Yes, for freshness", "No — assemble from templates and only edit unique content", "Only for e-commerce"], answer: 1, explanation: "Templates + unique content per page is the freelancer velocity formula." }
            ],
            micro_project: {
              title: "A landing page in under an hour",
              brief: "Build a full landing page from your templates in under sixty minutes.",
              steps: [
                "Build reusable header, footer and three section templates",
                "Assemble a landing page from them",
                "Test on desktop, tablet and mobile — fix anything that breaks",
                "Time yourself from empty page to publish-ready"
              ],
              deliverable: "The published page URL, your build time, and screenshots on the three breakpoints.",
              validation: "ai"
            },
            xp_reward: 70,
            duration_minutes: 90,
            sort_order: 20
          }
        ]
      },
      {
        slug: "publish-and-monetize-en",
        title: "Publish and monetize",
        summary: "From live site to service: how to package what you learned into revenue you can bill for.",
        sort_order: 30,
        lessons: [
          {
            slug: "speed-seo-security-en",
            title: "Speed, SEO and security before you publish",
            intro: "A pretty WordPress site with a 6-second load time and no SEO basics will get zero traffic. Speed, on-page SEO, and security hardening are the three checks that turn a build into a real site — and they take an afternoon combined when you know what to do.",
            why_important: "This is the layer most beginners skip and most freelancers charge for. Doing it as part of every build means your sites actually rank, load fast, and do not get hacked — reputation compounds from there.",
            how_to_use: "Install one caching plugin (WP Rocket or LiteSpeed Cache), run PageSpeed Insights and fix the three biggest wins, install Rank Math or Yoast for on-page SEO, and add Wordfence or SolidWP for security. Verify each with a real audit tool before you consider the site 'shipped'.",
            objectives: [
              "Get PageSpeed Insights above 90 on mobile and desktop",
              "Configure on-page SEO with Rank Math or Yoast",
              "Harden the site with a security plugin and 2FA"
            ],
            resources: [
              { label: "Google — PageSpeed Insights", url: "https://pagespeed.web.dev/", kind: "tool", why: "The reference speed audit — the numbers that Google itself uses.", how: "Run it, fix the three biggest 'opportunities', re-run." },
              { label: "Rank Math — Getting started", url: "https://rankmath.com/kb/how-to-setup/", kind: "doc", why: "The best free SEO plugin in 2026 — easier than Yoast to set up.", how: "Follow the setup wizard, then use the on-page recommendations per page." },
              { label: "Wordfence — Documentation", url: "https://www.wordfence.com/help/", kind: "doc", why: "Free-tier WordPress security that stops the vast majority of automated attacks.", how: "Install, run the initial scan, enable the firewall — you are 90% done." }
            ],
            quiz: [
              { q: "Why does speed matter for a WordPress site?", choices: ["SEO ranking, conversion, and user trust", "It is a nice-to-have", "Only for e-commerce"], answer: 0, explanation: "Slow sites lose Google ranking AND lose users who bounce before the page loads." },
              { q: "What does a security plugin actually do?", choices: ["Nothing useful", "Blocks known attacks, enforces strong passwords, monitors for changes", "Replaces backups"], answer: 1, explanation: "It is not a silver bullet, but it stops the automated 90% of threats." },
              { q: "On-page SEO plugins like Rank Math…", choices: ["Guarantee ranking", "Help you write titles, descriptions and schemas that Google can understand", "Replace content strategy"], answer: 1, explanation: "They give you the tools; the content and links still have to be good." },
              { q: "Is HTTPS enough for security?", choices: ["Yes, done", "No — you also need strong passwords, 2FA, updated plugins, and a WAF", "Only for logged-in areas"], answer: 1, explanation: "HTTPS encrypts transport; you still need the rest to protect what is behind it." }
            ],
            micro_project: {
              title: "Green audit before launch",
              brief: "Prove your site is fast, indexable and hardened before you show anyone.",
              steps: [
                "Run PageSpeed Insights, fix until mobile ≥ 90",
                "Configure Rank Math with a proper title, description and schema",
                "Install Wordfence, run the scan, enable the firewall and 2FA",
                "Verify one indexed URL in Google Search Console"
              ],
              deliverable: "Screenshots of the three audit passes (speed, SEO, security) and the Search Console indexing confirmation.",
              validation: "ai"
            },
            xp_reward: 75,
            duration_minutes: 120,
            sort_order: 10
          },
          {
            slug: "sell-your-service-en",
            title: "Package and sell your WordPress + Elementor service",
            intro: "The client market for professional WordPress sites is enormous and largely served by mediocre operators. Packaging your work as a productised service — clear scope, clear price, clear timeline — puts you in the top 10% of what most clients ever encounter.",
            why_important: "The freelancers who make good money are not the most talented; they are the ones with the clearest offer. A one-page pricing document, three tiers, and one line about what is not included prevents 80% of the scope creep that eats freelancers alive.",
            how_to_use: "Design a three-tier offer (starter site / business site / e-commerce), price each clearly, list what is included and — critically — what is not. Publish it on your own WordPress site (built with this track), and post it in one or two aligned communities to get your first inquiries.",
            objectives: [
              "Design a three-tier service offer with clear scope and price",
              "Publish it on your own site as a real page",
              "Post it in two communities and log the first inquiries"
            ],
            resources: [
              { label: "Productize Yourself — Overview", url: "https://www.productizeyourself.com/podcast", kind: "podcast", why: "The reference resource on turning freelance work into a productised service.", how: "Listen to two episodes about pricing before you write your offer." },
              { label: "Ellevate — WordPress freelance pricing", url: "https://kinsta.com/blog/wordpress-developer-salary/", kind: "article", why: "Reality-check on what WordPress work actually sells for globally.", how: "Compare to your target price and audience." },
              { label: "Indie Hackers — Productised services", url: "https://www.indiehackers.com/tags/productized-services", kind: "community", why: "Stories from people who ran your exact model — pitfalls included.", how: "Read three posts, note common mistakes." }
            ],
            quiz: [
              { q: "What separates a productised service from generic freelancing?", choices: ["A logo", "Fixed scope, fixed price, fixed timeline per tier", "Working faster"], answer: 1, explanation: "Fixed everything removes the negotiation overhead that eats freelance margins." },
              { q: "Why publish an offer publicly?", choices: ["Vanity", "It attracts pre-qualified inquiries and filters out bad-fit clients", "It is legally required"], answer: 1, explanation: "A public offer does client qualification for you before the first conversation." },
              { q: "How many tiers usually work?", choices: ["One", "Three (starter / business / premium)", "Ten"], answer: 1, explanation: "Three tiers give a choice without decision paralysis and cover 90% of client fit." },
              { q: "What is the single most powerful line in the offer?", choices: ["The price", "What is NOT included — it prevents scope creep", "The phone number"], answer: 1, explanation: "Explicit exclusions save more revenue than any upsell." }
            ],
            micro_project: {
              title: "Your productised WordPress service, live",
              brief: "Ship a real offer page and get your first inquiries.",
              steps: [
                "Design a three-tier offer with clear scope and prices",
                "Publish it on a page of your own site",
                "Post it in two aligned communities with a specific ask",
                "Log every inquiry, its source and whether it qualified"
              ],
              deliverable: "The live offer page URL, the two community posts, and a table of the first inquiries.",
              validation: "ai"
            },
            xp_reward: 80,
            duration_minutes: 120,
            sort_order: 20
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
