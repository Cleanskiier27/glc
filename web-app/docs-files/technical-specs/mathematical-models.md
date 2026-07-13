# Mathematical Models & Equations — NLRS

## Overview

This document provides the core mathematical models used in the design, simulation, and operation of the NetworkBuster Lunar Recycling System (NLRS). Each section presents governing equations with worked examples drawn from real system parameters.

---

## 1. Lunar Gravitational Environment

### 1.1 Gravitational Acceleration

The Moon's surface gravitational acceleration is:

```
g_moon = G * M_moon / R_moon²
```

Where:
- G = 6.674 × 10⁻¹¹ N·m²/kg² (gravitational constant)
- M_moon = 7.342 × 10²² kg
- R_moon = 1.7374 × 10⁶ m

**Result:**

```
g_moon = (6.674e-11 × 7.342e22) / (1.7374e6)²
       = 4.898e12 / 3.019e12
       ≈ 1.62 m/s²
```

This is 16.5 % of Earth's gravity (g_earth = 9.81 m/s²).

**Impact on conveyor load:**

For a 10 kg material batch:

```
F_weight_moon = m × g_moon = 10 × 1.62 = 16.2 N
F_weight_earth = m × g_earth = 10 × 9.81 = 98.1 N
```

Conveyor motors sized for Earth use only ~16.5 % of their rated torque on the Moon.

---

### 1.2 Centrifugal Separation Compensation

Because gravity is weaker, centrifugal separators must spin faster to achieve the same g-force:

```
a_centrifuge = ω² × r
```

To replicate 5 g_earth separation force in the density separator (r = 0.15 m):

```
ω = sqrt(a_target / r)
  = sqrt((5 × 9.81) / 0.15)
  = sqrt(327) 
  ≈ 18.1 rad/s  (≈ 173 RPM)
```

Compare with an Earth-based separator achieving the same effective force:

```
ω_earth_equiv = sqrt((5 × 9.81) / 0.15) = 18.1 rad/s
```

The centrifugal force equation is identical — the lunar gravity only changes the *natural* settling baseline, not the centrifuge requirement. However, for *gravity-assisted* settling (no centrifuge):

```
t_settle = sqrt(2h / g)

t_moon  = sqrt(2 × 0.5 / 1.62)  ≈ 0.786 s
t_earth = sqrt(2 × 0.5 / 9.81)  ≈ 0.319 s
```

Gravity settling takes ~2.5× longer on the Moon.

---

## 2. Thermal Processing — Pyrolysis

### 2.1 Arrhenius Reaction Rate

The rate constant for polymer chain degradation follows the Arrhenius equation:

```
k(T) = A × exp(-Ea / (R × T))
```

Where:
- k = rate constant (s⁻¹)
- A = pre-exponential factor (s⁻¹)
- Ea = activation energy (J/mol)
- R = 8.314 J/(mol·K) (universal gas constant)
- T = temperature (K)

**Example — HDPE pyrolysis (Ea ≈ 200 kJ/mol, A ≈ 1.5 × 10¹⁴ s⁻¹):**

```
At T = 723 K (450°C):
k = 1.5e14 × exp(-200000 / (8.314 × 723))
  = 1.5e14 × exp(-33.28)
  = 1.5e14 × 3.64e-15
  ≈ 0.546 s⁻¹

Half-life: t½ = ln(2) / k = 0.693 / 0.546 ≈ 1.27 s
```

```
At T = 573 K (300°C):
k = 1.5e14 × exp(-200000 / (8.314 × 573))
  = 1.5e14 × exp(-41.99)
  = 1.5e14 × 6.74e-19
  ≈ 1.01e-4 s⁻¹

Half-life: t½ = 0.693 / 1.01e-4 ≈ 6,861 s (1.9 hours)
```

This demonstrates why temperature control is critical — a 150°C increase accelerates the reaction by ~5,400×.

---

### 2.2 Energy Balance for the Thermal Chamber

The total energy required to heat a plastic batch from ambient (T₀ = 20°C = 293 K) to pyrolysis temperature (Tp = 450°C = 723 K):

