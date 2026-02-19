import { useState, useEffect, useRef, useCallback } from "react";

const PROJECTS = [
  {
    title: "CLAIMCHECK",
    venue: "EMNLP 2025",
    description:
      "Co-authored a benchmark dataset and evaluation framework for measuring how well LLMs ground their critiques of scientific papers in the actual claims those papers make. The team annotated NeurIPS submissions with expert-labeled weaknesses linked to specific disputed claims, then benchmarked frontier models on claim association, weakness labeling, and claim verification tasks.",
    tags: ["NLP", "LLM Evaluation", "Peer Review", "Benchmark"],
    pdf: "claimcheck.pdf",
    image: "img-claimcheck.png",
  },
  {
    title: "Unsupervised Monocular Depth Estimation",
    venue: "Johns Hopkins",
    description:
      "Evaluated modifications to an unsupervised depth prediction network trained on stereo video. Incorporating Squeeze-and-Excitation blocks into the encoder reduced RMSE by 20% over the base model, while experiments with reduced training data revealed how prediction distributions degrade gracefully.",
    tags: ["Deep Learning", "Depth Estimation", "Unsupervised Learning"],
    pdf: "DL_final_paper.pdf",
    image: "img-depth.png",
  },
  {
    title: "NarrativeNet",
    venue: "Personal Project",
    description:
      "A Flask web application for text analysis and visualization of movie and series synopses. Extracts characters and relationships from narratives, visualizes them as dynamic network graphs, and computes centrality scores (betweenness, eigenvector, etc.) to quantify character importance. Supports CSV and JSON export for further analysis.",
    tags: ["Flask", "NLP", "Network Analysis", "Visualization"],
    github: "https://github.com/han-daniel/NarrativeNet",
    demo: "https://narrative-net-8d9c8f56d50d.herokuapp.com",
    image: "img-narrativenet.png",
  },
  {
    title: "Image-to-Image Translation with CycleGAN Modifications",
    venue: "Johns Hopkins",
    description:
      "Compared architectural modifications to CycleGAN for unpaired gender transformation, including self-attention, spatial attention, and U-Net changes. Spatial attention outperformed other variants, achieving a 10% FID improvement over baseline while using fewer parameters.",
    tags: ["Computer Vision", "GANs", "PyTorch"],
    pdf: "CV_final_paper.pdf",
    image: "img-cyclegan.png",
  },
  {
    title: "Bayesian Hierarchical Modeling of NFL Outcomes",
    venue: "Johns Hopkins",
    description:
      "Built Bayesian hierarchical models for two NFL prediction problems: first down conversion probability and real-time win probability. Both separate situational game-state effects from latent team strengths using HMC/NUTS sampling with full posterior uncertainty. The win probability model additionally captures team-specific home-field advantage and explores its correlation with fan attendance.",
    tags: ["Bayesian Statistics", "NumPyro", "Sports Analytics", "MCMC"],
    pdfs: [
      { label: "First Down Model", file: "Bayesian_Stat_Report.pdf" },
      { label: "Win Probability Model", file: "PML_Report.pdf" },
    ],
    image: "img-nfl.png",
  },
];

