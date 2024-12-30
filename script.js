// script.js

document.addEventListener("DOMContentLoaded", () => {
  const envelopeContainer = document.getElementById("envelope-container");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let w, h, particles = [], probability = 0.04, xPoint, yPoint;

  // Make the envelope clickable to open it
  envelopeContainer.addEventListener("click", () => {
    envelopeContainer.classList.add("open");
  });

  // Resize canvas on window resize
  window.addEventListener("resize", resizeCanvas, false);

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  // Particle animation setup
  function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
  }

  function update() {
    if (particles.length < 500 && Math.random() < probability) {
      createFirework();
    }
    let alive = [];
    for (let i = 0; i < particles.length; i++) {
      if (particles[i].move()) {
        alive.push(particles[i]);
      }
    }
    particles = alive;
  }

  function paint() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < particles.length; i++) {
      particles[i].draw(ctx);
    }
  }

  function createFirework() {
    xPoint = Math.random() * (w - 200) + 100;
    yPoint = Math.random() * (h - 200) + 100;
    let nFire = Math.random() * 50 + 100;
    let c = "rgb(" + (~~(Math.random() * 200 + 55)) + ","
             + (~~(Math.random() * 200 + 55)) + ","
             + (~~(Math.random() * 200 + 55)) + ")";
    for (let i = 0; i < nFire; i++) {
      let particle = new Particle();
      particle.color = c;
      let vy = Math.sqrt(25 - particle.vx * particle.vx);
      if (Math.abs(particle.vy) > vy) {
        particle.vy = particle.vy > 0 ? vy : -vy;
      }
      particles.push(particle);
    }
  }

  function Particle() {
    this.w = this.h = Math.random() * 4 + 1;
    this.x = xPoint - this.w / 2;
    this.y = yPoint - this.h / 2;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.alpha = Math.random() * .5 + .5;
    this.color;
  }

  Particle.prototype = {
    gravity: 0.05,
    move: function () {
      this.x += this.vx;
      this.vy += this.gravity;
      this.y += this.vy;
      this.alpha -= 0.01;
      if (this.x <= -this.w || this.x >= screen.width ||
          this.y >= screen.height ||
          this.alpha <= 0) {
            return false;
      }
      return true;
    },
    draw: function (c) {
      c.save();
      c.beginPath();
      c.translate(this.x + this.w / 2, this.y + this.h / 2);
      c.arc(0, 0, this.w, 0, Math.PI * 2);
      c.fillStyle = this.color;
      c.globalAlpha = this.alpha;
      c.closePath();
      c.fill();
      c.restore();
    }
  }

  // Initialize canvas size and start the animation
  resizeCanvas();
  window.requestAnimationFrame(updateWorld);
});