```
Q_heat = m × Cp × (Tp - T₀)
```

For 1 kg of HDPE (Cp ≈ 2.3 kJ/(kg·K)):

```
Q_heat = 1 × 2300 × (723 - 293)
       = 1 × 2300 × 430
       = 989,000 J  ≈ 0.275 kWh
```

Adding the endothermic pyrolysis reaction enthalpy (ΔH_pyrolysis ≈ 1.6 MJ/kg for HDPE):

```
Q_total = Q_heat + ΔH_pyrolysis × m
        = 989,000 + 1,600,000 × 1
        = 2,589,000 J  ≈ 0.719 kWh
```

This closely matches the measured system value of 0.7–1.0 kWh/kg.

---

### 2.3 Radiative Cooling — Stefan-Boltzmann Law

In the lunar vacuum, convection is zero. Cooling relies entirely on radiation:

```
P_radiated = ε × σ × A × (T⁴ - T_ambient⁴)
```

Where:
- ε = emissivity of radiator surface (dimensionless, 0–1)
- σ = 5.67 × 10⁻⁸ W/(m²·K⁴) (Stefan-Boltzmann constant)
- A = radiator area (m²)
- T = surface temperature (K)
- T_ambient = effective ambient temperature (≈ 100 K average lunar surface)

**Example — cooling the pyrolysis chamber after processing:**

Chamber outer wall: A = 0.8 m², ε = 0.85, T_start = 723 K, T_ambient = 100 K

```
P = 0.85 × 5.67e-8 × 0.8 × (723⁴ - 100⁴)
  = 0.85 × 5.67e-8 × 0.8 × (2.729e11 - 1e8)
  ≈ 0.85 × 5.67e-8 × 0.8 × 2.728e11
  ≈ 1,049 W  (≈ 1.05 kW)
```

Time to cool from 723 K to 373 K (100°C), approximating with average T = 548 K:

```
P_avg ≈ 0.85 × 5.67e-8 × 0.8 × (548⁴ - 100⁴)
      ≈ 0.85 × 5.67e-8 × 0.8 × 9.01e10
      ≈ 347 W

Q_removal = m × Cp × ΔT = 15 × 500 × (723 - 373) = 2,625,000 J

t_cool = Q_removal / P_avg = 2,625,000 / 347 ≈ 7,565 s  (≈ 126 minutes)
```

---

## 3. Magnetic Separation

### 3.1 Magnetic Force on Ferrous Particles

The force on a ferromagnetic particle in a non-uniform magnetic field:

```
F_mag = (V × χ × μ₀ / 2) × ∇(H²)
```

Where:
- V = particle volume (m³)
- χ = magnetic susceptibility of material (dimensionless)
- μ₀ = 4π × 10⁻⁷ H/m (permeability of free space)
- ∇(H²) = gradient of magnetic field intensity squared (A²/m³)

**Example — 1 mm diameter steel sphere (χ ≈ 200):**

```
V = (4/3) × π × (0.0005)³ = 5.24e-10 m³

Assuming ∇(H²) = 1.0e10 A²/m³ near magnet surface:

F_mag = (5.24e-10 × 200 × 4π×10⁻⁷ / 2) × 1.0e10
      = (5.24e-10 × 200 × 6.28e-7 / 2) × 1.0e10
      = (3.29e-14) × 1.0e10
      ≈ 3.29e-4 N  (0.33 mN)
```

Weight of the particle on Moon:

```
m_particle = ρ_steel × V = 7800 × 5.24e-10 = 4.09e-6 kg
F_weight   = 4.09e-6 × 1.62 = 6.6e-6 N  (6.6 μN)
```

Magnetic force exceeds weight by factor ~50, so capture is highly reliable in lunar gravity.

---

### 3.2 Separation Efficiency Model

The overall separation efficiency combines detection accuracy and mechanical recovery:

```
η_sep = η_detect × η_mechanical × (1 - η_contamination)
```

For the NIR spectroscopy detector:
- η_detect = 0.97 (97% correct material identification)
- η_mechanical = 0.98 (98% of identified items physically sorted correctly)
- η_contamination = 0.01 (1% cross-contamination rate)