const WRITING_POSTS = [
  {
    title: "Why Relationships Look Like Games But Aren\u2019t Played Like Them",
    date: "February 15, 2025",
    excerpt:
      "Classical game theory gives each player two moves: cooperate or defect. That binary works for modeling arms races and price wars. It doesn\u2019t work for relationships, because it flattens three distinct behaviors into two.",
    content: `Here\u2019s a pattern you\u2019ve seen before. One person in a relationship gives constantly: time, energy, attention, money. The other person takes, and when confronted, asks for more. Everyone watching knows the math doesn\u2019t work. The standard advice is some version of \u201ccommunicate better\u201d or \u201cthey\u2019re just selfish.\u201d Neither explanation is useful, because neither explains why the giver keeps giving when it\u2019s clearly costing them.

Game theory was supposed to help here. The Prisoner\u2019s Dilemma tells us that two rational agents should cooperate when the long-term payoff exceeds the short-term gain from defection. But the person over-investing in a lopsided relationship isn\u2019t failing to calculate. They\u2019re calculating across a different set of books than the one we\u2019re looking at.

## The problem with cooperate and defect

Classical game theory gives each player two moves: cooperate or defect. That binary works for modeling arms races and price wars. It doesn\u2019t work for relationships, because it flattens three distinct behaviors into two.

When someone invests in a relationship, we see cooperation. But *why* they invest matters enormously for what happens next. A person who gives because they genuinely have surplus operates very differently from someone who gives because they\u2019re terrified of conflict. Both look like cooperation from the outside. One is sustainable. The other is a slow bleed.

Similarly, \u201cdefection\u201d collapses two very different things. Someone who demands more from a partner isn\u2019t necessarily exploiting them. They might simply be honest about what they need. And someone who asks for nothing isn\u2019t necessarily generous. They might be afraid to want anything at all.

The cooperate/defect binary can\u2019t distinguish these cases because it treats behavior as one-dimensional. Real relational behavior has at least three.

## Give, Want, Ask

Every agent in an exchange, whether a person, a firm, or a country, can be located along three dimensions:

**Give** is what you actually invest. Time, money, attention, effort, risk. It\u2019s observable and costly.

**Want** is what you actually need from the exchange. This is internal. It\u2019s shaped by your history, your current resources, and how sensitive you are to loss. Want is slow-moving. It doesn\u2019t change because someone tells you to want less.

**Ask** is what you request. This is strategic. It\u2019s the signal you send about your needs, and it can diverge wildly from Want.

The gaps between these three dimensions are where most relational dysfunction lives.

When Ask is much lower than Want, you get underbidding. This is the person who says \u201cI\u2019m fine\u201d when they\u2019re not, the employee who never negotiates a raise, the country that accepts bad trade terms to avoid confrontation. It looks generous or easygoing. Over time, it builds resentment, because the underlying need doesn\u2019t disappear just because you stopped voicing it.

When Ask exceeds Want, you get overbidding. This is the negotiator who anchors high, the partner who makes demands they don\u2019t actually care about to test commitment, the firm that prices above value to establish positioning. It looks aggressive. But sometimes it\u2019s simply honest. Sometimes people who ask for a lot just need a lot.

The opening scenario now has a sharper diagnosis. The over-giver isn\u2019t \u201ctoo nice.\u201d They have high Give, high Want, and low Ask. They\u2019re investing heavily and needing a lot in return, but they\u2019ve suppressed their Ask, probably because past experience taught them that voicing needs leads to punishment. The taker isn\u2019t \u201cselfish.\u201d They have low Give and high Ask. Whether that\u2019s a problem depends on their Want, which we can\u2019t see from the outside.

## Three literatures, one object

Something unexpected falls out of this framework. If you take the three dimensions and project them onto pairs, you get three 2D maps, and each one corresponds to an existing academic field that developed independently.

**Give and Want** together describe how people characteristically approach relationships: how much they invest and how much they need. This is the territory of attachment theory. The four attachment styles (secure, anxious, avoidant, disorganized) map onto quadrants of this plane. Psychologists have been studying this face of the cube since Bowlby.

**Give and Ask** together describe the strategic structure of exchange: who invests, who extracts, whether surplus is created or destroyed. This is the Prisoner\u2019s Dilemma face. Economists and political scientists have been studying this face since von Neumann.

**Want and Ask** together describe how honestly agents represent their needs. The gap between the two is your bid strategy: do you overbid, underbid, or show your hand? This is the territory of signaling theory and bargaining. Spence, Nash, and the entire negotiation literature live here.

Three fields, three faces of the same object. They developed separately because each one held the third dimension constant and studied the remaining two. Attachment theory holds Ask constant and focuses on the emotional core. Game theory holds Want constant and focuses on the strategic structure. Bargaining theory holds Give constant and focuses on the signal.

## So what

This isn\u2019t just taxonomy. If you can locate yourself in this space, you can see the specific mechanism driving your behavior, not a personality label, not a moral judgment.

The underbidder doesn\u2019t need to \u201ccommunicate better.\u201d They need to understand why their Ask dropped below their Want and what updating it would cost. The overbidder doesn\u2019t need to \u201cbe less demanding.\u201d They might need to check whether their Ask actually reflects their Want, or whether it\u2019s armor.

The same diagnostic works for firms negotiating partnerships, countries managing alliances, and teams navigating internal politics. The dimensions are the same. The stakes change. The geometry doesn\u2019t.`,
  },
];

