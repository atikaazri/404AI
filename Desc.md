# Algorithm Documentation

A detailed guide to the mathematical principles, history, and implementation of each algorithm in the Algorithmic Art Lab.

---

## Table of Contents

1. [Trianglify](#trianglify)
2. [Perlin Flow Field](#perlin-flow-field)
3. [L-System Trees](#l-system-trees)
4. [Don't Touch Me (Particle Physics)](#dont-touch-me)
5. [Ripped Cloth (Spring Physics)](#ripped-cloth)
6. [Morphing Blobs (Metaballs)](#morphing-blobs)
7. [Transparent Earth (Fibonacci Sphere)](#transparent-earth)
8. [Voronoi Flowers](#voronoi-flowers)
9. [Wavy Mountains](#wavy-mountains)
10. [Mandelbrot Set](#mandelbrot-set)

---

## Trianglify

### Mathematical Foundation
**Delaunay Triangulation** is a method of connecting a set of points to form triangles such that no point is inside the circumcircle of any triangle.

**Key Properties:**
- Maximizes the minimum angle of all triangles
- Dual of Voronoi diagram
- Unique for a given point set (excluding degenerate cases)

**Algorithm:** Bowyer-Watson (1981)
```
For each point p:
  Find all triangles whose circumcircle contains p
  Remove these triangles (creates a polygonal hole)
  Re-triangulate the hole by connecting p to all boundary edges
```

### History
- **1934**: Boris Delaunay first described these triangulations
- **1977**: D.T. Lee and B.J. Schachter develop divide-and-conquer algorithm O(n log n)
- **Modern use**: 3D graphics, terrain modeling, mesh generation

### Our Implementation
We use a simplified grid-based approach:
```javascript
points = [];
for each grid cell:
  x = gridX + random(-variance, variance)
  y = gridY + random(-variance, variance)
  points.push({x, y})

// Connect neighboring points to form triangles
// Color based on position: hue = (x/width + y/height) / 2
```

**Parameters:**
- **Cell Size**: Distance between grid points (20-200px)
- **Variance**: Randomization factor (0-1.0)

### Applications
- Low-poly art backgrounds
- Website headers (Trianglify.js library)
- Data visualization
- Terrain generation

---

## Perlin Flow Field

### Mathematical Foundation
**Perlin Noise** is a gradient noise function developed by Ken Perlin in 1983.

**Mathematical Definition:**
```
noise(x, y, z, t) = interpolate(
  gradient vectors at lattice points,
  smoothstep interpolation
)
```

**Flow Field Equation:**
```
angle(x, y, t) = noise(x × scale, y × scale, t) × 2π × 4
force = vector from angle
velocity += force
velocity × damping (0.96)
position += velocity
```

### History
- **1983**: Ken Perlin develops Perlin noise for the movie "Tron"
- **1997**: Wins Academy Award for Technical Achievement
- **2001**: Simplex noise (improved version) published
- **Modern use**: Procedural generation in games (Minecraft terrain)

### Key Concepts

**Perlin Noise Properties:**
- Smooth, natural-looking randomness
- Coherent: nearby inputs produce nearby outputs
- Repeatable: same input always gives same output
- Scale-invariant: can be sampled at different frequencies

**Damping Factor (0.96):**
```
Each frame: velocity = velocity × 0.96
Result: 4% velocity loss per frame
Effect: Smooth curves instead of straight lines
```

### Our Implementation
```javascript
// For each particle:
angle = noise(x × 0.003, y × 0.003, time × 0.001) × TWO_PI × 4
force = vector.fromAngle(angle) × speed
velocity.add(force)
velocity.mult(0.96)  // Critical for smooth curves!
position.add(velocity)
```

**Parameters:**
- **Count**: 100-5000 particles
- **Speed**: Force multiplier (0.1-5.0)
- **Scale**: Noise zoom level (0.001-0.03)
- **Trail**: Opacity of fade effect (0.001-0.03)
- **Particle Size**: 1-5 pixels

### Applications
- Fluid simulation visualization
- Smoke and fog effects
- Hair/fur animation
- Organic motion patterns

---

## L-System Trees

### Mathematical Foundation
**Lindenmayer Systems (L-Systems)** are parallel rewriting systems invented by Aristid Lindenmayer in 1968.

**Formal Definition:**
```
L-System = (V, ω, P)
V = alphabet (variables)
ω = axiom (initial string)
P = production rules (variable → replacement)
```

**Example (Binary Tree):**
```
Axiom: F
Rules: F → FF+[+F-F-F]-[-F+F+F]
Iterations:
0: F
1: FF+[+F-F-F]-[-F+F+F]
2: (FF+[+F-F-F]-[-F+F+F])(FF+[+F-F-F]-[-F+F+F])+[+(FF+[+F-F-F]-[-F+F+F])-(FF+[+F-F-F]-[-F+F+F])...]
```

**Turtle Graphics Interpretation:**
```
F = draw forward
+ = turn right by angle θ
- = turn left by angle θ
[ = push state (position, angle) to stack
] = pop state from stack
```

### History
- **1968**: Aristid Lindenmayer invents L-systems to model algae growth
- **1990**: "The Algorithmic Beauty of Plants" by Prusinkiewicz & Lindenmayer
- **Modern use**: Game development, procedural plant generation, fractal art

### Our Implementation

**Three Presets:**

1. **Tree**
   ```
   Axiom: F
   Rule: F → FF+[+F-F-F]-[-F+F+F]
   Angle: 25°
   Iterations: 5
   ```

2. **Bush**
   ```
   Axiom: F
   Rule: F → F[+F]F[-F][F]
   Angle: 20°
   Iterations: 6
   ```

3. **Fern**
   ```
   Axiom: X
   Rules: X → F+[[X]-X]-F[-FX]+X
          F → FF
   Angle: 25°
   Iterations: 6
   ```

### Complexity Growth
```
String length grows exponentially:
Iteration 0: 1 symbol
Iteration 1: 19 symbols
Iteration 2: 361 symbols
Iteration 3: 6,859 symbols
...
Limited to 100,000 symbols for performance
```

**Parameters:**
- **Iterations**: Recursion depth (1-8)
- **Angle**: Branch angle in degrees (5-90°)
- **Length**: Line segment length (2-20px)

### Applications
- Procedural plant generation
- Educational tool for understanding recursion
- Fractal art
- Natural pattern modeling

---

## Don't Touch Me

### Mathematical Foundation
**Spring-Mass System** with attraction and repulsion forces.

**Home Position (Fibonacci Sphere):**
```
For point i out of n points:
  y = 1 - (i / (n-1)) × 2
  radius = sqrt(1 - y²)
  theta = i × golden_angle
  x = cos(theta) × radius
  z = sin(theta) × radius

golden_angle = π × (3 - sqrt(5)) ≈ 2.39996 radians
```

**Force Equations:**
```
Spring force (attraction to home):
F_spring = (home_position - current_position) × 0.01

Repulsion force (from mouse):
distance = |particle_position - mouse_position|
if distance < repel_radius:
  direction = normalize(particle_position - mouse_position)
  strength = repel_strength × (1 - distance/repel_radius)
  F_repel = direction × strength

Total force:
velocity += F_spring + F_repel
velocity × 0.9  // Damping
position += velocity
```

### History
- **1687**: Newton's laws of motion (F = ma)
- **1678**: Hooke's law for springs (F = -kx)
- **1960s**: First computer simulations of particle systems
- **1983**: William Reeves introduces particle systems for "Star Trek II"

### Key Concepts

**Golden Angle (137.5°):**
- Optimal angle for distributing points on a sphere
- Related to Fibonacci sequence and golden ratio
- Used in phyllotaxis (arrangement of leaves on plants)

**Damping Factor (0.9):**
- Prevents oscillation
- Simulates air resistance
- Creates smooth, organic motion

### Our Implementation
```javascript
particles = 8000
attraction = 0.01
damping = 0.9
repel_strength = 28

// Each frame:
for each particle:
  home = fibonacci_sphere_position(particle.index, angle)
  spring_force = (home - particle.pos) × attraction
  
  if dist(particle, mouse) < repel_radius:
    repel_force = away_from_mouse × repel_strength
  
  particle.velocity += spring_force + repel_force
  particle.velocity × damping
  particle.position += velocity

angle += 0.01  // Slow rotation
```

**Responsive Sizing:**
```
radius = 35% of min(canvas_width, canvas_height)
repel_radius = 35% of main_radius
```

### Applications
- Interactive installations
- Physics simulations
- Educational demonstrations
- Particle effects in games

---

## Ripped Cloth

### Mathematical Foundation
**Mass-Spring System** for cloth simulation.

**Node Equation (Point Mass):**
```
Force on node = Σ(spring forces from connected nodes)
Acceleration = Force / mass × force_multiplier
Velocity += Acceleration
Velocity × friction
Position += Velocity

If pinned: Position remains fixed
```

**Spring Force (Hooke's Law):**
```
For link between node1 and node2:
difference = node2.position - node1.position
force1 = +difference  // Pull towards node2
force2 = -difference  // Pull towards node1
```

**Constraint Solving:**
```
Each frame:
1. Update all spring forces
2. Apply forces to nodes
3. Update velocities and positions
4. Apply damping (friction = 0.99)
```

### History
- **1995**: Provot introduces "Deformation Constraints in a Mass-Spring Model"
- **1998**: Baraff & Witkin develop implicit integration for cloth
- **2000s**: GPU acceleration enables real-time cloth simulation
- **Modern use**: Games, animation, virtual try-on for e-commerce

### Our Implementation

**Grid Structure:**
```
40×40 grid = 1,681 nodes
Each node connected to neighbors (up, down, left, right, diagonals)
Edge nodes are pinned (fixed in place)

Link creation:
for each node:
  for each neighbor within distance ≤ grid_spacing:
    if not both pinned:
      create spring link
```

**Cutting Mechanism:**
```
On mouse drag:
  for each link:
    middle_point = (node1.pos + node2.pos) / 2
    if dist(middle_point, mouse) < knife_range:
      remove link
      add to cut_history for undo
```

**Parameters:**
```javascript
gridCount = 40        // Resolution
friction = 0.99       // Damping (0.99 = 1% energy loss)
forceMultiplier = 0.25 // Spring stiffness
knifeRange = 10       // Cutting radius in pixels
speedLimit = 8        // Maximum velocity
```

### Key Concepts

**Spring Stiffness:**
- Higher values = stiffer cloth
- Lower values = more flexible, flowing

**Friction (Damping):**
- Prevents endless oscillation
- 0.99 = realistic cloth behavior
- Too low = jello-like
- Too high = stiff/dead

**Verlet Integration (implicit in our approach):**
```
position_new = position + velocity × dt + 0.5 × acceleration × dt²
```

### Applications
- Game physics (flags, capes, banners)
- Animation (character clothing)
- Virtual fashion/try-on
- Medical simulation (tissue)

---

## Morphing Blobs

### Mathematical Foundation
**Metaballs** (also called blobs) are organic-looking implicit surfaces.

**Implicit Surface Definition:**
```
For each point (x, y) in space:
  field_strength = Σ(1 / distance_to_blob_i²)
  
  if field_strength > threshold:
    point is inside surface
```

**Connection Algorithm (Our Simplified Version):**
```
For each pair of blobs (ball1, ball2):
  if distance too far: skip
  if distance too close: skip
  
  Calculate tangent points:
  angle1 = atan2(ball2 - ball1)
  angle2 = acos((radius1 - radius2) / distance)
  
  p1a = ball1 + vector_at_angle(angle1 + angle2) × radius1
  p1b = ball1 + vector_at_angle(angle1 - angle2) × radius1
  p2a = ball2 + vector_at_angle(angle1 + π - angle2) × radius2
  p2b = ball2 + vector_at_angle(angle1 - π + angle2) × radius2
  
  Connect with bezier curves using handles perpendicular to radii
```

**Bezier Curve:**
```
B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃
where t ∈ [0,1]
P₀, P₃ = endpoints
P₁, P₂ = control points (handles)
```

### History
- **1982**: Jim Blinn introduces "blobby" model for molecular visualization
- **1989**: Geoff Wyvill uses metaballs for character animation
- **1990s**: Used in morphing effects (Terminator 2, The Abyss)
- **Modern use**: Logo design, UI effects, organic shapes

### Our Implementation

**Grid of Blobs:**
```javascript
gridSize = 4  // 4×4 grid = 16 blobs
+ 1 mouse-following blob = 17 total

spacing = canvas_width / gridSize

for x in [0..gridSize]:
  for y in [0..gridSize]:
    position = (x × spacing + spacing/2, y × spacing + spacing/2)
    color = random from theme colors
```

**Metaball Connection:**
```javascript
for each blob pair:
  distance = dist(blob1.center, blob2.center)
  
  if distance > maxDistance: skip  // Too far
  if distance < (radius1 + radius2 - 8): skip  // Overlapping
  
  // Calculate 4 tangent points
  // Create bezier path with handles
  // Draw with gradient between blob colors
```

**Parameters:**
- **Grid Size**: 2-8 (number of blobs in each direction)
- **Blob Radius**: 30-150 pixels
- **Connection Distance**: 50-300 pixels (max distance for connections)
- **Handle Rate**: 1-6 (bezier curve smoothness)

### Key Concepts

**Handle Length Rate:**
```
handle_length = min(
  handle_rate × connection_strength,
  distance_between_tangent_points / (radius1 + radius2)
)

Higher value = more pronounced curves
Lower value = straighter connections
```

**Color Gradient:**
```
Linear gradient from blob1.color to blob2.color
Creates smooth color transitions in connections
```

### Applications
- Logo animation
- UI loading indicators
- Organic transitions
- Character design (soft-body creatures)
- Data visualization

---

## Transparent Earth

### Mathematical Foundation
**Fibonacci Sphere** for even point distribution on a sphere.

**Golden Ratio Distribution:**
```
φ = (1 + sqrt(5)) / 2 ≈ 1.618 (golden ratio)
golden_angle = π × (3 - sqrt(5)) ≈ 137.5°

For point i of n total points:
  y = 1 - (i / (n-1)) × 2        // Ranges from 1 to -1
  radius_at_y = sqrt(1 - y²)      // Circle radius at height y
  theta = i × golden_angle        // Spiral angle
  
  x = cos(theta) × radius_at_y
  y = y
  z = sin(theta) × radius_at_y
```

**4D Perlin Noise Displacement:**
```
noise_value = noise(x × zoom, y × zoom, z × zoom, time)
displaced_radius = base_radius + noise_value × amplitude

final_position = (x, y, z) × displaced_radius
```

**Color Interpolation:**
```
color_lerp_factor = noise_value  // Ranges 0-1
final_color = lerp(theme.primary, theme.secondary, color_lerp_factor)

RGB lerp:
r = r1 + (r2 - r1) × factor
g = g1 + (g2 - g1) × factor  
b = b1 + (b2 - b1) × factor
```

### History
- **~300 BC**: Greeks study sphere geometry
- **1202**: Fibonacci sequence introduced to Western mathematics
- **2009**: Fibonacci sphere algorithm popularized for computer graphics
- **Modern use**: Particle effects, planet generation, point cloud visualization

### Our Implementation

```javascript
// Setup
points = []
for i in [0..pointCount]:
  // Fibonacci sphere position
  y = 1 - (i / (pointCount - 1)) × 2
  radius_xy = sqrt(1 - y²)
  theta = i × golden_angle
  
  base_x = cos(theta) × radius_xy
  base_y = y
  base_z = sin(theta) × radius_xy
  
  points.push({baseX, baseY, baseZ})

// Each frame
for each point:
  noise = perlin_noise(
    point.baseX × noiseZoom,
    point.baseY × noiseZoom,
    point.baseZ × noiseZoom,
    time
  )
  
  displaced_radius = base_radius + noise × amplitude × 50
  
  x = point.baseX × displaced_radius
  y = point.baseY × displaced_radius
  z = point.baseZ × displaced_radius
  
  color = lerp(theme.primary, theme.secondary, noise)
  
  draw point at 3D position (x, y, z) with color
```

**Parameters:**
- **Point Count**: 1000-8000
- **Radius Scale**: 20-50% of canvas size
- **Noise Zoom**: 0.1-5.0 (frequency of displacement)
- **Noise Amplitude**: 0.01-1.0 (strength of displacement)
- **Rotation Speed**: 0.001-0.02
- **Progression Rate**: 0.0001-0.02 (speed of noise animation)

### Key Concepts

**Why Golden Angle?**
- Most irrational number (hardest to approximate with fractions)
- Prevents alignment patterns
- Same principle as sunflower seed arrangement in nature

**4D Noise (x, y, z, time):**
- First 3 dimensions: spatial coordinates on sphere
- 4th dimension: time, creates smooth animation
- Result: Organic, breathing motion

### Applications
- Planet/celestial body visualization
- Point cloud rendering
- Particle systems
- Scientific data visualization
- Procedural sphere generation

---

## Voronoi Flowers

### Mathematical Foundation
**Voronoi Diagram** partitions a plane into regions based on distance to seed points.

**Formal Definition:**
```
For seed points P = {p₁, p₂, ..., pₙ}
Voronoi cell for pᵢ:
V(pᵢ) = {x : dist(x, pᵢ) ≤ dist(x, pⱼ) for all j ≠ i}

In words: All points closer to pᵢ than any other seed point
```

**Lloyd's Relaxation:**
```
Repeat k times:
  1. Compute Voronoi diagram
  2. For each cell:
     - Find centroid (average position of all points in cell)
     - Move seed point to centroid
  
Result: More evenly distributed points
```

**Petal Growth Algorithm:**
```
For each flower:
  theta = 2π × petal_number / total_petals + random_offset
  
  Start from center, radius = 0
  While radius can grow:
    radius += 1
    position = center + (cos(theta), sin(theta)) × radius
    circle_size = radius × sin(2π / total_petals)
    
    if position outside bounds: break
    if overlaps other flower's petal: break
    
    draw circle at position with size
```

### History
- **1644**: Descartes uses Voronoi-like diagrams for cosmology
- **1854**: Voronoi cells used by John Snow to trace cholera outbreak
- **1908**: Georgy Voronoy formalizes the concept
- **1957**: Lloyd's algorithm for centroidal Voronoi tessellation
- **Modern use**: Biology (cell structure), geography (service areas), games (territory)

### Our Implementation

```javascript
// Initialization
flowers = []
for i in [0..flowerCount]:
  x = random(margin, width - margin)
  y = random(margin, height - margin)
  flowers.push({
    center: (x, y),
    rotation: random(0, 2π),
    petals_remaining: shuffle([0,1,2,...,petalCount-1])
  })

// Lloyd's relaxation (3 iterations)
for iteration in [0..2]:
  voronoi_grid = compute_voronoi_cells(flowers)
  for each flower:
    centroid = average_position(voronoi_grid[flower.id])
    flower.center = constrain(centroid, margin, size - margin)

// Petal growth (each frame draws one petal)
current_flower = flowers[current_index]
petal_angle = 2π × next_petal / petalCount + flower.rotation

radius = 0
while can_grow:
  x = center.x + cos(petal_angle) × radius
  y = center.y + sin(petal_angle) × radius
  diameter = radius × sin(2π / petalCount)
  
  draw circle(x, y, diameter) in primary_color
  radius++

// When all petals done, draw center
center_size = average(all_petal_diameters)
draw circle(center, center_size) in secondary_color
```

**Parameters:**
- **Flower Count**: 5-40 (number of flowers)
- **Petals per Flower**: 6-24
- **Margin**: 20-150 pixels (border space)

### Key Concepts

**Voronoi Properties:**
- Dual of Delaunay triangulation
- Convex cells (except unbounded ones at edges)
- Used in nature: giraffe patterns, cell structures

**Lloyd's Relaxation:**
- Iterative smoothing algorithm
- Produces more aesthetically pleasing distributions
- 3-5 iterations usually sufficient

**Radial Growth:**
```
Petal angle spacing = 2π / petalCount
Circle diameter = radius × sin(angle_spacing)

This ensures circles touch but don't overlap
```

### Applications
- Organic pattern generation
- Territory visualization in games
- Cell simulation
- Decorative art
- Network analysis (service coverage)

---

## Wavy Mountains

### Mathematical Foundation
**Sine Wave Modulation** with **Perlin Noise**.

**Basic Sine Wave:**
```
y = A × sin(ωx + φ)
where:
A = amplitude
ω = angular frequency (2π / wavelength)
φ = phase shift
```

**Our Combined Function:**
```
For layer at height h:
  noise_offset = noise(5 × h)
  center_x = noise_offset × width
  
  For each x position:
    angle = map(x, 0, width, π/2, 5π/2) + (noise_offset - 0.5) × 4
    noise_height = noise(x/width × 10, h/height × 10, time/1500)
    
    y = sin(angle) × (canvas_size / 4) × noise_height + h
```

**Color Gradient:**
```
For layer i:
  progress = i / total_layers
  color = lerp(color1, color2, progress / 2)
  opacity = transparency_setting
```

### History
- **1822**: Joseph Fourier shows any periodic function can be decomposed into sines
- **1807**: Fourier series introduces concept of frequency domain
- **1960s**: Sine waves used in early computer graphics
- **1983**: Perlin noise adds natural variation to procedural generation

### Our Implementation

```javascript
layers = 12  // Number of mountain layers
padding = canvas_size × 0.2

for y = padding to height + padding, step = padding/layers:
  layer_progress = y / (height + padding)
  
  // Color interpolation
  color = lerp(color1, color2, layer_progress / 2)
  color.opacity = transparency
  
  // Perlin noise for variation
  noise_y = noise(5 × y / height)
  center_x = noise_y × width
  
  // Draw wavy shape
  begin_shape()
  vertex(0, height + y)  // Start below screen
  
  for x = 0 to width, step = width × 0.01:
    // Sine wave angle with noise offset
    angle = map(x, 0, width, π/2, 5π/2) + (noise_y - 0.5) × 4
    
    // Height modulation with time-varying noise
    height_noise = noise(x/width × 10, y/height × 10, time/1500)
    
    // Final y position
    yy = sin(angle) × (canvas_size / 4) × height_noise + y
    
    vertex(x, yy)
  
  vertex(width, height + y)  // End below screen
  end_shape()
  fill(color)

time += 1  // Animate
```

**Parameters:**
- **Transparency**: 50-255 (alpha channel)
- **Layers**: 5-20 (number of mountain ridges)
- **Custom Colors**: Optional override of theme colors

### Key Concepts

**Sine Wave Properties:**
```
Period = 2π
Our range: π/2 to 5π/2 = 2π (one complete cycle)
This creates one "mountain" across the width
```

**Noise Modulation:**
- Spatial noise (x/width × 10, y/height × 10): Creates variation in mountain shape
- Temporal noise (time/1500): Animates the mountains slowly
- Layer offset noise (5 × y): Makes each layer different

**Layering Effect:**
- Back-to-front rendering
- Transparency allows layers to show through
- Color gradient creates depth perception

### Applications
- Background landscapes
- Parallax scrolling effects
- Music visualizations
- Procedural terrain
- Abstract art

---

## Mandelbrot Set

### Mathematical Foundation
The **Mandelbrot Set** is one of the most famous fractals, discovered by Benoit Mandelbrot in 1980.

**Definition:**
```
For each complex number c = a + bi:
  Start with z₀ = 0
  Iterate: zₙ₊₁ = zₙ² + c
  
  If |zₙ| remains bounded (≤ 2) after infinite iterations:
    c is in the Mandelbrot set (colored black)
  Else:
    c is outside (colored based on escape speed)
```

**Complex Number Arithmetic:**
```
Given z = x + yi and c = a + bi:

z² = (x + yi)² 
   = x² + 2xyi + (yi)²
   = x² - y² + 2xyi    (since i² = -1)

z² + c = (x² - y² + a) + (2xy + b)i

Therefore:
  x_new = x² - y² + a
  y_new = 2xy + b
```

**Escape Time Algorithm:**
```
For each pixel (px, py) on screen:
  // Map pixel to complex plane
  a = map(px, 0, width, -2.5, 1.0)
  b = map(py, 0, height, -1.0, 1.0)
  
  x = 0, y = 0
  iteration = 0
  
  while (x² + y² < 4) and (iteration < max_iterations):
    x_new = x² - y² + a
    y_new = 2×x×y + b
    x = x_new
    y = y_new
    iteration++
  
  if iteration == max_iterations:
    color = black  // In the set
  else:
    color = colormap(iteration)  // Escaped - color by speed
```

### History
- **1905**: Pierre Fatou and Gaston Julia study iteration of complex functions
- **1918**: Julia sets discovered
- **1980**: Benoit Mandelbrot uses computers to visualize the set
- **1985**: First detailed images published, revealing infinite complexity
- **Modern**: Used to demonstrate chaos theory, fractal geometry

### Properties

**Self-Similarity:**
- Zooming into any boundary reveals similar structures
- Infinitely complex at any magnification
- Contains infinite copies of itself (approximately)

**Mathematical Significance:**
- Boundary between order and chaos
- Fractional dimension: ~2 (not quite 1D or 2D)
- Connected set (one piece, despite appearance)

### Coloring Schemes

**Escape Time Coloring:**
```
hue = (iteration / max_iterations) × 360
saturation = 100
brightness = iteration < max_iterations ? 100 : 0
```

**Smooth Coloring (Normalized Iteration Count):**
```
smooth_iteration = iteration + 1 - log(log(|z|)) / log(2)
color = interpolate(color_palette, smooth_iteration)
```

**Distance Estimation:**
```
d = |z| × log(|z|) / |z'|
where z' is derivative of iteration

Useful for detecting boundary precisely
```

### Implementation Example

```javascript
function mandelbrot(p) {
  const max_iterations = 100;
  
  p.setup = function() {
    p.createCanvas(800, 600);
    p.colorMode(p.HSB);
    p.noLoop();
  };
  
  p.draw = function() {
    p.loadPixels();
    
    for (let px = 0; px < p.width; px++) {
      for (let py = 0; py < p.height; py++) {
        // Map pixel to complex plane
        let a = p.map(px, 0, p.width, -2.5, 1.0);
        let b = p.map(py, 0, p.height, -1.0, 1.0);
        
        // Iterate z = z² + c
        let x = 0, y = 0;
        let iteration = 0;
        
        while (x*x + y*y < 4 && iteration < max_iterations) {
          let x_new = x*x - y*y + a;
          let y_new = 2*x*y + b;
          x = x_new;
          y = y_new;
          iteration++;
        }
        
        // Color based on iteration count
        let index = (px + py * p.width) * 4;
        if (iteration === max_iterations) {
          p.pixels[index] = 0;     // Black
          p.pixels[index+1] = 0;
          p.pixels[index+2] = 0;
        } else {
          let hue = p.map(iteration, 0, max_iterations, 0, 360);
          p.colorMode(p.HSB);
          let c = p.color(hue, 100, 100);
          p.pixels[index] = p.red(c);
          p.pixels[index+1] = p.green(c);
          p.pixels[index+2] = p.blue(c);
        }
        p.pixels[index+3] = 255;  // Alpha
      }
    }
    
    p.updatePixels();
  };
}
```

### Interesting Regions to Explore

**Main Features:**
```
Main Cardioid: Centered at origin
Period-2 Bulb: Left side at (-1, 0)
Seahorse Valley: (-0.75, 0.1)
Elephant Valley: (0.3, 0.03)
Triple Spiral Valley: (-0.088, 0.654)
```

**Deep Zoom Coordinates:**
```
Miniature: (-1.7497, 0.00003)
Seahorse: (-0.7453, 0.1127)
Double Spiral: (-0.7269, 0.1889)
```

### Optimization Techniques

**Symmetry:**
```
Mandelbrot set is symmetric about real axis
Only compute top half, mirror for bottom
```

**Cardioid Check:**
```
// Skip iterations if in main cardioid
q = (a - 0.25)² + b²
if q×(q + (a - 0.25)) < 0.25×b²:
  return max_iterations  // In main cardioid
```

**Period-2 Bulb Check:**
```
// Skip if in period-2 bulb
if (a + 1)² + b² < 0.0625:
  return max_iterations  // In period-2 bulb
```

**Perturbation Theory:**
```
For deep zooms:
  Reference orbit: z_ref(n+1) = z_ref(n)² + c_ref
  Perturbation: δ(n+1) ≈ 2×z_ref(n)×δ(n) + (c - c_ref)
  
Result: Much faster for zoomed regions
```

### Applications
- Mathematics education (chaos theory, complex analysis)
- Art and design
- Algorithm visualization
- GPU programming demonstrations
- Fractal compression
- Testing numerical precision

### Extensions

**Julia Sets:**
```
Fix c, vary starting point z₀
z(n+1) = z(n)² + c

Each point in Mandelbrot corresponds to a unique Julia set
Points in Mandelbrot → connected Julia set
Points outside → disconnected Julia "dust"
```

**Higher Powers:**
```
z(n+1) = z(n)³ + c  // Cubic Mandelbrot
z(n+1) = z(n)⁴ + c  // Quartic Mandelbrot

General: z(n+1) = z(n)^d + c
```

**Multibrot Sets:**
```
z(n+1) = |z(n)|^d × e^(i×d×arg(z(n))) + c

d = 2: Classic Mandelbrot
d = 3: "Multibrot 3" with 3-fold symmetry
d = 4: "Multibrot 4" with 4-fold symmetry
```

**Burning Ship:**
```
z(n+1) = (|Re(z(n))| + i|Im(z(n))|)² + c

Creates ship-like structures
Discovered by Michael Michelitsch and Otto E. Rössler (1992)
```

### Further Reading
- "The Fractal Geometry of Nature" by Benoit Mandelbrot (1982)
- "The Beauty of Fractals" by Peitgen & Richter (1986)
- "Fractals Everywhere" by Michael Barnsley (1988)

---

## Mathematical Concepts Across Algorithms

### Common Themes

**1. Noise Functions**
Used in: Perlin Flow, Transparent Earth, Wavy Mountains
- Coherent pseudo-randomness
- Natural-looking variation
- Multiple octaves for detail

**2. Particle Systems**
Used in: Don't Touch Me, Perlin Flow
- Many independent entities
- Simple rules → complex behavior
- Emergent patterns

**3. Geometric Algorithms**
Used in: Trianglify, Voronoi Flowers
- Computational geometry
- Spatial relationships
- Optimal distributions

**4. Physics Simulation**
Used in: Don't Touch Me, Ripped Cloth
- Forces and motion
- Conservation laws
- Numerical integration

**5. Recursive/Fractal Systems**
Used in: L-Systems, Mandelbrot
- Self-similarity
- Infinite complexity
- Simple rules, complex results

### Performance Considerations

**Complexity Analysis:**
```
Trianglify: O(n) where n = number of points
Perlin Flow: O(p×f) where p = particles, f = frames
L-Systems: O(k^n) where k = branching factor, n = iterations
Cloth Simulation: O(nodes × links) per frame
Voronoi: O(n log n) for computation, O(n×f) for rendering
Mandelbrot: O(w×h×i) where i = max iterations
```

**Optimization Strategies:**
1. **Spatial Hashing**: For collision detection
2. **Level of Detail**: Reduce quality when moving
3. **GPU Acceleration**: WebGL for particle systems
4. **Caching**: Store computed noise/fractal values
5. **Incremental Rendering**: Draw one element per frame

---

## References & Further Reading

### Books
1. "The Algorithmic Beauty of Plants" - Prusinkiewicz & Lindenmayer
2. "The Nature of Code" - Daniel Shiffman
3. "Generative Design" - Benedikt Groß et al.
4. "The Fractal Geometry of Nature" - Benoit Mandelbrot
5. "Computational Geometry" - de Berg, Cheong, van Kreveld, Overmars

### Online Resources
1. The Coding Train (YouTube) - Daniel Shiffman
2. Khan Academy - Pixar in a Box
3. Shadertoy - GPU shader examples
4. OpenProcessing - Community generative art
5. Paul Bourke's Geometry Pages

### Papers
1. Perlin, K. (1985). "An Image Synthesizer"
2. Blinn, J. (1982). "A Generalization of Algebraic Surface Drawing"
3. Lloyd, S. (1982). "Least squares quantization in PCM"
4. Bowyer, A. (1981). "Computing Dirichlet tessellations"

---

*Last Updated: 2025*
*Part of the Algorithmic Art Lab Documentation*