```
η_sep = 0.97 × 0.98 × (1 - 0.01)
      = 0.97 × 0.98 × 0.99
      ≈ 0.941  (94.1%)
```

To achieve the target >95% efficiency, detector accuracy must exceed:

```
η_detect > 0.95 / (0.98 × 0.99) = 0.95 / 0.9702 ≈ 0.979  (97.9%)
```

---

## 4. Power Systems

### 4.1 Solar Array Output

Peak power output of the solar array:

```
P_solar = η_cell × G_solar × A_panels × cos(θ)
```

Where:
- η_cell = 0.32 (32% multi-junction cell efficiency)
- G_solar = 1,361 W/m² (solar irradiance at 1 AU, Moon has no atmosphere)
- A_panels = 6 m²
- θ = angle of incidence from normal

**At noon (θ = 0°):**

```
P_solar = 0.32 × 1361 × 6 × cos(0°)
        = 0.32 × 1361 × 6 × 1
        ≈ 2,613 W  (2.6 kW)
```

**At 30° incidence:**

```
P_solar = 0.32 × 1361 × 6 × cos(30°)
        = 2,613 × 0.866
        ≈ 2,263 W  (2.3 kW)
```

**At 60° incidence (early/late lunar day):**

```
P_solar = 2,613 × cos(60°) = 2,613 × 0.5 ≈ 1,307 W
```

---

### 4.2 Battery State of Charge

Battery discharge modeled as:

```
SoC(t) = SoC₀ - (I_discharge × t) / Q_rated
```

Where:
- SoC₀ = initial state of charge (0–1)
- I_discharge = discharge current (A)
- t = time (h)
- Q_rated = rated capacity (Ah)

The 15 kWh battery bank at 48 V:

```
Q_rated = E_total / V_nominal = 15,000 / 48 ≈ 312.5 Ah
```

During lunar night with 400 W average load (I = 400/48 ≈ 8.33 A):

```
SoC(t) = 1.0 - (8.33 × t) / 312.5 = 1.0 - 0.0267 × t
```

Time to reach minimum SoC of 0.20 (20% reserve):

```
0.20 = 1.0 - 0.0267 × t
t = 0.80 / 0.0267 ≈ 30 hours
```

The lunar night lasts ~336 hours (14 Earth days), so the 15 kWh battery can only support 30 hours of night operations without additional power (RHUs or reduced load mode).

**Night survival load budget** (to last 336 hours):

```
I_max = (SoC₀ - SoC_min) × Q_rated / t_night
      = (1.0 - 0.20) × 312.5 / 336
      ≈ 0.744 A

P_max = 0.744 × 48 ≈ 35.7 W
```

Only keep-alive/heating functions run during lunar night.

---

### 4.3 Power Budget Equation

Total instantaneous power balance:

```
P_solar(t) - P_load(t) - P_charge(t) + P_discharge(t) = 0
```

During active processing at lunar noon:

```
P_solar     = 2,613 W   (from array)
P_load      = 500 W     (processing)
P_excess    = 2,613 - 500 = 2,113 W → charging batteries

Charge time for 15 kWh from 20% to 100% SoC:
E_needed = 0.80 × 15,000 = 12,000 Wh
t_charge = 12,000 / (2,113 × η_charge) = 12,000 / (2,113 × 0.92) ≈ 6.17 hours
```

---

## 5. Heat Transfer in Vacuum

### 5.1 Conductive Heat Loss Through Chamber Walls

```
Q_cond = k × A × (T_hot - T_cold) / L
```

Where:
- k = thermal conductivity (W/(m·K))
- A = cross-sectional area (m²)
- L = wall thickness (m)
- T_hot, T_cold = temperatures (K)

**Pyrolysis chamber wall (stainless steel, k = 15 W/(m·K), L = 0.01 m, A_wall = 0.5 m², ΔT = 400 K):**

```
Q_cond = 15 × 0.5 × 400 / 0.01 = 300,000 W
```