/* ─── Simple Markdown Renderer ─── */
function renderMarkdown(text) {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    // H2
    if (trimmed.startsWith("## ")) {
      return (
        <h3
          key={i}
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "20px",
            fontWeight: 400,
            color: "#1a1a1a",
            margin: "32px 0 12px 0",
          }}
        >
          {trimmed.slice(3)}
        </h3>
      );
    }

    // Process inline bold and italic
    const parts = [];
    let remaining = trimmed.replace(/\n/g, " ");
    let key = 0;
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(remaining.slice(lastIndex, match.index));
      }
      if (match[2]) {
        parts.push(<strong key={key++}>{match[2]}</strong>);
      } else if (match[3]) {
        parts.push(<em key={key++}>{match[3]}</em>);
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < remaining.length) {
      parts.push(remaining.slice(lastIndex));
    }

    return (
      <p
        key={i}
        style={{
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: "15.5px",
          lineHeight: 1.75,
          color: "#555",
          margin: "0 0 16px 0",
        }}
      >
        {parts}
      </p>
    );
  });
}

/* ─── Brain Point Cloud ─── */
function generateBrainPoints(count) {
  const points = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const add = (x, y, z, d) => {
    points.push({
      x: x + (rand() - 0.5) * 0.018,
      y: y + (rand() - 0.5) * 0.018,
      z: z + (rand() - 0.5) * 0.018,
      depth: d ?? 0.3 + rand() * 0.7,
    });
  };

  const profile = (az, el) => {
    let r = 1.0;
    const front = Math.max(0, Math.sin(az));
    const back = Math.max(0, -Math.sin(az));
    const top = Math.max(0, Math.sin(el));
    const bot = Math.max(0, -Math.sin(el));
    const lateral = Math.abs(Math.cos(az));

    r += 0.18 * front * Math.max(0, Math.cos(el));
    r -= 0.1 * back * (1 - 0.3 * top);
    r += 0.06 * top * top;
    r -= 0.2 * bot * bot;
    r += 0.22 * bot * lateral * (1 - back * 0.5);
    r += 0.03 * Math.sin(az * 9 + el * 7);
    r += 0.025 * Math.sin(az * 15 - el * 11);
    r += 0.018 * Math.sin(el * 19 + az * 4);
    return r;
  };

  const hemiN = Math.floor(count * 0.42);
  for (let h = 0; h < 2; h++) {
    const sign = h === 0 ? 1 : -1;
    for (let i = 0; i < hemiN; i++) {
      const az = rand() * Math.PI * 2;
      const el = (rand() * 1.35 - 0.4) * Math.PI * 0.5;

      const p = profile(az, el);
      const hw = 0.42;
      const hh = 0.58;
      const hd = 0.72;

      let x = hw * p * Math.cos(el) * Math.cos(az);
      let y = hh * p * Math.sin(el);
      let z = hd * p * Math.cos(el) * Math.sin(az);

      x = Math.abs(x) * sign;
      x += sign * 0.12;

      const distMid = Math.abs(x);
      if (distMid < 0.2) {
        const depth = 0.15 * (1 - distMid / 0.2);
        y -= depth * Math.max(0, 0.5 + 0.5 * Math.sin(el));
      }

      add(x, y, z);
    }
  }

  for (let i = 0; i < count * 0.035; i++) {
    const z = (rand() - 0.35) * 1.35;
    const y = rand() * 0.4;
    const x = (rand() - 0.5) * 0.025;
    add(x, y, z, 0.06 + rand() * 0.1);
  }

  for (let i = 0; i < count * 0.1; i++) {
    const u = rand() * Math.PI * 2;
    const v = rand() * Math.PI * 0.5;
    const cr = 0.2 * (1 + 0.05 * Math.sin(u * 20 + v * 12));
    const cx = cr * Math.sin(v) * Math.cos(u) * 1.5;
    const cy = -0.42 - cr * Math.cos(v) * 0.35;
    const cz = -0.5 + cr * Math.sin(v) * Math.sin(u) * 0.5;
    add(cx, cy, cz, 0.18 + rand() * 0.3);
  }

  for (let i = 0; i < count * 0.02; i++) {
    const t = rand();
    const a = rand() * Math.PI * 2;
    const sr = 0.055 + rand() * 0.015;
    add(Math.cos(a) * sr, -0.5 - t * 0.28, -0.28 + Math.sin(a) * sr * 0.7, 0.1 + rand() * 0.18);
  }

  return points;
}

