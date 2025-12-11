# FocusFlow Minigame Design System
## Complete Production Specification v2.0

---

## SECTION 1: HIGH-LEVEL GOALS

### 1.1 System Purpose

The minigame system serves as the core training mechanism for measurable cognitive improvement:

**Primary Objectives:**
- Improve sustained attention span (target: +15% over 30 days)
- Reduce impulsivity response time (target: +200ms delay tolerance)
- Strengthen focus stability under distraction
- Reward consistency over intensity
- Provide immediate early wins (first 3 sessions)
- Offer long-term mastery ceiling (6+ months)
- Generate clinically-relevant metrics for progress tracking

**Secondary Objectives:**
- Create habit formation through variable reward schedules
- Build intrinsic motivation through visible progress
- Reduce screen time anxiety through controlled, purposeful use
- Provide sense of accomplishment without addictive mechanics

### 1.2 Design Philosophy

**Visual Philosophy:**
- Dark background (#0F172A base, #1E293B cards)
- Minimal UI - only essential elements visible
- High contrast targets (60%+ against background)
- Generous whitespace within dark theme
- No decorative elements during active gameplay
- Results screens can be richer

**Interaction Philosophy:**
- Single primary gesture per game
- Maximum 2 gesture types in complex games
- Immediate visual + haptic feedback (<16ms)
- No hidden mechanics - all rules visible
- Forgiving touch targets (minimum 44pt)
- Clear error states with recovery path

**Psychological Philosophy:**
- Flow state optimization (challenge ≈ skill + 10%)
- Micro-rewards every 3-5 seconds
- Clear progress indicators
- No punishment - only reduced rewards
- Mastery feels earned, not given
- Each game has a skill ceiling that takes 2+ months to reach

---

## SECTION 2: COMPLETE MINIGAME LIBRARY

### Game 1: STEADY HOLD

**Cognitive Skill:** Sustained attention, motor stability, impulse suppression

**Description:** Hold finger perfectly still on expanding target. Any movement breaks the hold and resets progress.

**Detailed Mechanics:**
```
SETUP:
- Central circle (80pt diameter) appears
- 3-2-1 countdown with haptic ticks
- Circle begins expanding when finger touches

ACTIVE PHASE:
- Circle expands from 80pt to 200pt over [duration]
- Expansion rate: linear with acceleration in final 20%
- Stability threshold: 4pt movement tolerance (decreases with level)
- Movement detection: 60fps sampling, rolling 100ms average

SUCCESS CONDITIONS:
- Complete expansion without breaking threshold
- Partial credit for percentage completed

FAILURE CONDITIONS:
- Finger movement exceeds threshold
- Finger lifts before completion
- Finger exits target bounds
```

**Input Type:** Touch and hold with stability detection

**Duration:** 15s (L1) → 45s (L10)

**Animation Style:**
- Smooth radial expansion
- Subtle pulse at 25%, 50%, 75% milestones
- Glow intensity increases with progress
- Particle burst on completion

**Visual Layout:**
```
┌─────────────────────────┐
│                         │
│    [Progress Arc]       │
│                         │
│      ┌───────┐          │
│      │   ●   │  ← Target│
│      └───────┘          │
│                         │
│   [Stability Meter]     │
│                         │
└─────────────────────────┘
```

**Haptic Feedback:**
- Light tick on touch start
- Subtle pulse at milestones
- Warning vibration at threshold approach (80%)
- Success: double pulse
- Failure: single sharp tap

**Error Handling:**
- 3 attempts per session
- Visual shake + red flash on break
- 1.5s recovery period
- Progress bar shows best attempt

**Skip Mechanic:** Available after 2 failed attempts, costs 1 heart

**Psychological Principle:**
- Anticipation building through expansion
- Variable ratio reinforcement at milestones
- Motor inhibition training through stillness requirement
- Flow through gradual difficulty increase

---

### Game 2: IMPULSE GATE

**Cognitive Skill:** Response inhibition, go/no-go discrimination, impulse control

**Description:** Tap green targets instantly, resist tapping red decoys. Tests ability to override automatic responses.

**Detailed Mechanics:**
```
SETUP:
- Empty dark field
- Brief instruction flash: "TAP GREEN ONLY"
- 2s preparation period

ACTIVE PHASE:
- Targets appear at random positions
- Target types:
  - GREEN (70%): Tap within 800ms
  - RED (25%): Do not tap for 1000ms
  - GOLD (5%): Tap within 400ms for 3x points
- Appearance rate: 1 target per 1.5s (L1) → 0.6s (L10)
- Targets fade after timeout

SCORING:
- Green tap: +10 base × speed multiplier
- Red resist: +15 (harder than tapping)
- Gold tap: +30
- Green miss: -5
- Red tap: -20 (impulse failure)
- Gold miss: -10

SPEED MULTIPLIER:
- <200ms: 2.0x
- 200-400ms: 1.5x
- 400-600ms: 1.2x
- 600-800ms: 1.0x
```

**Input Type:** Rapid discrete taps

**Duration:** 30s (all levels)

**Animation Style:**
- Targets pop in with scale animation (0→100% in 100ms)
- Correct tap: satisfying shrink + particle burst
- Wrong tap: shake + red pulse
- Successful inhibition: subtle green glow around red target

**Visual Layout:**
```
┌─────────────────────────┐
│  Score: 340  Streak: 7  │
│                         │
│     🟢        🔴        │
│                         │
│          🟢             │
│    🔴                   │
│              🟡         │
│                         │
│  [Time Bar ████░░░░░]   │
└─────────────────────────┘
```

**Haptic Feedback:**
- Target appear: micro tick
- Correct tap: medium impact
- Wrong tap: error pattern (two quick taps)
- Successful inhibition: soft success pulse
- Gold tap: strong double pulse

**Error Handling:**
- No game-ending failures
- Cumulative score approach
- Negative score floors at 0
- Streak breaks visible but not punishing

**Skip Mechanic:** Not available (always completable)

**Psychological Principle:**
- Go/no-go paradigm from clinical research
- Trains prefrontal cortex inhibition circuits
- Variable ratio schedule with gold targets
- Immediate feedback prevents rumination

---

### Game 3: DRIFT CONTROL

**Cognitive Skill:** Continuous attention, fine motor control, error correction

**Description:** Keep a drifting cursor inside a moving safe zone. Tests sustained monitoring and micro-adjustments.

**Detailed Mechanics:**
```
SETUP:
- Horizontal track with safe zone (center 40%)
- Cursor starts centered
- Drift direction randomized

ACTIVE PHASE:
- Cursor drifts left or right continuously
- Drift speed: 20pt/s (L1) → 80pt/s (L10)
- User tilts phone OR drags to counter-drift
- Safe zone moves (L5+): sinusoidal pattern
- Direction changes: every 8s (L1) → every 2s (L10)

SCORING:
- Points accumulate while in safe zone
- Rate: 10 pts/s in center, 5 pts/s at edges
- Multiplier builds: +0.1x per 3s in zone
- Multiplier resets on zone exit

ZONE EXIT:
- Brief grace period (500ms)
- Warning flash at zone edge
- Score accumulation pauses
- No points lost, just no gain
```

**Input Type:** Continuous drag OR device tilt (user preference)

**Duration:** 30s (L1) → 60s (L10)

**Animation Style:**
- Smooth cursor movement
- Zone edges pulse when cursor approaches
- Background color subtly shifts with position
- Successful streaks create trailing particles

**Visual Layout:**
```
┌─────────────────────────┐
│   Multiplier: 1.4x      │
│                         │
│  ░░░░████████████░░░░   │
│  ←   [Safe Zone]    →   │
│        ▼ cursor         │
│                         │
│  [Time ████████░░░░░]   │
│                         │
│      Score: 892         │
└─────────────────────────┘
```

**Haptic Feedback:**
- Continuous subtle vibration proportional to correction needed
- Edge approach: increasing intensity
- Zone exit: warning tap
- Direction change: medium tap

**Error Handling:**
- Cannot "fail" - only reduce score
- Visual guides show optimal position
- Audio/haptic cues for drift direction

**Skip Mechanic:** Available anytime, partial score kept

**Psychological Principle:**
- Sustained attention through continuous demand
- Error monitoring and correction (executive function)
- Flow through dynamic challenge balancing
- Proprioceptive engagement through tilt option

---

### Game 4: SEQUENCE RECALL

**Cognitive Skill:** Working memory, pattern recognition, sequential processing

**Description:** Watch a sequence of positions light up, then reproduce it. Classic memory span task with modern UX.

**Detailed Mechanics:**
```
SETUP:
- 3x3 grid of circles (can expand to 4x4 at L8+)
- All circles dim initially

SHOW PHASE:
- Circles light up in sequence
- Each light: 600ms on, 200ms gap
- Sequence length: 3 (L1) → 9 (L10)
- Speed increases: 500ms/100ms at L7+

RECALL PHASE:
- User taps circles in order
- Correct tap: circle lights green
- Incorrect tap: circle flashes red
- Can proceed after error (partial credit)

SCORING:
- Perfect sequence: 100 pts × length
- Partial: (correct/total) × 50 × length
- Speed bonus: <500ms per tap = +10%
- No penalty for wrong taps (learning focus)
```

**Input Type:** Sequential taps

**Duration:** Variable (15-45s depending on sequence length)

**Animation Style:**
- Circles pulse with soft glow when active
- Sequence plays with musical progression (ascending tones)
- Correct recalls create satisfying "lock in" animation
- Pattern completion triggers celebration

**Visual Layout:**
```
┌─────────────────────────┐
│    Sequence: 5/7        │
│                         │
│      ○   ○   ○          │
│                         │
│      ○   ●   ○          │
│                         │
│      ○   ○   ○          │
│                         │
│  [Your turn - tap!]     │
└─────────────────────────┘
```

**Haptic Feedback:**
- Each sequence item: distinct tap
- Correct recall: confirmation pulse
- Wrong recall: soft error tap
- Complete sequence: celebration pattern

**Error Handling:**
- Continue after errors
- Show correct position briefly after error
- Track error positions for analysis
- Maximum 3 sequences per session

**Skip Mechanic:** Can skip current sequence, move to next

**Psychological Principle:**
- Chunking through spatial patterns
- Phonological loop engagement through rhythm
- Self-testing enhances encoding (testing effect)
- Spaced repetition through session structure

---

### Game 5: FOCUS SWITCH

**Cognitive Skill:** Task switching, cognitive flexibility, attention shifting

**Description:** Rapidly switch between two different rules based on visual cues. Tests mental agility.

**Detailed Mechanics:**
```
SETUP:
- Screen divided: LEFT = "Match Color" / RIGHT = "Match Shape"
- Stimuli appear in center

ACTIVE PHASE:
- Stimulus appears: colored shape (e.g., red circle)
- Indicator shows current rule (color/shape)
- Rule switches every 3-8 targets (randomized)
- Two answer options appear below

RULES:
- Color mode: match the color, ignore shape
- Shape mode: match the shape, ignore color
- Switch cost: 200ms longer allowed on first trial after switch

SCORING:
- Correct + fast (<600ms): +15
- Correct + normal: +10
- Correct + slow (>1000ms): +5
- Incorrect: -5
- Switch bonus: correct on switch trial = +5 extra
```

**Input Type:** Binary choice taps (left/right or two buttons)

**Duration:** 45s

**Animation Style:**
- Rule indicator pulses when switching
- Stimuli slide in from top
- Answers slide in from bottom
- Correct: satisfying merge animation
- Switch: brief flash transition

**Visual Layout:**
```
┌─────────────────────────┐
│  [COLOR]     shape      │
│  ─────────────────────  │
│                         │
│         🔴              │
│      red circle         │
│                         │
│    🟦      🔵           │
│   blue     red          │
│   square   circle       │
│                         │
└─────────────────────────┘
```

**Haptic Feedback:**
- Rule switch: distinctive double-tap pattern
- Correct: medium confirmation
- Incorrect: soft error
- Fast correct: stronger confirmation

**Error Handling:**
- No round failures
- Track switch costs separately
- Show which rule was active on error
- Brief pause after error for processing

**Skip Mechanic:** Not available (short trials self-correct)

**Psychological Principle:**
- Task-switching paradigm from cognitive research
- Trains dorsolateral prefrontal cortex
- Switch costs measure cognitive flexibility
- Stroop-like interference requires inhibition

---

### Game 6: TRACKING PURSUIT

**Cognitive Skill:** Smooth pursuit attention, prediction, continuous monitoring

**Description:** Follow a moving target with your finger. Tests sustained visual attention and motor coordination.

**Detailed Mechanics:**
```
SETUP:
- Target dot appears center screen
- Finger touch zone surrounds target

ACTIVE PHASE:
- Target moves in smooth curves
- Movement patterns: Lissajous curves, random walks, figure-8s
- Speed: 100pt/s (L1) → 400pt/s (L10)
- User finger must stay within 50pt (L1) → 20pt (L10) of target
- Accuracy sampled 60 times per second

DISTRACTORS (L5+):
- Decoy targets appear and move
- Same color but slightly different (dotted outline)
- Must stay on solid target

SCORING:
- Distance tracked × accuracy multiplier
- Accuracy: % of samples within threshold
- Perfect tracking (>95%): 2x multiplier
- Good tracking (80-95%): 1.5x
- Acceptable (60-80%): 1x
- Below 60%: 0.5x
```

**Input Type:** Continuous finger tracking

**Duration:** 20s (L1) → 45s (L10)

**Animation Style:**
- Target has subtle pulsing glow
- Trail shows recent path
- Accuracy creates halo (green = good, yellow = ok, red = losing)
- Speed up announced with brief flash

**Visual Layout:**
```
┌─────────────────────────┐
│   Accuracy: 94%         │
│                         │
│        ←←←              │
│           ╭─╮           │
│           │●│ ← Target  │
│           ╰─╯           │
│              ↘          │
│                         │
│  [████████████░░░░░]    │
└─────────────────────────┘
```

**Haptic Feedback:**
- Constant micro-vibration when on target
- Intensity increases when drifting off
- Loss of tracking: warning tap
- Return to tracking: confirmation

**Error Handling:**
- Cannot fail, only reduce accuracy
- Visual guides show target direction
- Brief slowdown after extended loss

**Skip Mechanic:** Available, partial credit for time completed

**Psychological Principle:**
- Smooth pursuit eye movement proxy
- Predictive attention (anticipating movement)
- Continuous demand prevents mind wandering
- Flow through dynamic difficulty

---

### Game 7: RHYTHM SYNC

**Cognitive Skill:** Temporal attention, rhythm processing, anticipatory timing

**Description:** Tap in sync with a beat pattern. Tests temporal prediction and motor timing.

**Detailed Mechanics:**
```
SETUP:
- Beat visualization (expanding rings or bouncing ball)
- 4-beat intro to establish tempo
- Tempo: 60 BPM (L1) → 140 BPM (L10)

ACTIVE PHASE:
- Beat continues, user taps in sync
- Timing window: ±150ms (L1) → ±50ms (L10)
- Pattern complexity increases:
  - L1-3: Quarter notes only
  - L4-6: Add half notes
  - L7-9: Add syncopation
  - L10: Complex polyrhythm

SCORING:
- Perfect (±20ms): +15
- Good (±50ms): +10
- OK (±100ms): +5
- Miss: 0 (no penalty)
- Combo multiplier: consecutive perfects

TIMING FEEDBACK:
- Early: blue flash
- Perfect: green flash
- Late: orange flash
- Miss: gray (no flash)
```

**Input Type:** Rhythmic taps anywhere on screen

**Duration:** 30s (all levels, ~30-70 beats depending on tempo)

**Animation Style:**
- Concentric circles pulse with beat
- Perfect taps create ripple effects
- Combo builds visible streak meter
- Background subtly throbs with rhythm

**Visual Layout:**
```
┌─────────────────────────┐
│   Combo: 12  ×1.6       │
│                         │
│      ╭─────────╮        │
│      │  ╭───╮  │        │
│      │  │ ● │  │        │
│      │  ╰───╯  │        │
│      ╰─────────╯        │
│         ▲               │
│        TAP              │
│                         │
└─────────────────────────┘
```

**Haptic Feedback:**
- Beat: subtle tick (can be disabled)
- Perfect tap: satisfying thump
- Good tap: medium tap
- Miss: no haptic (absence is feedback)

**Error Handling:**
- No failures possible
- Missed beats simply score 0
- Can lose combo but not progress
- Visual shows timing for learning

**Skip Mechanic:** Not available (always completable)

**Psychological Principle:**
- Temporal attention is distinct cognitive system
- Rhythm engages motor-auditory coupling
- Anticipation creates engagement
- Beat-based timing used in ADHD interventions

---

### Game 8: DISTRACTION DEFENSE

**Cognitive Skill:** Selective attention, distraction resistance, sustained focus

**Description:** Maintain focus on a central task while ignoring peripheral distractions. Tests attention filtering.

**Detailed Mechanics:**
```
SETUP:
- Central task: count the flashing dots
- Peripheral zone: distracting stimuli

CENTRAL TASK:
- 3-7 dots flash in sequence (500ms each)
- User reports count at end
- Simple counting, but distractions make it hard

DISTRACTIONS (vary by level):
- L1-2: Static shapes in periphery
- L3-4: Moving shapes
- L5-6: Flashing colors
- L7-8: Text/numbers (semantic distraction)
- L9-10: Similar dots in periphery (high interference)

TIMING:
- 15 rounds per session
- Each round: 3-7 seconds
- Total: ~60 seconds

SCORING:
- Correct count: +20
- Off by 1: +10
- Off by 2+: 0
- Perfect round streak: multiplier
```

**Input Type:** Number input (1-9 buttons or slider)

**Duration:** 60s total

**Animation Style:**
- Central zone clearly defined
- Dots flash with distinct timing
- Distractions are colorful but blurred slightly
- Correct answers pulse green

**Visual Layout:**
```
┌─────────────────────────┐
│                         │
│  ◆ ◆    ┌─────┐    ★ ★  │
│    ◆    │ ● ● │      ★  │
│  ◆      │  ●  │    ★    │
│         └─────┘         │
│                         │
│   How many? [1-9]       │
│                         │
└─────────────────────────┘
```

**Haptic Feedback:**
- Each dot flash: micro tick
- Answer submission: confirmation
- Correct: success pulse
- Incorrect: soft double-tap

**Error Handling:**
- No failures, just scoring
- Show correct answer after each round
- Track which distraction types cause errors

**Skip Mechanic:** Can skip individual rounds

**Psychological Principle:**
- Selective attention paradigm
- Trains filtering in parietal cortex
- Graduated distraction = graduated difficulty
- Real-world applicability (ignoring phone notifications)

---

### Game 9: SPEED DISCRIMINATION

**Cognitive Skill:** Perceptual attention, quick judgment, visual processing speed

**Description:** Rapidly determine which of two stimuli is larger/faster/more numerous. Tests perceptual decision-making.

**Detailed Mechanics:**
```
SETUP:
- Two comparison zones (left/right or top/bottom)
- Brief instruction: "Tap the LARGER one"

ACTIVE PHASE:
- Pairs appear for limited time
- Comparison types rotate:
  - Size (circles of different diameters)
  - Numerosity (dot arrays)
  - Length (lines)
  - Speed (moving dots)
- Display time: 1000ms (L1) → 300ms (L10)
- Difference ratio: 2:1 (L1) → 1.1:1 (L10)

SCORING:
- Correct + fast: +15
- Correct + normal: +10
- Incorrect: -5
- Timeout: -3
- 30 trials per session
```

**Input Type:** Binary choice (tap left or right)

**Duration:** 60-90s (30 trials)

**Animation Style:**
- Stimuli appear with quick fade-in
- Choice highlights briefly
- Correct: green confirmation
- Incorrect: red X

**Visual Layout:**
```
┌─────────────────────────┐
│   Trial: 12/30          │
│                         │
│   ┌─────┐   ┌─────┐     │
│   │     │   │     │     │
│   │ ●●  │   │ ●●● │     │
│   │ ●●  │   │ ●●● │     │
│   │     │   │ ●●  │     │
│   └─────┘   └─────┘     │
│      ▲         ▲        │
│     TAP       TAP       │
└─────────────────────────┘
```

**Haptic Feedback:**
- Stimulus appear: soft tick
- Tap: medium impact
- Correct: success
- Incorrect: error pattern

**Error Handling:**
- Cannot fail session
- Track accuracy by comparison type
- Adaptive difficulty per type

**Skip Mechanic:** Not available

**Psychological Principle:**
- Weber's law testing
- Approximate number system (ANS)
- Quick decisions train processing speed
- Varied stimuli prevent strategy shortcuts

---

### Game 10: DUAL TASK

**Cognitive Skill:** Divided attention, cognitive load management, multitasking

**Description:** Perform two simple tasks simultaneously. Tests attention splitting and prioritization.

**Detailed Mechanics:**
```
SETUP:
- Screen split into two zones
- Task A (top): Count the taps
- Task B (bottom): Track the color

TASK A - TAP COUNTER:
- Number appears and flashes
- User must tap that many times
- Range: 1-5 (L1) → 1-9 (L10)

TASK B - COLOR TRACKER:
- Background color cycles
- Report dominant color at end
- Changes: every 3s (L1) → every 1s (L10)

SYNCHRONIZATION:
- Both tasks run simultaneously
- Must complete Task A while monitoring Task B
- 10 rounds per session

SCORING:
- Task A correct: +10
- Task B correct: +10
- Both correct: +30 (synergy bonus)
- Neither: 0
```

**Input Type:** Taps (Task A) + Selection (Task B)

**Duration:** 45-60s

**Animation Style:**
- Clear visual separation
- Task A number pulses
- Task B zone shifts color smoothly
- Completion shows both results

**Visual Layout:**
```
┌─────────────────────────┐
│   ┌─────────────────┐   │
│   │    Tap: 4       │   │
│   │      ████       │   │
│   └─────────────────┘   │
│   ─────────────────────  │
│   ┌─────────────────┐   │
│   │   [BLUE zone]   │   │
│   │                 │   │
│   └─────────────────┘   │
│   Dominant? [R][G][B]   │
└─────────────────────────┘
```

**Haptic Feedback:**
- Each tap: counting tick
- Color change: subtle pulse
- Round end: check pattern
- Both correct: celebration

**Error Handling:**
- Neither task can fail independently
- Clear feedback on which task(s) were correct
- Lower both difficulties if struggling

**Skip Mechanic:** Available after 3 failed rounds

**Psychological Principle:**
- Divided attention paradigm
- Central bottleneck testing
- Trains prioritization skills
- Real-world multitasking analog

---

### Game 11: PATTERN BREAK

**Cognitive Skill:** Vigilance, sustained monitoring, anomaly detection

**Description:** Watch a repeating pattern and tap when it breaks. Tests sustained vigilance attention.

**Detailed Mechanics:**
```
SETUP:
- Establish baseline pattern (4-6 repetitions)
- Pattern: visual (shapes), temporal (rhythm), or spatial (positions)

ACTIVE PHASE:
- Pattern continues with occasional breaks
- Break types:
  - Missing element
  - Wrong element
  - Wrong timing
  - Wrong position
- Break frequency: 1 per 10s (L1) → 1 per 4s (L10)
- Break subtlety: obvious (L1) → subtle (L10)

SCORING:
- Correct detection (tap on break): +20
- False alarm (tap on pattern): -10
- Miss (no tap on break): -5
- Speed bonus for fast detection

TIMING:
- Reaction window: 1500ms after break
- Pattern element duration: 1000ms (L1) → 500ms (L10)
```

**Input Type:** Tap anywhere when anomaly detected

**Duration:** 60s

**Animation Style:**
- Pattern elements appear in sequence
- Subtle highlight on current element
- Break detection: flash effect
- Miss: element turns red briefly

**Visual Layout:**
```
┌─────────────────────────┐
│   Catches: 4  Misses: 1 │
│                         │
│      ● → ■ → ▲ → ●      │
│            ↓            │
│           ■ ← current   │
│                         │
│   [TAP when wrong!]     │
│                         │
│  [████████░░░░░░░░░]    │
└─────────────────────────┘
```

**Haptic Feedback:**
- Pattern element: soft tick
- Break detected: strong confirmation
- False alarm: error pattern
- Missed break: warning pulse

**Error Handling:**
- Continuous session, no failures
- Track false alarms vs misses separately
- Brief pattern pause after miss to reorient

**Skip Mechanic:** Available anytime

**Psychological Principle:**
- Vigilance decrement is well-studied
- Trains sustained monitoring (air traffic control paradigm)
- Signal detection theory application
- Combats attention lapses

---

### Game 12: IMPULSE DELAY

**Cognitive Skill:** Delayed gratification, impulse inhibition, patience

**Description:** Wait for the optimal moment to act, resisting early impulse. Tests delay of gratification.

**Detailed Mechanics:**
```
SETUP:
- Growing reward bar/circle
- Temptation to tap early

ACTIVE PHASE:
- Value increases over time (exponential curve)
- Can "cash out" anytime by tapping
- Risk: random "crash" ends round with 0
- Crash probability increases with value
- Optimal strategy: moderate risk tolerance

VALUE CURVE:
- Starts at 10 points
- Grows: 10 → 20 → 35 → 55 → 80 → 110 → 150 → 200
- Crash probability: 0% → 5% → 10% → 20% → 35% → 50% → 70% → 90%
- Time per step: 2s (L1) → 1s (L10)

SCORING:
- Points = cash out value
- Crash = 0 points for round
- 10 rounds per session
- Risk-adjusted score calculated
```

**Input Type:** Single tap to cash out

**Duration:** Variable (~60-90s for 10 rounds)

**Animation Style:**
- Value display grows with satisfying expansion
- Tension builds through pulsing
- Crash: dramatic pop/deflate
- Cash out: coins/points collected animation

**Visual Layout:**
```
┌─────────────────────────┐
│   Round: 4/10           │
│   Bank: 340             │
│                         │
│      Current: 80        │
│     ╭─────────╮         │
│     │  ████   │         │
│     │  ████   │         │
│     │  ██░░   │         │
│     ╰─────────╯         │
│   [TAP to cash out]     │
│                         │
└─────────────────────────┘
```

**Haptic Feedback:**
- Value increase: building pulse
- High risk zone: warning vibration
- Cash out: satisfying collection
- Crash: sharp stop

**Error Handling:**
- Crashes aren't errors, they're learning
- Show optimal point after each round
- Track risk tolerance trends

**Skip Mechanic:** Not available (each round is short)

**Psychological Principle:**
- Marshmallow test paradigm
- Trains delay of gratification
- Risk vs reward evaluation
- Impulse control through stakes

---

## SECTION 3: DIFFICULTY SCALING

### Universal Scaling Principles

1. **10% Rule:** Each level should feel 10% harder than previous
2. **Early Confidence:** L1-3 should be achievable by anyone
3. **Mastery Ceiling:** L10 should take 30+ attempts to master
4. **Regression Safety:** Dropping a level should feel easier, not punishing

### Scaling Variables by Game

#### STEADY HOLD Difficulty Curve

| Level | Duration | Movement Threshold | Circle Complexity |
|-------|----------|-------------------|-------------------|
| 1 | 15s | 6pt | Single static |
| 2 | 18s | 5.5pt | Single static |
| 3 | 21s | 5pt | Single static |
| 4 | 24s | 4.5pt | Single static |
| 5 | 27s | 4pt | Subtle drift |
| 6 | 30s | 3.5pt | Slow drift |
| 7 | 33s | 3pt | Medium drift |
| 8 | 37s | 2.5pt | Direction changes |
| 9 | 42s | 2pt | Faster drift |
| 10 | 45s | 1.5pt | Unpredictable drift |

**Feel per level:**
- L1-3: "I can do this" - confidence building
- L4-6: "This requires focus" - engagement
- L7-8: "This is challenging" - flow state
- L9-10: "This is mastery" - achievement

#### IMPULSE GATE Difficulty Curve

| Level | Target Rate | Red % | Gold % | Timing Window |
|-------|-------------|-------|--------|---------------|
| 1 | 1.5s | 20% | 5% | 1000ms |
| 2 | 1.4s | 22% | 5% | 950ms |
| 3 | 1.3s | 24% | 6% | 900ms |
| 4 | 1.2s | 26% | 6% | 850ms |
| 5 | 1.1s | 28% | 7% | 800ms |
| 6 | 1.0s | 30% | 7% | 750ms |
| 7 | 0.9s | 32% | 8% | 700ms |
| 8 | 0.8s | 34% | 8% | 650ms |
| 9 | 0.7s | 36% | 9% | 600ms |
| 10 | 0.6s | 38% | 10% | 550ms |

**Progression unlocks:**
- L3: Red targets can appear in clusters
- L5: Fake-out animations (targets that almost turn green)
- L7: Moving targets
- L9: Size variation in targets

#### SEQUENCE RECALL Difficulty Curve

| Level | Sequence Length | Grid Size | Show Time | Gap Time |
|-------|----------------|-----------|-----------|----------|
| 1 | 3 | 3×3 | 700ms | 300ms |
| 2 | 3 | 3×3 | 650ms | 250ms |
| 3 | 4 | 3×3 | 600ms | 250ms |
| 4 | 4 | 3×3 | 550ms | 200ms |
| 5 | 5 | 3×3 | 500ms | 200ms |
| 6 | 5 | 3×3 | 450ms | 150ms |
| 7 | 6 | 4×4 | 450ms | 150ms |
| 8 | 7 | 4×4 | 400ms | 150ms |
| 9 | 8 | 4×4 | 400ms | 100ms |
| 10 | 9 | 4×4 | 350ms | 100ms |

**Memory aids removed:**
- L1-4: Positions stay highlighted after tap
- L5-7: Brief highlight, then fade
- L8-10: No highlight, pure recall

### Star/Point System per Level

Each game awards 1-3 stars based on performance:

**3 Stars (Mastery):**
- Score ≥ 90th percentile for that level
- No major errors
- Completion within time

**2 Stars (Proficient):**
- Score ≥ 70th percentile
- Minor errors acceptable
- Completion required

**1 Star (Complete):**
- Score ≥ 50th percentile
- Learning in progress
- Basic completion

**Level Unlock Requirements:**
- 2+ stars on current level
- OR 3 attempts with improvement shown
- Prevents frustration blocks

---

## SECTION 4: SESSION STRUCTURE

### Standard Session Flow

```
TOTAL SESSION: 3-5 minutes

┌─────────────────────────────────────────┐
│ 1. WARM-UP (30s)                        │
│    - Easiest variant of selected game   │
│    - No scoring, just activation        │
│    - Establishes baseline for session   │
├─────────────────────────────────────────┤
│ 2. MAIN ROUNDS (2-3 min)                │
│    - 2-3 rounds at current level        │
│    - Full scoring active                │
│    - Adaptive difficulty if needed      │
├─────────────────────────────────────────┤
│ 3. STREAK/BONUS ROUND (30s)             │
│    - Only if performing well            │
│    - Higher difficulty preview          │
│    - Bonus XP opportunity               │
├─────────────────────────────────────────┤
│ 4. COOLDOWN & RESULTS (30s)             │
│    - Score breakdown                    │
│    - Improvement indicators             │
│    - Next session preview               │
└─────────────────────────────────────────┘
```

### Transition Animations

**Warm-up → Main:**
```
- Warm-up fades to blur
- "Now for real!" text pulses
- Game elements sharpen
- Score counter activates
- Duration: 1.5s
```

**Between Rounds:**
```
- Brief score flash
- Breathing moment (1s)
- Elements reset with micro-animation
- "Round 2" indicator
- Duration: 2s
```

**Main → Bonus:**
```
- Screen glows gold briefly
- "BONUS ROUND" announcement
- Difficulty indicator moves up
- Stakes feel higher
- Duration: 2s
```

**Bonus → Results:**
```
- All elements shrink to center
- Score tallies with counting animation
- Stars appear one by one
- Improvements pulse
- XP counter increments
- Duration: 3-4s
```

### Sound/Haptic Timeline

```
00:00 - Session start: rising tone + medium haptic
00:02 - Warm-up begin: soft click
00:30 - Warm-up end: completion chime
00:32 - Main begin: activation tone + haptic
       [Game-specific sounds during play]
02:30 - Main end: section complete tone
02:32 - Bonus check: anticipation sound
02:34 - Bonus begin: excitement tone (or skip sound)
03:00 - Session end: satisfying completion sequence
03:02 - Results: individual score ticks
03:10 - Final score: celebration cascade
```

---

## SECTION 5: SCORING SYSTEM

### Universal Score Formula

```javascript
// Base calculation
rawScore = gameSpecificCalculation()

// Normalization (0-100)
normalizedScore = (rawScore / maxPossibleScore) * 100

// Streak multiplier
if (consecutivePerfects >= 3) {
  streakMultiplier = 1 + (consecutivePerfects * 0.1)
  // Cap at 2.0x
}

// Time bonus
if (completionTime < targetTime * 0.8) {
  timeBonus = 1.1
}

// Final score
finalScore = normalizedScore * streakMultiplier * timeBonus

// XP conversion
xpEarned = Math.floor(finalScore * 0.5) + levelBonus
```

### Per-Game Metric Collection

#### STEADY HOLD Metrics
```json
{
  "totalHoldTime": 23400,
  "breakCount": 2,
  "longestHold": 15200,
  "averageDeviation": 2.3,
  "maxDeviation": 4.1,
  "steadinessIndex": 87.3,
  "completionPercentage": 92
}
```

**Score Formula:**
```javascript
score = (totalHoldTime / targetTime) * 100
        * (1 - breakCount * 0.1)
        * (1 - averageDeviation / threshold)
```

#### IMPULSE GATE Metrics
```json
{
  "greenTaps": 18,
  "greenMisses": 2,
  "redTaps": 1,
  "redResists": 7,
  "goldTaps": 2,
  "goldMisses": 0,
  "averageReactionTime": 342,
  "fastestReaction": 187,
  "inhibitionRate": 87.5
}
```

**Score Formula:**
```javascript
accuracy = (greenTaps + redResists + goldTaps) / totalTargets
speedBonus = 1 + (500 - averageReactionTime) / 1000
inhibitionBonus = inhibitionRate / 100
score = accuracy * 100 * speedBonus * inhibitionBonus
```

#### SEQUENCE RECALL Metrics
```json
{
  "sequencesAttempted": 3,
  "perfectSequences": 2,
  "partialCorrect": [4, 3, 5],
  "sequenceLengths": [5, 5, 6],
  "averageRecallTime": 2300,
  "errorPositions": [3]
}
```

**Score Formula:**
```javascript
accuracyScore = totalCorrect / totalRequired * 100
lengthBonus = averageLength / maxLength * 20
speedBonus = targetTime / actualTime
score = accuracyScore + lengthBonus * speedBonus
```

### Aggregate Scores

**Daily Score:**
```javascript
dailyScore = games.reduce((sum, game) => {
  return sum + (game.score * game.weight)
}, 0) / totalWeight

// Weights by skill area:
// Sustained attention: 1.2
// Inhibition: 1.3
// Working memory: 1.1
// Speed: 0.9
// Flexibility: 1.0
```

**Weekly Trend:**
```javascript
weeklyTrend = {
  average: mean(dailyScores),
  trend: linearRegression(dailyScores).slope,
  consistency: 1 - standardDeviation(dailyScores) / mean,
  bestDay: max(dailyScores),
  improvementRate: (lastDay - firstDay) / firstDay
}
```

**Focus Stability Index (FSI):**
```javascript
// Proprietary composite metric
FSI = (
  sustainedAttention * 0.3 +
  inhibitionControl * 0.25 +
  workingMemory * 0.2 +
  cognitiveFlexibility * 0.15 +
  processingSpeed * 0.1
) * consistencyMultiplier

// Range: 0-100
// Average user starts: 45-55
// Trained user (30 days): 65-75
// Mastery (90+ days): 80-90
```

---

## SECTION 6: VISUAL & MOTION DESIGN

### Color System (Dark Mode)

```css
/* Base colors */
--bg-primary: #0F172A;      /* Main background */
--bg-secondary: #1E293B;    /* Cards, zones */
--bg-tertiary: #334155;     /* Elevated elements */

/* Text */
--text-primary: #F1F5F9;    /* High emphasis */
--text-secondary: #94A3B8;  /* Medium emphasis */
--text-tertiary: #64748B;   /* Low emphasis */

/* Interactive */
--accent-primary: #6366F1;  /* Primary actions */
--accent-secondary: #818CF8; /* Hover/focus */
--accent-tertiary: #A5B4FC; /* Highlights */

/* Feedback */
--success: #10B981;
--success-soft: #065F46;
--warning: #F59E0B;
--warning-soft: #78350F;
--error: #EF4444;
--error-soft: #7F1D1D;

/* Game-specific */
--target-green: #22C55E;
--target-red: #F43F5E;
--target-gold: #FBBF24;
--target-blue: #3B82F6;
```

### Typography in Games

```css
/* Score displays */
.score-large {
  font-family: 'SF Pro Rounded', system-ui;
  font-weight: 700;
  font-size: 48px;
  letter-spacing: -1px;
}

/* Instructions */
.instruction {
  font-family: 'SF Pro Text', system-ui;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
}

/* Timer/Counter */
.counter {
  font-family: 'SF Mono', monospace;
  font-weight: 600;
  font-size: 24px;
  font-variant-numeric: tabular-nums;
}
```

### Target Design Specifications

**Primary Target (e.g., tap target):**
```css
.target-primary {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--accent-primary);
  box-shadow:
    0 0 20px rgba(99, 102, 241, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.3);
}
```

**Hold Target:**
```css
.target-hold {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--accent-primary);
  background: transparent;
}

.target-hold.active {
  background: var(--accent-primary);
  animation: hold-pulse 1s ease-in-out infinite;
}
```

**Success Target:**
```css
.target-success {
  background: var(--success);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
  animation: success-pop 300ms ease-out;
}
```

### Animation Specifications

**Target Appear:**
```javascript
{
  from: { scale: 0, opacity: 0 },
  to: { scale: 1, opacity: 1 },
  duration: 150,
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Overshoot
}
```

**Success Tap:**
```javascript
{
  keyframes: [
    { scale: 1, opacity: 1 },
    { scale: 1.2, opacity: 0.8 },
    { scale: 0, opacity: 0 }
  ],
  duration: 200,
  easing: 'ease-out'
}
```

**Error Shake:**
```javascript
{
  keyframes: [
    { translateX: 0 },
    { translateX: -10 },
    { translateX: 10 },
    { translateX: -10 },
    { translateX: 10 },
    { translateX: 0 }
  ],
  duration: 300,
  easing: 'ease-in-out'
}
```

**Hold Expansion:**
```javascript
{
  from: { scale: 1 },
  to: { scale: 2 },
  duration: 'dynamic', // Based on target time
  easing: 'linear' // Predictable growth
}
```

**Progress Ring:**
```javascript
{
  property: 'stroke-dashoffset',
  from: circumference,
  to: 0,
  duration: 'dynamic',
  easing: 'linear'
}
```

**Particle Burst (Success):**
```javascript
{
  particles: 12,
  spread: 360,
  velocity: { min: 100, max: 200 },
  size: { min: 4, max: 8 },
  colors: ['#6366F1', '#818CF8', '#A5B4FC'],
  duration: 600,
  gravity: 200,
  fadeOut: true
}
```

### Micro-interactions

**Button Press:**
```javascript
onPressIn: {
  scale: 0.95,
  duration: 100
}
onPressOut: {
  scale: 1,
  duration: 100
}
```

**Score Increment:**
```javascript
{
  // Number rolls up
  duration: 500,
  easing: 'ease-out',
  // Brief color flash
  color: '#FBBF24' -> '#F1F5F9'
}
```

**Streak Build:**
```javascript
// Each consecutive success
{
  glow: intensity + 10%,
  scale: 1 + (streak * 0.02),
  color: gradientShift(streak)
}
```

**Level Complete:**
```javascript
{
  sequence: [
    { elements: 'shrink-to-center', duration: 300 },
    { score: 'count-up', duration: 800 },
    { stars: 'appear-sequentially', duration: 600 },
    { xp: 'increment', duration: 400 },
    { button: 'fade-in', duration: 200 }
  ]
}
```

---

## SECTION 7: PSYCHOLOGICAL FRAMEWORK

### Cognitive Functions by Game

| Game | Primary Function | Secondary Functions | Brain Regions |
|------|-----------------|---------------------|---------------|
| Steady Hold | Sustained attention | Motor inhibition, proprioception | Right frontal, parietal |
| Impulse Gate | Response inhibition | Processing speed, selective attention | Right inferior frontal |
| Drift Control | Continuous monitoring | Error correction, divided attention | Anterior cingulate |
| Sequence Recall | Working memory | Sequential processing, chunking | Dorsolateral PFC |
| Focus Switch | Task switching | Cognitive flexibility, inhibition | Dorsolateral PFC, ACC |
| Tracking Pursuit | Smooth pursuit | Prediction, visual attention | Frontal eye fields |
| Rhythm Sync | Temporal attention | Motor timing, anticipation | Basal ganglia, cerebellum |
| Distraction Defense | Selective attention | Filtering, sustained focus | Parietal cortex |
| Speed Discrimination | Perceptual decision | Visual processing, rapid judgment | Visual cortex, LIP |
| Dual Task | Divided attention | Resource allocation, multitasking | PFC, multiple systems |
| Pattern Break | Vigilance | Anomaly detection, monitoring | Right hemisphere network |
| Impulse Delay | Delay of gratification | Risk evaluation, patience | Ventromedial PFC |

### Flow State Optimization

**Challenge-Skill Balance:**
```
                    ANXIETY
                       │
    Difficulty    ─────┼─────
                       │
        BOREDOM        │    FLOW
                       └──────────→ Skill

Target zone: Challenge = Skill + 10%
```

**Implementation:**
```javascript
function calculateOptimalDifficulty(user) {
  const recentPerformance = getRecentScores(user, 5)
  const avgScore = mean(recentPerformance)

  if (avgScore > 85) {
    return currentLevel + 1  // Increase challenge
  } else if (avgScore < 60) {
    return currentLevel - 1  // Reduce frustration
  } else {
    return currentLevel      // Optimal zone
  }
}
```

### Motivation Mechanics

**Intrinsic Motivators:**
1. Competence - Clear progress metrics
2. Autonomy - Game selection, skip options
3. Relatedness - Comparison (optional), shared goals

**Extrinsic Motivators (used sparingly):**
1. XP/Leveling - Visible but not dominant
2. Streaks - Social proof, not punishment
3. Achievements - Surprise celebrations

**Variable Ratio Reinforcement:**
- Gold targets appear randomly (5-10%)
- Bonus rounds trigger conditionally
- Milestone rewards at unexpected intervals
- Prevents habituation to fixed rewards

### Avoiding Negative Patterns

**Anti-Addiction Measures:**
1. Session limits (max 15 min without break prompt)
2. No infinite loops (clear end to each session)
3. No artificial urgency (no countdown pressure)
4. No social comparison leaderboards
5. Progress is personal, not competitive

**Anti-Anxiety Measures:**
1. Generous early levels
2. Partial credit for attempts
3. No harsh fail states
4. Encouragement on regression
5. Visible recovery paths

**Anti-Boredom Measures:**
1. Varied game selection
2. Visual variety within games
3. Progressive complexity
4. Surprise bonus rounds
5. New content unlocks

### Habit Formation Model

**Cue → Routine → Reward**

**Cue Design:**
- Time-based: Morning focus ritual
- Context-based: Before important tasks
- Emotion-based: When feeling scattered

**Routine Optimization:**
- Fixed location in daily routine
- Consistent session length (predictable)
- Low friction start (one tap to begin)

**Reward Layering:**
1. Immediate: Visual/haptic feedback
2. Short-term: Score and XP
3. Medium-term: Level progress
4. Long-term: FSI improvement

---

## SECTION 8: PERSONALIZATION LOGIC

### Adaptive Difficulty Algorithm

```javascript
class AdaptiveDifficulty {
  constructor(user, game) {
    this.user = user
    this.game = game
    this.history = user.getGameHistory(game, 10)
  }

  calculateNextLevel() {
    const recent = this.history.slice(0, 5)
    const older = this.history.slice(5, 10)

    const recentAvg = mean(recent.map(s => s.score))
    const olderAvg = mean(older.map(s => s.score))
    const trend = recentAvg - olderAvg

    const currentLevel = this.user.getLevel(this.game)

    // Strong performance, trending up
    if (recentAvg > 85 && trend > 5) {
      return Math.min(currentLevel + 1, 10)
    }

    // Struggling, trending down
    if (recentAvg < 55 && trend < -5) {
      return Math.max(currentLevel - 1, 1)
    }

    // Consistent mastery - consider level up
    if (recentAvg > 80 && this.consecutiveMasteries() >= 3) {
      return Math.min(currentLevel + 1, 10)
    }

    // Default: stay at current level
    return currentLevel
  }

  adjustWithinSession(performance) {
    // Micro-adjustments during session
    if (performance.lastRound.score < 40) {
      this.reduceIntensity(10) // Easier variants
    } else if (performance.lastRound.score > 90) {
      this.increaseIntensity(5) // Preview next level
    }
  }
}
```

### Baseline Test Integration

```javascript
function processBaselineResults(baseline) {
  return {
    sustainedAttention: {
      score: baseline.holdTest.duration / baseline.holdTest.targetDuration,
      startingLevel: mapToLevel(this.score, 'sustained')
    },
    inhibition: {
      score: baseline.impulseTest.accuracy,
      startingLevel: mapToLevel(this.score, 'inhibition')
    },
    workingMemory: {
      score: baseline.memoryTest.span / 9, // Max span = 9
      startingLevel: mapToLevel(this.score, 'memory')
    },
    processingSpeed: {
      score: normalizeReactionTime(baseline.speedTest.avgRT),
      startingLevel: mapToLevel(this.score, 'speed')
    }
  }
}

function mapToLevel(normalizedScore, domain) {
  // Score 0-1 maps to levels 1-10
  // Lower starting levels for better progression feel
  const baseLevel = Math.ceil(normalizedScore * 7) // Max start: L7
  return Math.max(1, baseLevel)
}
```

### Fatigue Detection

```javascript
class FatigueDetector {
  constructor(session) {
    this.session = session
    this.metrics = []
  }

  addMetric(round) {
    this.metrics.push({
      time: round.time,
      reactionTime: round.avgRT,
      accuracy: round.accuracy,
      variability: round.rtVariability
    })
  }

  detectFatigue() {
    if (this.metrics.length < 3) return false

    const recent = this.metrics.slice(-3)
    const earlier = this.metrics.slice(0, 3)

    const rtIncrease = mean(recent.map(m => m.reactionTime)) /
                       mean(earlier.map(m => m.reactionTime))

    const accuracyDrop = mean(earlier.map(m => m.accuracy)) -
                         mean(recent.map(m => m.accuracy))

    const variabilityIncrease = mean(recent.map(m => m.variability)) /
                                 mean(earlier.map(m => m.variability))

    // Fatigue indicators
    return rtIncrease > 1.2 || // 20% slower
           accuracyDrop > 15 || // 15% less accurate
           variabilityIncrease > 1.5 // 50% more variable
  }

  suggestAction() {
    if (this.detectFatigue()) {
      return {
        action: 'END_SESSION',
        message: 'Great work! Your focus is naturally dipping. Rest and return stronger.',
        xpBonus: 10 // Reward for recognizing limit
      }
    }
    return null
  }
}
```

### Game Selection Algorithm

```javascript
class GameSelector {
  constructor(user) {
    this.user = user
    this.history = user.getAllGameHistory()
    this.skills = user.getSkillProfile()
  }

  selectGamesForSession(count = 3) {
    const candidates = this.rankGames()
    const selected = []

    // Ensure variety - no repeats from last session
    const lastSession = this.user.getLastSession()
    const recentGames = lastSession ? lastSession.games : []

    for (const game of candidates) {
      if (selected.length >= count) break
      if (!recentGames.includes(game.id)) {
        selected.push(game)
      }
    }

    return selected
  }

  rankGames() {
    return GAMES.map(game => {
      let score = 0

      // Prioritize weak skills
      const skillScore = this.skills[game.primarySkill]
      score += (100 - skillScore) * 0.3

      // Consider time since last played
      const daysSincePlayed = this.daysSince(game.id)
      score += Math.min(daysSincePlayed * 2, 20)

      // Boost games with recent improvement
      const improvement = this.recentImprovement(game.id)
      score += improvement * 10

      // Slight randomness for variety
      score += Math.random() * 10

      return { id: game.id, score }
    }).sort((a, b) => b.score - a.score)
  }
}
```

### Session Length Personalization

```javascript
function determineSessionLength(user) {
  const factors = {
    timeOfDay: getTimeOfDayFactor(),
    recentCompletionRate: user.getCompletionRate(7),
    streakLength: user.currentStreak,
    fatigueHistory: user.getFatigueTendency(),
    userPreference: user.preferredLength
  }

  // Base session: 3 games
  let games = 3

  // Morning: can handle more
  if (factors.timeOfDay === 'morning') {
    games += 1
  }

  // High completion rate: user is engaged
  if (factors.recentCompletionRate > 0.9) {
    games += 1
  }

  // Long streak: don't risk burnout
  if (factors.streakLength > 14) {
    games -= 1
  }

  // Fatigue tendency: shorter sessions
  if (factors.fatigueHistory.averageOptimalLength < 3) {
    games -= 1
  }

  // Respect user preference
  if (factors.userPreference) {
    games = factors.userPreference
  }

  return Math.max(2, Math.min(games, 5))
}
```

---

## SECTION 9: DATA MODEL

### User Skill Profile

```json
{
  "userId": "usr_abc123",
  "createdAt": 1699900000000,
  "lastUpdated": 1700000000000,

  "focusStabilityIndex": 67.3,
  "fsiHistory": [
    { "date": "2024-01-01", "value": 52.1 },
    { "date": "2024-01-08", "value": 58.4 },
    { "date": "2024-01-15", "value": 63.2 },
    { "date": "2024-01-22", "value": 67.3 }
  ],

  "skillScores": {
    "sustainedAttention": {
      "current": 71.2,
      "baseline": 48.0,
      "improvement": 48.3,
      "trend": "improving",
      "lastAssessed": 1700000000000
    },
    "responseInhibition": {
      "current": 65.8,
      "baseline": 52.1,
      "improvement": 26.3,
      "trend": "stable",
      "lastAssessed": 1700000000000
    },
    "workingMemory": {
      "current": 58.4,
      "baseline": 45.2,
      "improvement": 29.2,
      "trend": "improving",
      "lastAssessed": 1700000000000
    },
    "cognitiveFlexibility": {
      "current": 62.1,
      "baseline": 55.8,
      "improvement": 11.3,
      "trend": "stable",
      "lastAssessed": 1700000000000
    },
    "processingSpeed": {
      "current": 78.9,
      "baseline": 68.4,
      "improvement": 15.4,
      "trend": "stable",
      "lastAssessed": 1700000000000
    }
  },

  "gameLevels": {
    "steady_hold": 6,
    "impulse_gate": 5,
    "drift_control": 4,
    "sequence_recall": 4,
    "focus_switch": 5,
    "tracking_pursuit": 6,
    "rhythm_sync": 7,
    "distraction_defense": 3,
    "speed_discrimination": 6,
    "dual_task": 4,
    "pattern_break": 5,
    "impulse_delay": 4
  },

  "preferences": {
    "sessionLength": "medium",
    "hapticsEnabled": true,
    "soundEnabled": false,
    "preferredGames": ["rhythm_sync", "tracking_pursuit"],
    "avoidGames": []
  },

  "streaks": {
    "current": 12,
    "longest": 23,
    "freezesAvailable": 2,
    "lastSessionDate": "2024-01-22"
  },

  "totalStats": {
    "sessionsCompleted": 89,
    "gamesPlayed": 267,
    "totalXp": 15420,
    "totalTimePlayed": 18720000,
    "perfectScores": 31
  }
}
```

### Per-Game Metrics

```json
{
  "gameId": "steady_hold",
  "userId": "usr_abc123",

  "currentLevel": 6,
  "timesPlayed": 34,
  "totalTimePlayed": 2340000,

  "averageScore": 76.3,
  "bestScore": 98.2,
  "recentScores": [82.1, 74.5, 78.9, 81.2, 72.3],

  "levelHistory": [
    { "level": 1, "attemptsToMaster": 2, "masteredAt": 1698000000000 },
    { "level": 2, "attemptsToMaster": 3, "masteredAt": 1698200000000 },
    { "level": 3, "attemptsToMaster": 4, "masteredAt": 1698500000000 },
    { "level": 4, "attemptsToMaster": 5, "masteredAt": 1699000000000 },
    { "level": 5, "attemptsToMaster": 7, "masteredAt": 1699600000000 },
    { "level": 6, "attemptsToMaster": null, "masteredAt": null }
  ],

  "specificMetrics": {
    "averageHoldDuration": 23400,
    "averageBreakCount": 1.8,
    "steadinessIndex": 84.2,
    "completionRate": 0.91,
    "improvementRate": 2.3
  },

  "weaknesses": [
    { "type": "early_break", "frequency": 0.35 },
    { "type": "drift_recovery", "frequency": 0.22 }
  ],

  "achievements": [
    { "id": "first_perfect", "unlockedAt": 1698300000000 },
    { "id": "level_5", "unlockedAt": 1699600000000 },
    { "id": "steady_streak_5", "unlockedAt": 1699800000000 }
  ]
}
```

### Session History

```json
{
  "sessionId": "ses_xyz789",
  "userId": "usr_abc123",
  "timestamp": 1700000000000,
  "duration": 234000,

  "games": [
    {
      "gameId": "steady_hold",
      "level": 6,
      "rounds": [
        {
          "roundNumber": 1,
          "score": 78.4,
          "duration": 24000,
          "metrics": {
            "holdTime": 22800,
            "breaks": 2,
            "maxDeviation": 3.2,
            "completionPct": 95
          }
        },
        {
          "roundNumber": 2,
          "score": 84.2,
          "duration": 24000,
          "metrics": {
            "holdTime": 23500,
            "breaks": 1,
            "maxDeviation": 2.8,
            "completionPct": 98
          }
        }
      ],
      "finalScore": 81.3,
      "xpEarned": 45
    },
    {
      "gameId": "impulse_gate",
      "level": 5,
      "rounds": [
        {
          "roundNumber": 1,
          "score": 72.1,
          "duration": 30000,
          "metrics": {
            "greenTaps": 16,
            "greenMisses": 3,
            "redTaps": 2,
            "redResists": 8,
            "avgReactionTime": 387
          }
        }
      ],
      "finalScore": 72.1,
      "xpEarned": 38
    }
  ],

  "sessionScore": 76.7,
  "totalXpEarned": 83,
  "streakMaintained": true,

  "feedback": {
    "fatigueDetected": false,
    "difficultyAdjusted": false,
    "improvements": ["steadiness_up", "reaction_time_stable"]
  }
}
```

### Analytics Aggregate Data

```json
{
  "userId": "usr_abc123",
  "period": "week",
  "startDate": "2024-01-15",
  "endDate": "2024-01-22",

  "summary": {
    "sessionsCompleted": 6,
    "averageSessionScore": 74.8,
    "totalXpEarned": 482,
    "totalTimePlayed": 1260000,
    "gamesPlayed": 18
  },

  "dailyBreakdown": [
    { "date": "2024-01-15", "score": 72.1, "xp": 78 },
    { "date": "2024-01-16", "score": 75.4, "xp": 82 },
    { "date": "2024-01-17", "score": null, "xp": 0 },
    { "date": "2024-01-18", "score": 73.8, "xp": 76 },
    { "date": "2024-01-19", "score": 78.2, "xp": 85 },
    { "date": "2024-01-20", "score": 74.1, "xp": 78 },
    { "date": "2024-01-21", "score": 76.9, "xp": 83 }
  ],

  "skillProgress": {
    "sustainedAttention": { "start": 68.4, "end": 71.2, "change": 2.8 },
    "responseInhibition": { "start": 64.1, "end": 65.8, "change": 1.7 },
    "workingMemory": { "start": 56.2, "end": 58.4, "change": 2.2 }
  },

  "insights": [
    {
      "type": "improvement",
      "metric": "steadiness",
      "change": 8.3,
      "message": "Your ability to hold focus has improved significantly"
    },
    {
      "type": "consistency",
      "metric": "streak",
      "value": 6,
      "message": "Great consistency this week!"
    }
  ]
}
```

---

## SECTION 10: ANALYTICS EVENTS

### Core Events

#### game_session_started
```json
{
  "event": "game_session_started",
  "timestamp": 1700000000000,
  "properties": {
    "session_id": "ses_xyz789",
    "user_id": "usr_abc123",
    "games_selected": ["steady_hold", "impulse_gate", "rhythm_sync"],
    "session_type": "daily",
    "time_of_day": "morning",
    "current_streak": 12,
    "fsi_at_start": 67.3
  }
}
```
**Purpose:** Track session initiation, analyze optimal times, measure engagement

---

#### game_started
```json
{
  "event": "game_started",
  "timestamp": 1700000010000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "steady_hold",
    "level": 6,
    "round_number": 1,
    "difficulty_params": {
      "duration": 30,
      "threshold": 3.5
    }
  }
}
```
**Purpose:** Track game engagement, level distribution, difficulty settings

---

#### game_round_completed
```json
{
  "event": "game_round_completed",
  "timestamp": 1700000040000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "steady_hold",
    "level": 6,
    "round_number": 1,
    "score": 78.4,
    "duration_ms": 24000,
    "metrics": {
      "hold_time": 22800,
      "breaks": 2,
      "max_deviation": 3.2,
      "completion_pct": 95
    },
    "stars_earned": 2,
    "xp_earned": 22
  }
}
```
**Purpose:** Core performance data, scoring validation, difficulty tuning

---

#### game_completed
```json
{
  "event": "game_completed",
  "timestamp": 1700000120000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "steady_hold",
    "level": 6,
    "final_score": 81.3,
    "rounds_played": 2,
    "total_xp_earned": 45,
    "time_played_ms": 48000,
    "completion_type": "full",
    "performance_vs_average": 1.07,
    "level_change": 0
  }
}
```
**Purpose:** Game-level performance, XP economy, level progression

---

#### accuracy_rate
```json
{
  "event": "accuracy_rate",
  "timestamp": 1700000120000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "impulse_gate",
    "accuracy_type": "inhibition",
    "accuracy_value": 87.5,
    "sample_size": 32,
    "breakdown": {
      "true_positive": 18,
      "true_negative": 8,
      "false_positive": 2,
      "false_negative": 4
    }
  }
}
```
**Purpose:** Detailed accuracy analysis, skill-specific insights

---

#### reaction_time
```json
{
  "event": "reaction_time",
  "timestamp": 1700000120000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "impulse_gate",
    "mean_rt": 342,
    "median_rt": 328,
    "std_rt": 67,
    "min_rt": 187,
    "max_rt": 512,
    "sample_size": 20,
    "percentiles": {
      "p25": 289,
      "p75": 401
    }
  }
}
```
**Purpose:** Processing speed tracking, fatigue detection, improvement trends

---

#### streak_event
```json
{
  "event": "streak_event",
  "timestamp": 1700000240000,
  "properties": {
    "user_id": "usr_abc123",
    "streak_type": "daily",
    "event_type": "extended",
    "new_streak_length": 13,
    "previous_length": 12,
    "is_personal_best": false,
    "freeze_used": false
  }
}
```
**Purpose:** Engagement tracking, retention analysis

---

#### difficulty_adjusted
```json
{
  "event": "difficulty_adjusted",
  "timestamp": 1700000200000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "steady_hold",
    "adjustment_type": "level_up",
    "previous_level": 5,
    "new_level": 6,
    "trigger_reason": "mastery_threshold",
    "performance_data": {
      "recent_avg_score": 88.4,
      "consecutive_stars": 5
    }
  }
}
```
**Purpose:** Adaptive system tuning, progression analysis

---

#### skip_used
```json
{
  "event": "skip_used",
  "timestamp": 1700000150000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "steady_hold",
    "skip_point": "mid_round",
    "attempts_before_skip": 2,
    "last_score": 34.2,
    "reason_inferred": "frustration",
    "heart_cost": 1
  }
}
```
**Purpose:** Difficulty calibration, frustration detection

---

#### rage_quit
```json
{
  "event": "rage_quit",
  "timestamp": 1700000100000,
  "properties": {
    "session_id": "ses_xyz789",
    "game_id": "steady_hold",
    "quit_point": "round_2_mid",
    "score_at_quit": 28.4,
    "time_played_ms": 12000,
    "recent_performance": [34.2, 28.4],
    "difficulty_level": 6
  }
}
```
**Purpose:** Critical frustration indicator, immediate difficulty adjustment needed

---

#### fatigue_detected
```json
{
  "event": "fatigue_detected",
  "timestamp": 1700000200000,
  "properties": {
    "session_id": "ses_xyz789",
    "detection_method": "performance_decline",
    "indicators": {
      "rt_increase_pct": 23,
      "accuracy_drop_pct": 12,
      "variability_increase_pct": 45
    },
    "games_before_fatigue": 2,
    "action_taken": "session_end_suggested"
  }
}
```
**Purpose:** User wellbeing, optimal session length learning

---

#### session_completed
```json
{
  "event": "session_completed",
  "timestamp": 1700000240000,
  "properties": {
    "session_id": "ses_xyz789",
    "user_id": "usr_abc123",
    "completion_type": "full",
    "games_played": 3,
    "total_score": 76.7,
    "total_xp": 83,
    "duration_ms": 234000,
    "streak_status": "maintained",
    "fsi_change": 0.3,
    "improvements": ["steadiness_up"]
  }
}
```
**Purpose:** Session-level analysis, daily engagement

---

#### achievement_unlocked
```json
{
  "event": "achievement_unlocked",
  "timestamp": 1700000240000,
  "properties": {
    "user_id": "usr_abc123",
    "achievement_id": "steady_master",
    "achievement_name": "Steady Master",
    "category": "skill",
    "trigger": "steady_hold_level_5",
    "xp_bonus": 100,
    "is_first_time": true
  }
}
```
**Purpose:** Engagement milestones, celebration triggers

---

### Event Usage Summary

| Event | Frequency | Primary Use | Secondary Use |
|-------|-----------|-------------|---------------|
| game_session_started | Per session | Engagement | Time analysis |
| game_started | Per game | Level distribution | Load time |
| game_round_completed | Per round | Core metrics | Scoring |
| game_completed | Per game | Progression | XP economy |
| accuracy_rate | Per game | Skill tracking | Difficulty |
| reaction_time | Per game | Speed tracking | Fatigue |
| streak_event | Daily | Retention | Motivation |
| difficulty_adjusted | On change | Adaptive tuning | Balance |
| skip_used | On skip | Frustration | UX |
| rage_quit | On quit | Critical alert | Immediate action |
| fatigue_detected | On detect | Wellbeing | Session length |
| session_completed | Per session | Daily metrics | Trends |
| achievement_unlocked | On unlock | Celebration | Engagement |

---

## SECTION 11: A/B TESTING IDEAS

### Visual & UX Tests

#### 1. Target Shape Comparison
**Hypothesis:** Rounded shapes feel more approachable than geometric shapes
**Variants:**
- A: Circle targets
- B: Rounded square targets
- C: Soft blob shapes
**Metrics:** Completion rate, satisfaction score, perceived difficulty

#### 2. Feedback Intensity
**Hypothesis:** More celebratory feedback increases motivation without feeling childish
**Variants:**
- A: Minimal (color change only)
- B: Medium (color + small animation)
- C: Full (particles + sound + haptic)
**Metrics:** Session completion, return rate, score improvement

#### 3. Progress Indicator Style
**Hypothesis:** Circular progress feels more natural than linear
**Variants:**
- A: Linear bar at top
- B: Circular ring around target
- C: Filling background
**Metrics:** Perceived time accuracy, anxiety indicators, completion rate

#### 4. Color Temperature
**Hypothesis:** Cooler colors reduce anxiety during challenging moments
**Variants:**
- A: Warm accent (#F59E0B orange)
- B: Cool accent (#3B82F6 blue)
- C: Neutral accent (#6366F1 indigo)
**Metrics:** Error rate on difficult levels, session duration, skip rate

#### 5. Score Display Timing
**Hypothesis:** Delayed score reduces anxiety and improves flow
**Variants:**
- A: Real-time score visible
- B: Score revealed at round end
- C: Score revealed at game end only
**Metrics:** Flow state indicators, score consistency, stress markers

### Difficulty & Progression Tests

#### 6. Starting Difficulty
**Hypothesis:** Easier start builds confidence without boring experienced users
**Variants:**
- A: Fixed L1 start for everyone
- B: Baseline-adjusted start (L1-L3)
- C: Quick adaptive (adjust after 1 round)
**Metrics:** Day 1 completion, week 1 retention, perceived difficulty

#### 7. Level-Up Threshold
**Hypothesis:** Lower thresholds create more victories without cheapening achievement
**Variants:**
- A: 85% for 3 sessions
- B: 80% for 3 sessions
- C: 75% for 4 sessions
**Metrics:** Level distribution after 30 days, satisfaction, challenge perception

#### 8. Regression Policy
**Hypothesis:** Graceful regression reduces frustration
**Variants:**
- A: Auto drop after 3 failures
- B: User-chosen regression
- C: No regression, easier within-level variants
**Metrics:** Skip rate, quit rate, return rate after failure

#### 9. Streak Forgiveness
**Hypothesis:** Streak freezes reduce anxiety without reducing engagement
**Variants:**
- A: No freezes
- B: 1 free freeze per week
- C: Unlimited freezes (streak just pauses)
**Metrics:** Streak length, return after miss, daily engagement

#### 10. Session Length Options
**Hypothesis:** User control over length improves completion
**Variants:**
- A: Fixed 3 games
- B: Choose 2-5 games
- C: Time-based (3/5/10 min)
**Metrics:** Completion rate, total games played, satisfaction

### Gamification Tests

#### 11. XP Visibility
**Hypothesis:** Visible XP increases motivation without creating addiction
**Variants:**
- A: Always visible
- B: Visible on results only
- C: Hidden (replaced with progress %)
**Metrics:** Session count, improvement rate, perceived value

#### 12. Achievement Frequency
**Hypothesis:** More frequent small achievements > rare large achievements
**Variants:**
- A: Few big achievements (20 total)
- B: Many small achievements (100 total)
- C: Layered (small + big)
**Metrics:** Engagement duration, achievement hunting behavior, satisfaction

#### 13. Social Comparison
**Hypothesis:** Opt-in comparison motivates without discouraging
**Variants:**
- A: No comparison
- B: Percentile rank shown
- C: Anonymous benchmark only
**Metrics:** Improvement rate, satisfaction, anxiety indicators

#### 14. Bonus Round Trigger
**Hypothesis:** Earned bonuses feel better than random bonuses
**Variants:**
- A: Random 20% chance
- B: Triggered by streak (3+ perfect)
- C: Triggered by improvement (beat personal best)
**Metrics:** Bonus completion rate, motivation indicators, session extension

### Interaction Tests

#### 15. Haptic Pattern
**Hypothesis:** Rhythmic haptics improve timing games without annoying
**Variants:**
- A: Success/fail only
- B: Timing cues added
- C: Continuous feedback
**Metrics:** Timing accuracy, satisfaction, haptic toggle rate

#### 16. Error Feedback Style
**Hypothesis:** Constructive feedback > punitive feedback
**Variants:**
- A: Red X + shake
- B: Gentle fade + try again text
- C: Show correct action briefly
**Metrics:** Recovery after error, anxiety, improvement rate

#### 17. Skip Cost
**Hypothesis:** Free skips reduce frustration without abuse
**Variants:**
- A: No skip option
- B: 1 heart cost
- C: Free but tracked
**Metrics:** Skip rate, completion rate, abuse patterns

#### 18. Input Method for Drift Control
**Hypothesis:** Tilt feels more immersive than drag
**Variants:**
- A: Drag only
- B: Tilt only
- C: User choice
**Metrics:** Accuracy, engagement, preference distribution

### Content & Framing Tests

#### 19. Instruction Style
**Hypothesis:** Show-don't-tell improves comprehension
**Variants:**
- A: Text instructions
- B: Animated demo
- C: Interactive tutorial
**Metrics:** First-attempt success, comprehension questions, time to start

#### 20. Result Framing
**Hypothesis:** Growth framing > fixed performance framing
**Variants:**
- A: "You scored 78"
- B: "You improved 3% from last time"
- C: "You're building toward mastery"
**Metrics:** Return rate, motivation indicators, perceived progress

---

## SECTION 12: ACCESSIBILITY & EDGE CASES

### Accessibility Features

#### Large Target Mode
```json
{
  "feature": "large_targets",
  "changes": {
    "targetSize": "×1.5 default",
    "touchArea": "×2 default",
    "spacing": "increased",
    "animations": "slower by 20%"
  },
  "triggeredBy": "settings or system accessibility"
}
```

#### Color Blindness Modes
```json
{
  "modes": {
    "protanopia": {
      "green": "#3B82F6", // Blue replaces green
      "red": "#F59E0B",   // Orange replaces red
      "patterns": true    // Add patterns to colors
    },
    "deuteranopia": {
      "green": "#3B82F6",
      "red": "#F59E0B",
      "patterns": true
    },
    "tritanopia": {
      "blue": "#F43F5E",  // Pink replaces blue
      "yellow": "#10B981", // Green replaces yellow
      "patterns": true
    }
  },
  "patternTypes": {
    "target": "solid",
    "distractor": "striped",
    "bonus": "dotted"
  }
}
```

#### Reduced Motion
```json
{
  "feature": "reduced_motion",
  "changes": {
    "particleEffects": "disabled",
    "transitionDuration": "instant",
    "pulsingAnimations": "static glow",
    "screenShake": "color flash only",
    "movingBackgrounds": "static"
  },
  "triggeredBy": "system preference or settings"
}
```

#### Sound-Free Mode
```json
{
  "feature": "no_sound",
  "compensations": {
    "rhythmGames": "visual metronome enhanced",
    "alerts": "screen flash + haptic",
    "success": "extended visual feedback",
    "timing": "visual countdown prominent"
  }
}
```

#### One-Handed Mode
```json
{
  "feature": "one_handed",
  "changes": {
    "reachableZone": "lower 60% of screen",
    "primaryActions": "bottom center",
    "swipeDirections": "vertical only"
  }
}
```

### Edge Cases & Fallbacks

#### Repeated Failure Handling
```javascript
function handleRepeatedFailure(game, attempts) {
  if (attempts >= 3 && avgScore < 40) {
    return {
      action: 'OFFER_HELP',
      options: [
        'Lower difficulty',
        'Try different game',
        'Watch tutorial again',
        'Take a break'
      ],
      message: "This one's tricky! Want to try something different?",
      tone: 'encouraging',
      noShame: true
    }
  }
}
```

#### Boredom Detection
```javascript
function detectBoredom(session) {
  const indicators = {
    perfectScoresInRow: session.consecutivePerfects > 5,
    lowEngagement: session.inputVariability < threshold,
    fastCompletions: session.avgTimePerRound < expected * 0.7
  }

  if (indicators.perfectScoresInRow) {
    return {
      action: 'INCREASE_CHALLENGE',
      message: "You're crushing it! Ready for more?",
      autoLevelUp: true
    }
  }
}
```

#### Rage Quit Recovery
```javascript
function handleRageQuit(user, game) {
  // Don't penalize
  preserveStreak(user)

  // Next time user opens app
  return {
    greeting: "Welcome back! Let's try something different today.",
    avoidGame: game.id,
    offerAlternatives: getEasierGames(user),
    reduceDifficulty: game.id // If they choose same game
  }
}
```

#### Performance Issues

**Slow Frame Rate:**
```javascript
if (currentFPS < 30) {
  // Reduce visual complexity
  disableParticles()
  simplifyAnimations()

  // Adjust gameplay
  increaseTimingWindow(20%)

  // Notify user
  showToast("Running in performance mode")
}
```

**Phone Overheating:**
```javascript
if (thermalState === 'critical') {
  // Pause gracefully
  pauseSession()

  showMessage({
    title: "Let's cool down",
    body: "Your phone needs a break. We'll save your progress.",
    action: "Resume in 5 minutes"
  })

  // Save state
  saveSessionState()
}
```

**Accidental Touch:**
```javascript
// Detect anomalies
if (touchPressure < minThreshold || touchSize > maxThreshold) {
  ignoreTap()
  return
}

// Multi-touch rejection in single-tap games
if (activeTouches > 1) {
  ignoreTap()
  showHint("Use one finger")
}
```

**Low Battery Mode:**
```javascript
if (batteryLevel < 20) {
  // Reduce power consumption
  reduceBrightness()
  disableHaptics()
  simplifyAnimations()

  // Shorter session suggestion
  suggestShorterSession()
}
```

#### Network Edge Cases

**Offline Mode:**
```javascript
if (!isOnline) {
  // Full functionality locally
  enableOfflineMode()

  // Queue syncs
  queueAnalytics()
  queueProgress()

  // Notify
  showIndicator("Offline - will sync when connected")
}
```

**Sync Conflicts:**
```javascript
function resolveConflict(local, server) {
  // Always favor better scores
  return {
    score: Math.max(local.score, server.score),
    level: Math.max(local.level, server.level),
    streak: Math.max(local.streak, server.streak),
    // Merge session history
    sessions: mergeUnique(local.sessions, server.sessions)
  }
}
```

### Error State UI

#### Game Load Failure
```
┌─────────────────────────┐
│                         │
│     ⚠️ Couldn't load    │
│                         │
│   Something went wrong  │
│   loading this game.    │
│                         │
│   [Try Again] [Skip]    │
│                         │
└─────────────────────────┘
```

#### Score Save Failure
```
┌─────────────────────────┐
│                         │
│   ✓ Great session!      │
│   Score: 82             │
│                         │
│   ⚠️ Saving offline     │
│   Will sync when back   │
│   online                │
│                         │
│   [Continue]            │
│                         │
└─────────────────────────┘
```

#### Timeout Recovery
```
┌─────────────────────────┐
│                         │
│   ⏸️ Session paused     │
│                         │
│   No activity detected  │
│   Progress is saved     │
│                         │
│   [Resume] [End Session]│
│                         │
└─────────────────────────┘
```

---

## SECTION 13: IMPLEMENTATION CHECKLIST

### Phase 1: Core Games (MVP)
- [ ] Steady Hold
- [ ] Impulse Gate
- [ ] Sequence Recall
- [ ] Tracking Pursuit

### Phase 2: Extended Games
- [ ] Drift Control
- [ ] Focus Switch
- [ ] Rhythm Sync
- [ ] Distraction Defense

### Phase 3: Advanced Games
- [ ] Speed Discrimination
- [ ] Dual Task
- [ ] Pattern Break
- [ ] Impulse Delay

### Infrastructure
- [ ] Scoring engine
- [ ] Analytics pipeline
- [ ] Adaptive difficulty system
- [ ] Data persistence layer
- [ ] Offline support
- [ ] Sync mechanism

### Polish
- [ ] All animations implemented
- [ ] Haptic patterns tuned
- [ ] Accessibility modes
- [ ] Error states
- [ ] Performance optimization
- [ ] A/B test framework

### Testing
- [ ] Unit tests for scoring
- [ ] Integration tests for sessions
- [ ] User testing (n=20+)
- [ ] Accessibility audit
- [ ] Performance benchmarks

---

## APPENDIX: QUICK REFERENCE

### Scoring Cheat Sheet

| Game | Perfect Score | 3-Star Threshold | Key Metric |
|------|--------------|------------------|------------|
| Steady Hold | 100 | 85 | Hold duration |
| Impulse Gate | ~150 | 85 | Inhibition rate |
| Drift Control | 1000+ | 85 | Time in zone |
| Sequence Recall | 100 | 85 | Sequences correct |
| Focus Switch | ~200 | 85 | Switch accuracy |
| Tracking Pursuit | 1000+ | 85 | Tracking % |
| Rhythm Sync | ~300 | 85 | Perfect taps |
| Distraction Defense | 100 | 85 | Correct counts |
| Speed Discrimination | ~200 | 85 | Accuracy |
| Dual Task | 300 | 85 | Both correct |
| Pattern Break | ~200 | 85 | Detection rate |
| Impulse Delay | 500+ | 85 | Risk-adjusted |

### Haptic Quick Reference

| Action | Pattern | Intensity |
|--------|---------|-----------|
| Target appear | Single tick | Light |
| Correct tap | Single pulse | Medium |
| Perfect tap | Double pulse | Medium |
| Error | Double tap | Medium |
| Success | Triple pulse | Strong |
| Warning | Continuous | Increasing |
| Milestone | Pattern | Strong |

### Color Quick Reference

| State | Color | Hex |
|-------|-------|-----|
| Default target | Indigo | #6366F1 |
| Success | Green | #10B981 |
| Error | Red | #EF4444 |
| Warning | Orange | #F59E0B |
| Bonus/Gold | Yellow | #FBBF24 |
| Don't tap | Red | #F43F5E |
| Neutral | Blue | #3B82F6 |

---

*Document Version: 2.0*
*Last Updated: January 2024*
*Status: Production Ready*