This is far too high! Multi-layer insulation (MLI) reduces effective k to ~0.001 W/(m·K):

```
Q_cond_MLI = 0.001 × 0.5 × 400 / 0.01 = 20 W
```

MLI reduces conductive loss by a factor of 15,000.

---

### 5.2 Radiation View Factor Between Surfaces

For the internal radiative heat exchange between the processing chamber (1) and the outer wall (2):

```
Q₁₂ = ε_eff × σ × A₁ × (T₁⁴ - T₂⁴)

ε_eff = 1 / (1/ε₁ + A₁/A₂ × (1/ε₂ - 1))
```

With ε₁ = 0.9 (black inner wall), ε₂ = 0.05 (polished outer shield), A₁/A₂ = 0.8:

```
ε_eff = 1 / (1/0.9 + 0.8 × (1/0.05 - 1))
      = 1 / (1.111 + 0.8 × 19)
      = 1 / (1.111 + 15.2)
      = 1 / 16.311
      ≈ 0.0613
```

Heat flux at T₁ = 723 K, T₂ = 300 K:

```
Q₁₂ = 0.0613 × 5.67e-8 × 0.5 × (723⁴ - 300⁴)
     = 0.0613 × 5.67e-8 × 0.5 × (2.729e11 - 8.1e9)
     ≈ 0.0613 × 5.67e-8 × 0.5 × 2.648e11
     ≈ 461 W
```

The low-emissivity outer shield dramatically reduces radiation losses.

---

## 6. Mass and Material Balance

### 6.1 Conservation of Mass in Pyrolysis

For the pyrolysis of 1 kg HDPE:

```
m_input = m_oil + m_gas + m_char + m_loss
1.000 kg = 0.650 + 0.180 + 0.150 + 0.020
         = 1.000 kg ✓  (2% unaccounted = process losses)
```

**Yield fractions:**

```
Y_oil  = m_oil  / m_input = 0.650 / 1.000 = 65.0%
Y_gas  = m_gas  / m_input = 0.180 / 1.000 = 18.0%
Y_char = m_char / m_input = 0.150 / 1.000 = 15.0%
```

---

### 6.2 System Material Flow Rate

Throughput per hour for the separation unit (target: 3 kg/h mixed plastic):

```
ṁ_input = 3 kg/h

ṁ_oil  = ṁ_input × Y_oil  = 3 × 0.65 = 1.95 kg/h
ṁ_gas  = ṁ_input × Y_gas  = 3 × 0.18 = 0.54 kg/h
ṁ_char = ṁ_input × Y_char = 3 × 0.15 = 0.45 kg/h
```

Weekly oil output (operating 18 h/day, 7 days):

```
m_oil_weekly = 1.95 × 18 × 7 = 245.7 kg/week
```

---

## 7. Chemical Processing

### 7.1 Sabatier Reaction

The Sabatier process converts CO₂ and H₂ to methane and water:

```
CO₂ + 4H₂ → CH₄ + 2H₂O     ΔH = -165 kJ/mol  (exothermic)
```

**Stoichiometric mass balance per mole of CH₄ produced:**

```
CO₂  : 1 mol × 44 g/mol =  44 g input
H₂   : 4 mol × 2 g/mol  =   8 g input
CH₄  : 1 mol × 16 g/mol =  16 g output
H₂O  : 2 mol × 18 g/mol =  36 g output
```

Total input mass = 52 g → Total output mass = 52 g ✓

**Methane energy density:**

```
E_CH4 = 55.5 MJ/kg × 0.016 kg/mol = 0.888 MJ/mol = 247 Wh/mol
```

To produce 1 kg CH₄ (62.5 mol), CO₂ required:

```
m_CO2 = 62.5 × 44 = 2,750 g = 2.75 kg CO₂
```

---

### 7.2 Electrochemical Recovery (Copper Plating)

Faraday's law of electrolysis gives the mass deposited:

```
m = (M × I × t) / (n × F)
```

Where:
- M = molar mass of Cu = 63.5 g/mol
- I = current (A)
- t = time (s)
- n = 2 (valence electrons for Cu²⁺)
- F = 96,485 C/mol (Faraday constant)