function BrainPointCloud() {
  const canvasRef = useRef(null);
  const pointsRef = useRef(generateBrainPoints(1800));
  const rotationRef = useRef(0);
  const mouseYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const size = 340;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    ctx.scale(dpr, dpr);

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseYRef.current =
        ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
    };
    canvas.addEventListener("mousemove", handleMouse);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      rotationRef.current += 0.004;
      const ry = rotationRef.current;
      const rx = mouseYRef.current;
      const cosRy = Math.cos(ry);
      const sinRy = Math.sin(ry);
      const cosRx = Math.cos(rx);
      const sinRx = Math.sin(rx);
      const cx = size / 2;
      const cy = size / 2;
      const scale = 130;

      const projected = pointsRef.current.map((p) => {
        let x = p.x * cosRy - p.z * sinRy;
        let z = p.x * sinRy + p.z * cosRy;
        let y = p.y;
        let y2 = -(y * cosRx - z * sinRx);
        let z2 = y * sinRx + z * cosRx;
        return {
          sx: cx + x * scale,
          sy: cy + y2 * scale,
          z: z2,
          depth: p.depth,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      projected.forEach((p) => {
        const zNorm = (p.z + 1.5) / 3;
        const opacity = 0.08 + zNorm * 0.45 * p.depth;
        const radius = 0.5 + zNorm * 1.2;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 140, 160, ${opacity})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        flexShrink: 0,
        opacity: 0.85,
        cursor: "default",
      }}
    />
  );
}

/* ─── Background Particles ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef(null);

  const initParticles = useCallback((width, height) => {
    const count = Math.floor((width * height) / 1200);
    return Array.from({ length: Math.min(count, 800) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2.0 + 0.6,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    const handleMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    window.addEventListener("mousemove", handleMouse);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          p.vx -= (dx / dist) * force * 0.015;
          p.vy -= (dy / dist) * force * 0.015;
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(130, 155, 170, ${p.opacity})`;
        ctx.fill();
      });
      // Spatial grid for O(n) connection checks
      const CD = 120;
      const grid = {};
      for (let i = 0; i < particles.length; i++) {
        const gx = Math.floor(particles[i].x / CD);
        const gy = Math.floor(particles[i].y / CD);
        const key = gx + "," + gy;
        if (!grid[key]) grid[key] = [];
        grid[key].push(i);
      }
      const checked = new Set();
      for (let i = 0; i < particles.length; i++) {
        const gx = Math.floor(particles[i].x / CD);
        const gy = Math.floor(particles[i].y / CD);
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const cell = grid[(gx + dx) + "," + (gy + dy)];
            if (!cell) continue;
            for (const j of cell) {
              if (j <= i) continue;
              const pk = i < j ? i * 100000 + j : j * 100000 + i;
              if (checked.has(pk)) continue;
              checked.add(pk);
              const ddx = particles[i].x - particles[j].x;
              const ddy = particles[i].y - particles[j].y;
              const dist = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dist < CD) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(130, 155, 170, ${0.09 * (1 - dist / CD)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ─── Nav ─── */
function Nav() {
  const items = ["Research", "Writing", "Resume"];
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "10px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(250, 249, 247, 0.85)",
        borderBottom: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <a
        href="#top"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <img
          src="headshot.jpeg"
          alt="Daniel Han"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        />
        <span
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "17px",
            color: "#1a1a1a",
            letterSpacing: "-0.02em",
          }}
        >
          Daniel Han
        </span>
      </a>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {items.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#777",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#1a1a1a")}
            onMouseLeave={(e) => (e.target.style.color = "#777")}
          >
            {item}
          </a>
        ))}
        <a
          href="mailto:daniel@example.com"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#777",
            textDecoration: "none",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#1a1a1a")}
          onMouseLeave={(e) => (e.target.style.color = "#777")}
        >
          Email
        </a>
        <a
          href="https://www.linkedin.com/in/danielhan0/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#777",
            textDecoration: "none",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#1a1a1a")}
          onMouseLeave={(e) => (e.target.style.color = "#777")}
        >
          LinkedIn
        </a>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <section
      id="top"
      style={{
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        maxWidth: "1060px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        gap: "20px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        flexWrap: "wrap",
      }}
    >
      <div style={{ maxWidth: "560px", flex: "1 1 340px" }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(32px, 4.2vw, 48px)",
            fontWeight: 400,
            lineHeight: 1.2,
            color: "#1a1a1a",
            margin: "0 0 18px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Daniel Han
        </h1>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "17.5px",
            lineHeight: 1.7,
            color: "#555",
            margin: "0 0 8px 0",
          }}
        >
          Researcher and analyst at the intersection of behavior and
          computation. I study how people make decisions, what patterns
          distinguish different approaches, and what those patterns tell us
          about their needs.
        </p>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "15.5px",
            lineHeight: 1.7,
            color: "#888",
          }}
        >
          MSE Data Science, Johns Hopkins. BA Mathematics, Vanderbilt.
          <br />
          Currently Analytics Co-Lead at the Johns Hopkins Center for Talented
          Youth.
        </p>
      </div>
      <div
        style={{
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BrainPointCloud />
      </div>
    </section>
  );
}

