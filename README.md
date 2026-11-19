# ÆTHER.MAG — Interactive Editorial Magazine

An independent interactive digital magazine built with React, Vite, TypeScript, Tailwind CSS, GSAP ScrollTrigger, and Three.js (`.ply` point clouds & 3D bookshelf).

## Featured Artists & Contributors (Issue 001)

- **Nkosinathi Titus** *(Johannesburg, South Africa)* — Creative Coder & TouchDesigner Artist
  Featured Project: *Signal and Noise* (`TD-001-A` through `TD-001-H`, `TDMovieOut.0` / `TDMovieOut.1`, and `Mike.ply` interactive atmospheric point-cloud studies)
- **Noa Vale** *(Berlin, Germany)* — Material Researcher & Textile Sculptor
  Featured Essay: *A Language Made of Folds*
- **Eli Kade** *(Tokyo & Nagano, Japan)* — Long-Exposure Nocturnal Photographer
  Featured Essay: *Where the Light Stays*

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

- Place **2D images & video** in `public/assets/works/`
- Place **3D `.ply` point clouds** (`hero-pointcloud.ply`, `Mike.ply`) in `public/assets/Models/` (or `public/assets/models/`) — keep each `.ply` file under **100 MB** for standard GitHub pushes (exact capitalization matters on GitHub Pages Linux servers).

## Deploy on GitHub Pages

A GitHub Actions workflow is already configured in `.github/workflows/deploy.yml` and automatically adjusts Vite's `--base` path for your repository name.

1. Create a new repository on GitHub (for example, `aethermag`).
2. Inside your project folder, push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial ÆTHER.MAG commit"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/aethermag.git
   git push -u origin main
   ```
3. On GitHub, open your repository **Settings → Pages**:
   - Under **Build and deployment → Source**, select **GitHub Actions**.
4. Your site will build and go live automatically at `https://<YOUR-USERNAME>.github.io/aethermag/` on every push to `main`.