**To recover 100 g of copper at I = 5 A:**

```
t = (m × n × F) / (M × I)
  = (0.100 × 2 × 96485) / (0.0635 × 5)
  = 19,297 / 0.3175
  ≈ 60,779 s  (≈ 16.9 hours)
```

**Energy consumed:**

```
E = V_cell × I × t = 0.5 V × 5 A × 60779 s
  = 151,948 J ≈ 0.0422 kWh
```

---

## 8. Orbital and Launch Economics

### 8.1 Lunar Escape Velocity

```
v_escape = sqrt(2 × G × M_moon / R_moon)
         = sqrt(2 × 6.674e-11 × 7.342e22 / 1.7374e6)
         = sqrt(2 × 2.822e6)
         = sqrt(5.644e6)
         ≈ 2,376 m/s  (2.38 km/s)
```

Compare to Earth's escape velocity (11.2 km/s) — launching material from the Moon requires only ~21% of Earth's escape energy.

---

### 8.2 Launch Cost Savings from In-Situ Recycling

If launch cost to the Moon is C_launch ($/kg), and the NLRS recovers m_recovered (kg) of material that would otherwise need to be resupplied:

```
Savings = m_recovered × C_launch - C_NLRS_operations
```

Assuming:
- C_launch = $20,000/kg (near-term lunar delivery estimate)
- Monthly recovery = 200 kg
- Monthly NLRS operating cost = $50,000

```
Savings_monthly = 200 × 20,000 - 50,000
               = 4,000,000 - 50,000
               = $3,950,000 / month
```

Break-even mass recovery per month:

```
m_breakeven = C_NLRS_operations / C_launch
            = 50,000 / 20,000
            = 2.5 kg/month
```

The NLRS recovers ~80× the break-even mass, making it highly economically viable.

---

## 9. Process Control — PID Controller

### 9.1 PID Temperature Control Equation

The thermal chamber temperature controller uses a PID algorithm:

```
u(t) = Kp × e(t) + Ki × ∫e(τ)dτ + Kd × de(t)/dt
```

Where:
- u(t) = heater output power (W)
- e(t) = T_setpoint - T_actual (error in K)
- Kp, Ki, Kd = proportional, integral, derivative gains

**Discrete implementation (sampling period Δt = 1 s):**

```
e[k] = T_sp - T[k]

P[k] = Kp × e[k]
I[k] = I[k-1] + Ki × e[k] × Δt
D[k] = Kd × (e[k] - e[k-1]) / Δt

u[k] = P[k] + I[k] + D[k]
u[k] = clamp(u[k], 0, P_max)   // 0 to 800 W
```

**Tuned parameters for HDPE pyrolysis chamber (first-order thermal model):**

```
Kp = 5.0  W/K
Ki = 0.1  W/(K·s)
Kd = 2.0  W·s/K
```

**Steady-state example** (setpoint 450°C, actual 445°C):

```
e = 450 - 445 = 5 K
P = 5.0 × 5 = 25 W
I = previous_integral + 0.1 × 5 × 1 = previous + 0.5
D = 2.0 × (5 - 4) / 1 = 2.0 W  (error improving by 1 K/s)
u = 25 + I + 2 = 27 + I W
```

---

### 9.2 Steady-State Error and Integral Windup Limit

At steady state (e → 0), the integral term absorbs the constant disturbance load:

```
u_ss = Ki × e_ss_integrated = P_heat_loss_at_setpoint
```

If the chamber loses 20 W at setpoint via conduction:

```
e_ss_integrated = u_ss / Ki = 20 / 0.1 = 200 K·s
```

Anti-windup limit is set at ±500 K·s to prevent overshoot during warm-up.

---

## 10. Radiation Dose and Shielding

### 10.1 Radiation Dose Calculation

Dose rate from galactic cosmic rays (GCR) on the lunar surface (unshielded):

```
D_rate ≈ 0.3 mSv/day  (measured by LRO/CRaTER instrument)
```

Annual dose (unshielded):

