import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { RecipeStep, VideoActionType } from '../types/cuisine';
import { soundEngine } from '../utils/audioEffects';

interface StepVideoCanvasProps {
  step: RecipeStep;
  recipeTitle: string;
  autoPlay?: boolean;
  onStepComplete?: () => void;
  compact?: boolean;
}

export const StepVideoCanvas: React.FC<StepVideoCanvasProps> = ({
  step,
  recipeTitle,
  autoPlay = true,
  onStepComplete,
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const soundTimerRef = useRef<number | null>(null);

  // Video cycle duration: 14 seconds loop per step
  const loopDuration = 14000;

  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [step.id]);

  useEffect(() => {
    // Sound ambience loop when playing
    if (isPlaying && !isMuted) {
      const triggerCookingSound = () => {
        if (step.audioPreset === 'sizzle') {
          soundEngine.playSizzle();
        } else if (step.audioPreset === 'simmer') {
          soundEngine.playSimmerPulse();
        } else if (step.audioPreset === 'whisk') {
          soundEngine.playClick();
        }
      };

      triggerCookingSound();
      const interval = setInterval(triggerCookingSound, 2800);
      soundTimerRef.current = interval as unknown as number;
    } else {
      if (soundTimerRef.current) {
        clearInterval(soundTimerRef.current);
      }
    }

    return () => {
      if (soundTimerRef.current) {
        clearInterval(soundTimerRef.current);
      }
    };
  }, [isPlaying, isMuted, step.audioPreset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number; color: string; life: number; maxLife: number }> = [];

    // Initialize particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.6 - Math.random() * 1.4,
        radius: 2 + Math.random() * 4,
        alpha: Math.random() * 0.6 + 0.2,
        color: step.accentColor,
        life: 0,
        maxLife: 60 + Math.random() * 60,
      });
    }

    let lastTime = Date.now();

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const currentProg = Math.min(1, (elapsed % loopDuration) / loopDuration);

      if (isPlaying) {
        setProgress(currentProg);
        if (currentProg > 0.98 && onStepComplete) {
          // step near end
        }
      }

      const w = canvas.width;
      const h = canvas.height;
      const time = now * 0.002;

      // 1. Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, step.videoBgColor);
      bgGrad.addColorStop(1, step.videoSecondaryColor);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Zellij / Moroccan subtle decorative geometry backdrop
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < w; x += gridSize) {
        for (let y = 0; y < h; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize * 0.4, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Render specific cooking action animation
      renderCookingAction(ctx, w, h, step.videoActionType, time, step);

      // 4. Render rising steam & spice particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * 0.7;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife || p.y < -10) {
          p.x = w * 0.2 + Math.random() * (w * 0.6);
          p.y = h * 0.75 + Math.random() * 20;
          p.life = 0;
          p.alpha = Math.random() * 0.6 + 0.2;
        }
      });

      // 5. Cinematic Vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.8);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [step, isPlaying]);

  const renderCookingAction = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    action: VideoActionType,
    time: number,
    currStep: RecipeStep
  ) => {
    ctx.save();
    const cx = w / 2;
    const cy = h * 0.55;

    if (action === 'simmer_tajine' || action === 'marinade') {
      // Draw earthenware tagine base dish
      ctx.fillStyle = '#853715';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, w * 0.38, h * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#D97706';
      ctx.stroke();

      // Rich bubbling sauce
      const sauceGrad = ctx.createRadialGradient(cx, cy + 25, 10, cx, cy + 25, w * 0.34);
      sauceGrad.addColorStop(0, '#F59E0B');
      sauceGrad.addColorStop(0.6, '#B45309');
      sauceGrad.addColorStop(1, '#78350F');
      ctx.fillStyle = sauceGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 25, w * 0.35, h * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Simmering bubbles
      for (let i = 0; i < 6; i++) {
        const angle = i * 1.05 + time * 0.8;
        const dist = 30 + Math.sin(time + i) * 25;
        const bx = cx + Math.cos(angle) * dist;
        const by = cy + 25 + Math.sin(angle) * (dist * 0.4);
        const bRad = 4 + Math.sin(time * 3 + i) * 3;

        ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
        ctx.beginPath();
        ctx.arc(bx, by, Math.max(1, bRad), 0, Math.PI * 2);
        ctx.fill();
      }

      // Meat pieces / ingredients in tagine
      const pieces = [
        { x: -50, y: 15, r: 24, col: '#78350F' },
        { x: 30, y: 20, r: 28, col: '#92400E' },
        { x: -10, y: 35, r: 20, col: '#B45309' },
      ];
      pieces.forEach((p, idx) => {
        ctx.save();
        ctx.translate(cx + p.x, cy + p.y + Math.sin(time * 1.5 + idx) * 2);
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.roundRect(-p.r, -p.r * 0.7, p.r * 2, p.r * 1.4, 8);
        ctx.fill();
        ctx.strokeStyle = '#FCD34D';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      });

      // Conical tagine lid contour floating or steam condensing
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.32, cy + 20);
      ctx.quadraticCurveTo(cx, cy - h * 0.32, cx, cy - h * 0.35);
      ctx.quadraticCurveTo(cx, cy - h * 0.32, cx + w * 0.32, cy + 20);
      ctx.stroke();
    } else if (action === 'caramelize') {
      // Golden honey pot / skillet with glazed prunes
      ctx.fillStyle = '#451A03';
      ctx.beginPath();
      ctx.arc(cx, cy + 20, w * 0.32, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Honey amber swirl
      const honeyGrad = ctx.createRadialGradient(cx, cy + 20, 5, cx, cy + 20, w * 0.3);
      honeyGrad.addColorStop(0, '#FEF08A');
      honeyGrad.addColorStop(0.5, '#F59E0B');
      honeyGrad.addColorStop(1, '#92400E');
      ctx.fillStyle = honeyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy + 20, w * 0.29, 0, Math.PI * 2);
      ctx.fill();

      // Caramelized glistening prunes
      const prunes = [
        { x: -35, y: -10, r: 16 },
        { x: 25, y: -15, r: 18 },
        { x: -10, y: 25, r: 17 },
        { x: 40, y: 20, r: 15 },
        { x: -45, y: 30, r: 14 },
      ];
      prunes.forEach((pr, i) => {
        ctx.save();
        ctx.fillStyle = '#1C1917';
        ctx.beginPath();
        ctx.ellipse(cx + pr.x, cy + 20 + pr.y, pr.r, pr.r * 0.8, i, 0, Math.PI * 2);
        ctx.fill();

        // Shiny glaze highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.ellipse(cx + pr.x - 3, cy + 20 + pr.y - 3, pr.r * 0.35, pr.r * 0.2, i, 0, Math.PI * 2);
        ctx.fill();

        // Cinnamon dust speckles
        ctx.fillStyle = '#FBBF24';
        ctx.fillRect(cx + pr.x + 2, cy + 20 + pr.y, 2, 2);
        ctx.fillRect(cx + pr.x - 4, cy + 20 + pr.y + 4, 1.5, 1.5);
        ctx.restore();
      });
    } else if (action === 'steam_couscous') {
      // Couscoussier Keskas perforated steamer
      ctx.fillStyle = '#78716C';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 50, w * 0.36, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Fluffy golden semolina mound (Dôme de Couscous)
      const couscousGrad = ctx.createRadialGradient(cx, cy + 20, 10, cx, cy + 30, w * 0.32);
      couscousGrad.addColorStop(0, '#FEF08A');
      couscousGrad.addColorStop(0.6, '#FACC15');
      couscousGrad.addColorStop(1, '#CA8A04');
      ctx.fillStyle = couscousGrad;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.34, cy + 45);
      ctx.quadraticCurveTo(cx, cy - 35 + Math.sin(time * 2) * 3, cx + w * 0.34, cy + 45);
      ctx.closePath();
      ctx.fill();

      // Couscous grains texture
      ctx.fillStyle = 'rgba(161, 98, 7, 0.4)';
      for (let g = 0; g < 40; g++) {
        const gx = cx - 90 + (g % 10) * 18 + (Math.sin(g + time) * 3);
        const gy = cy + Math.floor(g / 10) * 12;
        ctx.fillRect(gx, gy, 2, 2);
      }
    } else if (action === 'fold_pastilla') {
      // Golden round warqa pastilla folding
      ctx.save();
      ctx.translate(cx, cy + 20);
      ctx.rotate(time * 0.15);

      // Base circle
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(0, 0, w * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Folded pleats (pétales de warqa)
      for (let p = 0; p < 8; p++) {
        ctx.save();
        ctx.rotate((p * Math.PI) / 4);
        ctx.fillStyle = p % 2 === 0 ? '#F59E0B' : '#FBBF24';
        ctx.beginPath();
        ctx.ellipse(0, -w * 0.16, w * 0.12, w * 0.22, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Almond & cinnamon center
      ctx.fillStyle = '#78350F';
      ctx.beginPath();
      ctx.arc(0, 0, w * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FEF08A';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    } else if (action === 'shape_pastry') {
      // Gazelle horn shaping
      ctx.fillStyle = '#FFFDF5';
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3;

      // Crescent moon shape
      ctx.beginPath();
      ctx.moveTo(cx - 70, cy + 30);
      ctx.bezierCurveTo(cx - 30, cy - 40 + Math.sin(time) * 4, cx + 30, cy - 40 + Math.sin(time) * 4, cx + 70, cy + 30);
      ctx.bezierCurveTo(cx + 25, cy - 10, cx - 25, cy - 10, cx - 70, cy + 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Elegant crimping ridges
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.6)';
      ctx.lineWidth = 1.5;
      for (let c = -40; c <= 40; c += 14) {
        ctx.beginPath();
        ctx.moveTo(cx + c, cy - 18);
        ctx.lineTo(cx + c, cy - 28);
        ctx.stroke();
      }
    } else {
      // General simmering pot
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, w * 0.34, h * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3;
      ctx.stroke();

      const glowGrad = ctx.createRadialGradient(cx, cy + 20, 5, cx, cy + 20, w * 0.3);
      glowGrad.addColorStop(0, '#FEF08A');
      glowGrad.addColorStop(0.5, '#F59E0B');
      glowGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + 20, w * 0.32, h * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    soundEngine.playClick();
  };

  const handleRestart = () => {
    startTimeRef.current = Date.now();
    setProgress(0);
    setIsPlaying(true);
    soundEngine.playClick();
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playClick();
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-slate-950 text-white shadow-xl ${compact ? 'aspect-video' : 'aspect-4/3 md:aspect-16/9'}`}>
      <canvas
        ref={canvasRef}
        width={640}
        height={compact ? 360 : 420}
        className="h-full w-full object-cover"
      />

      {/* Top Overlay Badge & Step info */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-amber-200">
            Étape {step.stepNumber} · {step.title}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleToggleMute}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            className="p-2 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4 text-amber-300" />}
          </button>
        </div>
      </div>

      {/* Central Chef Tip Overlay banner on bottom half */}
      <div className="absolute bottom-12 left-3 right-3 pointer-events-none">
        <div className="bg-gradient-to-r from-black/85 via-black/75 to-black/85 backdrop-blur-md p-2.5 rounded-lg border border-amber-500/30">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300 mb-0.5">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Secret de grand-mère à cette étape :</span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
            {step.chefSecret}
          </p>
        </div>
      </div>

      {/* Bottom Video Control Bar with Scrub progress */}
      <div className="absolute bottom-0 left-0 right-0 h-11 bg-black/80 backdrop-blur-md px-3 flex items-center gap-3 border-t border-white/10">
        <button
          onClick={handleTogglePlay}
          className="p-1.5 text-white hover:text-amber-400 transition-colors"
          title={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </button>

        <button
          onClick={handleRestart}
          className="p-1.5 text-slate-300 hover:text-white transition-colors"
          title="Recommencer l'étape"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        {/* Video progress track */}
        <div className="flex-1 relative h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <span className="text-[11px] font-mono text-slate-300 shrink-0">
          {Math.floor(progress * step.durationMinutes)}m / {step.durationMinutes}m
        </span>
      </div>
    </div>
  );
};