/* ─── Shared Components ─── */
function PdfLink({ label, file, darkMode }) {
  const baseColor = darkMode ? "#8bb8c8" : "#4a6670";
  const baseBorder = darkMode
    ? "rgba(139, 184, 200, 0.35)"
    : "rgba(74, 102, 112, 0.3)";
  const hoverBg = darkMode ? "#8bb8c8" : "#4a6670";
  const hoverColor = darkMode ? "#1a1a1a" : "#fff";

  return (
    <a
      href={file}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "11px",
        letterSpacing: "0.05em",
        color: baseColor,
        textDecoration: "none",
        padding: "4px 12px",
        border: `1px solid ${baseBorder}`,
        borderRadius: "2px",
        transition: "all 0.25s",
        display: "inline-block",
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = hoverBg;
        e.target.style.color = hoverColor;
        e.target.style.borderColor = hoverBg;
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "transparent";
        e.target.style.color = baseColor;
        e.target.style.borderColor = baseBorder;
      }}
    >
      {label} ↗
    </a>
  );
}

function ProjectCard({ project, index, darkMode }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding: "32px 0",
        borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          style={{
            width: "180px",
            height: "135px",
            objectFit: "cover",
            borderRadius: "3px",
            border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
            flexShrink: 0,
            marginTop: "4px",
          }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "21px",
              fontWeight: 400,
              color: darkMode ? "#f0ede8" : "#1a1a1a",
              margin: 0,
            }}
          >
            {project.title}
          </h3>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: darkMode ? "rgba(255,255,255,0.4)" : "#aaa",
            }}
          >
            {project.venue}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "15.5px",
            lineHeight: 1.65,
            color: darkMode ? "rgba(255,255,255,0.65)" : "#666",
            margin: "0 0 14px 0",
          }}
        >
          {project.description}
        </p>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "9.5px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: darkMode ? "rgba(255,255,255,0.5)" : "#aaa",
                padding: "2px 8px",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.07)"}`,
                borderRadius: "2px",
              }}
            >
              {tag}
            </span>
          ))}
          <span style={{ width: "8px" }} />
          {project.pdf && <PdfLink label="Paper" file={project.pdf} darkMode={darkMode} />}
          {project.pdfs &&
            project.pdfs.map((p) => (
              <PdfLink key={p.file} label={p.label} file={p.file} darkMode={darkMode} />
            ))}
          {project.github && <PdfLink label="GitHub" file={project.github} darkMode={darkMode} />}
          {project.demo && <PdfLink label="Demo" file={project.demo} darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

/* ─── Sections ─── */
function Research() {
  return (
    <section
      id="research"
      style={{
        padding: "80px 0 100px",
        maxWidth: "920px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(20, 20, 20, 0.92)",
          borderRadius: "16px",
          padding: "48px",
        }}
      >
        <div style={{ marginBottom: "36px" }}>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "6px",
            }}
          >
            01
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "30px",
              fontWeight: 400,
              color: "#f0ede8",
              margin: 0,
            }}
          >
            Research & Projects
          </h2>
        </div>
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} darkMode />
        ))}
      </div>
    </section>
  );
}

/* ─── Writing ─── */
function Writing() {
  const [expanded, setExpanded] = useState({});

  const toggle = (i) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <section
      id="writing"
      style={{
        padding: "80px 48px 100px",
        maxWidth: "760px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ marginBottom: "36px" }}>
        <p
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#bbb",
            marginBottom: "6px",
          }}
        >
          02
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "30px",
            fontWeight: 400,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Writing
        </h2>
      </div>
      {WRITING_POSTS.map((post, i) => (
        <div
          key={i}
          style={{
            padding: "28px 0",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "21px",
              fontWeight: 400,
              color: "#1a1a1a",
              margin: "0 0 6px 0",
            }}
          >
            {post.title}
          </h3>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#aaa",
              marginBottom: "12px",
            }}
          >
            {post.date}
          </p>
          {!expanded[i] && (
            <p
              style={{
                fontFamily: "'Source Serif 4', Georgia, serif",
                fontSize: "15.5px",
                lineHeight: 1.65,
                color: "#666",
                margin: "0 0 14px 0",
              }}
            >
              {post.excerpt}
            </p>
          )}
          {expanded[i] && (
            <div style={{ margin: "0 0 14px 0" }}>
              {renderMarkdown(post.content)}
            </div>
          )}
          <button
            onClick={() => toggle(i)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.05em",
              color: "#4a6670",
              background: "none",
              border: "1px solid rgba(74, 102, 112, 0.3)",
              borderRadius: "2px",
              padding: "4px 12px",
              cursor: "pointer",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#4a6670";
              e.target.style.color = "#fff";
              e.target.style.borderColor = "#4a6670";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#4a6670";
              e.target.style.borderColor = "rgba(74, 102, 112, 0.3)";
            }}
          >
            {expanded[i] ? "Collapse" : "Read more"}
          </button>
        </div>
      ))}
    </section>
  );
}