```
D_annual = 0.3 × 365 = 109.5 mSv/year
```

Electronics Total Ionizing Dose (TID) limit for rad-hard components: 100 krad

Converting to silicon absorbed dose (1 rad = 0.01 Gy):

```
D_TID = 100,000 rad = 1,000 Gy
```

Years of operation before TID limit (silicon dose rate ~10 mrad/day unshielded):

```
t_limit = 1,000 Gy / (10e-3 × 0.01 × 365 × 24 × 3600 Gy/s)
        ≈ 1000 / 0.000003154
        ≈ 3.17e8 s ≈ 10 years
```

---

### 10.2 Shielding Attenuation

Simplified exponential attenuation model for high-energy particle radiation:

```
D(x) = D₀ × exp(-μ × x)
```

Where:
- D₀ = unshielded dose rate
- μ = linear attenuation coefficient (cm⁻¹)
- x = shield thickness (cm)

For polyethylene shielding (μ ≈ 0.12 cm⁻¹ for GCR protons):

```
At x = 10 cm polyethylene:
D = D₀ × exp(-0.12 × 10) = D₀ × exp(-1.2) = D₀ × 0.301

Reduction: 69.9% → annual dose drops from 109.5 to 32.9 mSv/year
```

---

## 11. Reliability and Availability

### 11.1 Mean Time Between Failures

For a series system of N independent components:

```
MTBF_system = 1 / (λ₁ + λ₂ + ... + λ_N)
```

Where λᵢ = failure rate of component i (failures/hour).

For the MSU subsystem with 5 critical components:

| Component          | MTBF (h) | λ (failures/h) |
|--------------------|----------|----------------|
| NIR Spectrometer   | 8,000    | 1.25e-4        |
| Conveyor Motor     | 12,000   | 8.33e-5        |
| ML Classifier CPU  | 20,000   | 5.00e-5        |
| Air Jet Sorter     | 10,000   | 1.00e-4        |
| Sensor Controller  | 15,000   | 6.67e-5        |

```
λ_total = 1.25e-4 + 8.33e-5 + 5.00e-5 + 1.00e-4 + 6.67e-5
        = 4.25e-4 failures/h

MTBF_MSU = 1 / 4.25e-4 ≈ 2,353 hours (≈ 98 days)
```

---

### 11.2 System Availability

```
A = MTBF / (MTBF + MTTR)
```

With MTTR = 4 hours (repair time):

```
A_MSU = 2,353 / (2,353 + 4) = 2,353 / 2,357 ≈ 0.9983  (99.83%)
```

For a redundant (2-of-2 with hot spare) configuration, the system fails only when both fail simultaneously:

```
λ_redundant = λ² × MTTR = (4.25e-4)² × 4 = 7.225e-7 failures/h

MTBF_redundant = 1 / 7.225e-7 ≈ 1,384,083 hours (≈ 158 years)
```

Redundancy extends operational lifetime by orders of magnitude — essential for unattended lunar operations.

---

## 12. Summary of Key Equations

| Application | Equation | Key Variables |
|---|---|---|
| Lunar gravity | g = GM/R² | G, M_moon, R_moon |
| Arrhenius kinetics | k = A·exp(−Ea/RT) | Ea, T, R |
| Stefan-Boltzmann cooling | P = εσA(T⁴−T_amb⁴) | ε, σ, A, T |
| Solar power | P = η·G·A·cos(θ) | η_cell, G_solar, θ |
| Battery SoC | SoC = SoC₀ − It/Q | I, t, Q |
| PID control | u = Kp·e + Ki·∫e + Kd·ė | Kp, Ki, Kd |
| Sabatier yield | CO₂+4H₂→CH₄+2H₂O | molar masses |
| Faraday electrolysis | m = MIt/(nF) | M, I, t, n, F |
| MTBF (series) | 1/Σλᵢ | λᵢ per component |
| Availability | A = MTBF/(MTBF+MTTR) | MTBF, MTTR |

---

**Document Version**: 1.0  
**Last Updated**: July 13, 2026  
**Authors**: NetworkBuster Research Division — Systems Engineering
