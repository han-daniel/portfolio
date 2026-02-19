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
    title: "Unsupervised Monocular Depth Estimation",
    venue: "Johns Hopkins",
    description:
      "Evaluated modifications to an unsupervised depth prediction network trained on stereo video. Incorporating Squeeze-and-Excitation blocks into the encoder reduced RMSE by 20% over the base model, while experiments with reduced training data revealed how prediction distributions degrade gracefully.",
    tags: ["Deep Learning", "Depth Estimation", "Unsupervised Learning"],
    pdf: "DL_final_paper.pdf",
    image: "img-depth.png",
  },
];

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

  // Profile function: controls how the radius varies by angle
  // az = azimuth (around y-axis, 0=right, PI/2=front, -PI/2=back)
  // el = elevation (-PI/2=bottom, PI/2=top)
  const profile = (az, el) => {
    let r = 1.0;
    const front = Math.max(0, Math.sin(az));
    const back = Math.max(0, -Math.sin(az));
    const top = Math.max(0, Math.sin(el));
    const bot = Math.max(0, -Math.sin(el));
    const lateral = Math.abs(Math.cos(az));

    // frontal lobe: taller and wider at front
    r += 0.18 * front * Math.max(0, Math.cos(el));
    // occipital: narrower, slightly pointed
    r -= 0.1 * back * (1 - 0.3 * top);
    // dome the top
    r += 0.06 * top * top;
    // flatten/tuck the bottom
    r -= 0.2 * bot * bot;
    // temporal lobes: strong lateral+downward bulge
    r += 0.22 * bot * lateral * (1 - back * 0.5);
    // gyri wrinkles
    r += 0.03 * Math.sin(az * 9 + el * 7);
    r += 0.025 * Math.sin(az * 15 - el * 11);
    r += 0.018 * Math.sin(el * 19 + az * 4);
    return r;
  };

  // TWO HEMISPHERES
  const hemiN = Math.floor(count * 0.42);
  for (let h = 0; h < 2; h++) {
    const sign = h === 0 ? 1 : -1;
    for (let i = 0; i < hemiN; i++) {
      const az = rand() * Math.PI * 2;
      const el = (rand() * 1.35 - 0.4) * Math.PI * 0.5; // bias upward

      const p = profile(az, el);
      const hw = 0.42; // half-width per hemisphere
      const hh = 0.58; // half-height
      const hd = 0.72; // half-depth (front-back)

      let x = hw * p * Math.cos(el) * Math.cos(az);
      let y = hh * p * Math.sin(el);
      let z = hd * p * Math.cos(el) * Math.sin(az);

      // force to correct side
      x = Math.abs(x) * sign;
      // hemisphere gap
      x += sign * 0.12;

      // deepen fissure: points near midline get pulled down
      const distMid = Math.abs(x);
      if (distMid < 0.2) {
        const depth = 0.15 * (1 - distMid / 0.2);
        y -= depth * Math.max(0, 0.5 + 0.5 * Math.sin(el));
      }

      add(x, y, z);
    }
  }

  // FISSURE: visible dark line between hemispheres
  for (let i = 0; i < count * 0.035; i++) {
    const z = (rand() - 0.35) * 1.35;
    const y = rand() * 0.4;
    const x = (rand() - 0.5) * 0.025;
    add(x, y, z, 0.06 + rand() * 0.1);
  }

  // CEREBELLUM: distinct lower-back structure with tighter wrinkle texture
  for (let i = 0; i < count * 0.1; i++) {
    const u = rand() * Math.PI * 2;
    const v = rand() * Math.PI * 0.5;
    const cr = 0.2 * (1 + 0.05 * Math.sin(u * 20 + v * 12));
    const cx = cr * Math.sin(v) * Math.cos(u) * 1.5;
    const cy = -0.42 - cr * Math.cos(v) * 0.35;
    const cz = -0.5 + cr * Math.sin(v) * Math.sin(u) * 0.5;
    add(cx, cy, cz, 0.18 + rand() * 0.3);
  }

  // BRAINSTEM: thin cylinder descending
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
        // rotate Y
        let x = p.x * cosRy - p.z * sinRy;
        let z = p.x * sinRy + p.z * cosRy;
        let y = p.y;
        // rotate X (tilt)
        let y2 = -(y * cosRx - z * sinRx);
        let z2 = y * sinRx + z * cosRx;
        return {
          sx: cx + x * scale,
          sy: cy + y2 * scale,
          z: z2,
          depth: p.depth,
        };
      });

      // sort by z for depth
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
    const count = Math.floor((width * height) / 9000);
    return Array.from({ length: Math.min(count, 100) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      radius: Math.random() * 1.8 + 0.5,
      opacity: Math.random() * 0.35 + 0.08,
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
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(130, 155, 170, ${0.07 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
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
  const items = ["Research", "Resume"];
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
          href="https://linkedin.com/in/"
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
        padding: "0 40px",
        maxWidth: "960px",
        position: "relative",
        zIndex: 1,
        gap: "20px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        flexWrap: "wrap",
      }}
    >
      <div style={{ maxWidth: "520px", flex: "1 1 340px" }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(30px, 4vw, 44px)",
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
            fontSize: "16.5px",
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
            fontSize: "14.5px",
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
function PdfLink({ label, file }) {
  return (
    <a
      href={file}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: "11px",
        letterSpacing: "0.05em",
        color: "#4a6670",
        textDecoration: "none",
        padding: "4px 12px",
        border: "1px solid rgba(74, 102, 112, 0.3)",
        borderRadius: "2px",
        transition: "all 0.25s",
        display: "inline-block",
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
      {label} ↗
    </a>
  );
}

function ProjectCard({ project, index }) {
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
        padding: "28px 0",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
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
            width: "160px",
            height: "120px",
            objectFit: "cover",
            borderRadius: "3px",
            border: "1px solid rgba(0,0,0,0.06)",
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
              fontSize: "19px",
              fontWeight: 400,
              color: "#1a1a1a",
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
              color: "#aaa",
            }}
          >
            {project.venue}
          </span>
        </div>
        <p
          style={{
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "14.5px",
            lineHeight: 1.65,
            color: "#666",
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
                color: "#aaa",
                padding: "2px 8px",
                border: "1px solid rgba(0,0,0,0.07)",
                borderRadius: "2px",
              }}
            >
              {tag}
            </span>
          ))}
          <span style={{ width: "8px" }} />
          {project.pdf && <PdfLink label="Paper" file={project.pdf} />}
          {project.pdfs &&
            project.pdfs.map((p) => (
              <PdfLink key={p.file} label={p.label} file={p.file} />
            ))}
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
        padding: "80px 40px 100px",
        maxWidth: "820px",
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
          01
        </p>
        <h2
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "28px",
            fontWeight: 400,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Research & Projects
        </h2>
      </div>
      {PROJECTS.map((project, i) => (
        <ProjectCard key={project.title} project={project} index={i} />
      ))}
    </section>
  );
}