function Resume() {
  return (
    <section
      id="resume"
      style={{
        padding: "80px 0 100px",
        maxWidth: "920px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(20, 20, 20, 0.92)",
          borderRadius: "16px",
          padding: "48px",
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
        }}
      >
        {/* Left: Resume content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: "36px" }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.35)",
                marginBottom: "6px",
              }}
            >
              03
            </p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "30px",
                fontWeight: 400,
                color: "#f0ede8",
                margin: 0,
              }}
            >
              Resume
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "6px",
                }}
              >
                Education
              </p>
              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.85)",
                  margin: "0 0 3px 0",
                }}
              >
                MSE Data Science — Johns Hopkins University
              </p>
              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: "16px",
                  color: "rgba(255,255,255,0.85)",
                  margin: 0,
                }}
              >
                BA Mathematics — Vanderbilt University
              </p>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.4)",
                  marginTop: "4px",
                }}
              >
                Minors in Data Science, Psychology, Scientific Computing
              </p>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "6px",
                }}
              >
                Experience
              </p>
              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: "16px",
                    color: "rgba(255,255,255,0.85)",
                    margin: "0 0 2px 0",
                  }}
                >
                  Analytics Co-Lead — Johns Hopkins Center for Talented Youth (CTY)
                </p>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  Jan 2025 – Present
                </p>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: "16px",
                    color: "rgba(255,255,255,0.85)",
                    margin: "0 0 2px 0",
                  }}
                >
                  Graduate Researcher — Center for Language and Speech Processing
                  (CLSP)
                </p>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  Oct 2024 – Feb 2025
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Source Serif 4', Georgia, serif",
                    fontSize: "16px",
                    color: "rgba(255,255,255,0.85)",
                    margin: "0 0 2px 0",
                  }}
                >
                  Vice President of Programming — Vanderbilt Asian Pre-Professional
                  Society (VAPS)
                </p>
                <p
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.4)",
                    margin: 0,
                  }}
                >
                  Jan 2022 – Jun 2023
                </p>
              </div>
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "6px",
                }}
              >
                Skills
              </p>
              <p
                style={{
                  fontFamily: "'Source Serif 4', Georgia, serif",
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Python, SQL, Pandas, NumPy, scikit-learn, PyTorch, statistics,
                regression, clustering, hypothesis testing, Bayesian modeling, data
                visualization, pipeline design
              </p>
            </div>
            <a
              href="Resume_Daniel_Han.pdf"
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#f0ede8",
                textDecoration: "none",
                padding: "10px 24px",
                border: "1px solid rgba(255,255,255,0.3)",
                alignSelf: "flex-start",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f0ede8";
                e.target.style.color = "#1a1a1a";
                e.target.style.borderColor = "#f0ede8";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#f0ede8";
                e.target.style.borderColor = "rgba(255,255,255,0.3)";
              }}
            >
              Download PDF
            </a>
          </div>
        </div>
        {/* Right: Headshot, side-by-side like Hero/BrainPointCloud */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "60px",
          }}
        >
          <img
            src="headshot.jpeg"
            alt="Daniel Han"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.1)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "32px 48px",
        maxWidth: "1060px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
        borderTop: "1px solid rgba(0,0,0,0.04)",
      }}
    >
      <p
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "10px",
          color: "#ccc",
          letterSpacing: "0.05em",
        }}
      >
        © 2025 Daniel Han
      </p>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;500&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; scroll-padding-top: 56px; }
      body { background: #faf9f7; }
      ::selection { background: #d4dfe3; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <ParticleCanvas />
      <Nav />
      <Hero />
      <Research />
      <Writing />
      <Resume />
      <Footer />
    </div>
  );
}