function Resume() {
  return (
    <section
      id="resume"
      style={{
        padding: "80px 40px 100px",
        maxWidth: "680px",
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
            fontSize: "28px",
            fontWeight: 400,
            color: "#1a1a1a",
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
              color: "#bbb",
              marginBottom: "6px",
            }}
          >
            Education
          </p>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "15px",
              color: "#333",
              margin: "0 0 3px 0",
            }}
          >
            MSE Data Science — Johns Hopkins University
          </p>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "15px",
              color: "#333",
              margin: 0,
            }}
          >
            BA Mathematics — Vanderbilt University
          </p>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              color: "#aaa",
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
              color: "#bbb",
              marginBottom: "6px",
            }}
          >
            Experience
          </p>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "15px",
              color: "#333",
              margin: 0,
            }}
          >
            Analytics Co-Lead — Johns Hopkins Center for Talented Youth
          </p>
        </div>
        <div>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#bbb",
              marginBottom: "6px",
            }}
          >
            Skills
          </p>
          <p
            style={{
              fontFamily: "'Source Serif 4', Georgia, serif",
              fontSize: "14px",
              color: "#666",
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
          href="resume.pdf"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#1a1a1a",
            textDecoration: "none",
            padding: "10px 24px",
            border: "1px solid #1a1a1a",
            alignSelf: "flex-start",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#1a1a1a";
            e.target.style.color = "#faf9f7";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#1a1a1a";
          }}
        >
          Download PDF
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "32px 40px",
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
      <Resume />
      <Footer />
    </div>
  );
}
