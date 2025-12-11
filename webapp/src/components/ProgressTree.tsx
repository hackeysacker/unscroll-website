import { useState, useMemo, useRef, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import {
  Lock,
  Star,
  CheckCircle2,
  ArrowLeft,
  Flame,
  Zap,
  Heart,
} from 'lucide-react';
import type { ProgressTreeNode, ChallengeType } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const CHALLENGE_DESCRIPTIONS: Record<ChallengeType, { name: string; emoji: string; description: string; skill: string }> = {
  // New MVP exercises
  focus_hold: { name: 'Focus Hold', emoji: '👁️', description: 'Hold your gaze on the center dot', skill: 'Focus' },
  finger_hold: { name: 'Finger Hold', emoji: '👆', description: 'Keep your finger still on the spot', skill: 'Focus' },
  slow_tracking: { name: 'Slow Tracking', emoji: '🎯', description: 'Track the moving shape smoothly', skill: 'Focus' },
  tap_only_correct: { name: 'Tap Only Correct', emoji: '✅', description: 'Tap only the correct shapes', skill: 'Impulse Control' },
  breath_pacing: { name: 'Breath Pacing', emoji: '🌬️', description: 'Follow the breathing rhythm', skill: 'Focus' },
  fake_notifications: { name: 'Fake Notifications', emoji: '🔔', description: 'Ignore the fake pop-ups', skill: 'Distraction Resistance' },
  look_away: { name: 'Look Away', emoji: '🙈', description: 'Do not touch, just breathe', skill: 'Impulse Control' },
  delay_unlock: { name: 'Delay Unlock', emoji: '🔓', description: 'Hold the unlock button', skill: 'Impulse Control' },
  anti_scroll_swipe: { name: 'Anti-Scroll', emoji: '📱', description: 'Swipe up to break the scroll loop', skill: 'Impulse Control' },
  memory_flash: { name: 'Memory Flash', emoji: '💡', description: 'Remember the sequence shown', skill: 'Focus' },
  reaction_inhibition: { name: 'Reaction Inhibition', emoji: '🚫', description: 'Tap only the specific target', skill: 'Impulse Control' },
  multi_object_tracking: { name: 'Multi-Object Track', emoji: '👀', description: 'Track multiple moving targets', skill: 'Focus' },
  rhythm_tap: { name: 'Rhythm Tap', emoji: '🎵', description: 'Tap in rhythm with the pulse', skill: 'Focus' },
  stillness_test: { name: 'Stillness Test', emoji: '🧘', description: 'Hold perfectly still', skill: 'Impulse Control' },
  impulse_spike_test: { name: 'Impulse Spike', emoji: '⚡', description: 'Resist bright hooks and bait', skill: 'Distraction Resistance' },
  finger_tracing: { name: 'Finger Tracing', emoji: '✏️', description: 'Trace the path accurately', skill: 'Focus' },
  multi_task_tap: { name: 'Multi-Task Tap', emoji: '🤹', description: 'Hold and tap simultaneously', skill: 'Impulse Control' },
  popup_ignore: { name: 'Pop-Up Ignore', emoji: '🚨', description: 'Stay focused, ignore flashes', skill: 'Distraction Resistance' },
  controlled_breathing: { name: 'Controlled Breathing', emoji: '🫁', description: 'Follow complex breath patterns', skill: 'Focus' },
  reset: { name: 'Level Reset', emoji: '🔄', description: 'Cooldown and mini test', skill: 'Focus' },
  // Legacy exercises
  gaze_hold: { name: 'Gaze Hold', emoji: '👁️', description: 'Hold your focus on the target', skill: 'Focus' },
  moving_target: { name: 'Moving Target', emoji: '🎯', description: 'Track and click moving targets', skill: 'Focus' },
  tap_pattern: { name: 'Pattern Memory', emoji: '🧠', description: 'Remember and repeat patterns', skill: 'Impulse Control' },
  stability_hold: { name: 'Stability Hold', emoji: '🎚️', description: 'Keep your cursor steady', skill: 'Focus' },
  impulse_delay: { name: 'Impulse Delay', emoji: '⏱️', description: 'Wait for the perfect moment', skill: 'Impulse Control' },
  distraction_resistance: { name: 'Distraction Resist', emoji: '🛡️', description: 'Ignore the distractions', skill: 'Distraction Resistance' },
  audio_focus: { name: 'Audio Focus', emoji: '🔊', description: 'Count the target sounds', skill: 'Distraction Resistance' },
};

interface ProgressTreeProps {
  onBack?: () => void;
  onSelectLevel: (level: number) => void;
}

// Color palette from spec
const COLORS = {
  background: '#050814', // Very dark navy
  backgroundAlt: '#050509', // Alternative dark
  headerBg: '#050814', // Same or slightly darker
  statsPillBg: '#111827', // Slightly lighter navy
  textPrimary: '#F5F5F7', // Soft white
  textSecondary: '#9CA3AF', // Muted gray
  textMuted: '#6B7280', // Locked text
  textAvailable: '#E5E7EB', // Available/completed labels
  accentPrimary: '#22D3EE', // Cyan - focus, progress path
  accentSecondary: '#2DD4BF', // Teal - completed nodes
  accentGold: '#FACC15', // Gold - mastery
  accentError: '#F87171', // Soft red
  nodeLockedBorder: '#4B5563', // Muted gray
  nodeLockedFill: '#020617', // Almost same as background
  nodeCurrentInner: '#0F172A', // Dark inner
  pathUnlocked: '#1F2933', // Desaturated teal line
  pathLocked: '#111827', // Muted dark gray-blue
  bottomSheetBg: '#020617', // Dark background for bottom sheet
};

export function ProgressTree({ onBack, onSelectLevel }: ProgressTreeProps) {
  const { progress, progressTree, heartState } = useGame();
  const [selectedNode, setSelectedNode] = useState<ProgressTreeNode | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  if (!progress || !progressTree) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <p style={{ color: COLORS.textPrimary }}>Loading...</p>
      </div>
    );
  }

  // Get all nodes sorted by level and position
  const allNodes = useMemo(() => {
    return progressTree.nodes
      .filter((node: ProgressTreeNode) => node.level <= 10) // Show first 10 levels
      .sort((a: ProgressTreeNode, b: ProgressTreeNode) => {
        if (a.level !== b.level) return a.level - b.level;
        return a.position - b.position;
      });
  }, [progressTree.nodes]);

  // Group nodes by level for unit headers
  const nodesByLevel = useMemo(() => {
    const grouped: Record<number, ProgressTreeNode[]> = {};
    allNodes.forEach((node: ProgressTreeNode) => {
      if (!grouped[node.level]) {
        grouped[node.level] = [];
      }
      grouped[node.level].push(node);
    });
    return grouped;
  }, [allNodes]);

  // Calculate node positions for curved path
  const nodePositions = useMemo(() => {
    return allNodes.map((node: ProgressTreeNode, index: number) => {
      const centerX = 200; // Center X coordinate for SVG
      const y = 120 + index * 80; // Vertical spacing
      const side = index % 2 === 0 ? 'left' : 'right'; // Alternate sides
      const offsetX = side === 'left' ? -120 : 120; // Offset from center
      return { node, x: centerX, y, side, index, offsetX };
    });
  }, [allNodes]);

  const handleNodeClick = (node: ProgressTreeNode) => {
    if (node.status === 'locked') return;
    setSelectedNode(node);
    setIsSheetOpen(true);
  };

  const handleNodeKeyDown = (e: React.KeyboardEvent, node: ProgressTreeNode) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(node);
    }
  };

  const handleStartChallenge = () => {
    if (selectedNode) {
      setIsSheetOpen(false);
      onSelectLevel(selectedNode.level);
    }
  };

  // Focus management for keyboard navigation
  useEffect(() => {
    if (focusedNodeId && nodeRefs.current[focusedNodeId]) {
      nodeRefs.current[focusedNodeId]?.focus();
    }
  }, [focusedNodeId]);

  // Get accessible label for node
  const getNodeLabel = (node: ProgressTreeNode) => {
    const challenge = CHALLENGE_DESCRIPTIONS[node.challengeType];
    const isTest = node.nodeType === 'test';
    const isLocked = node.status === 'locked';
    const isCurrent = node.id === progressTree.currentNodeId;
    const isCompleted = node.status === 'completed' || node.status === 'perfect';
    const isMastered = node.status === 'perfect' && node.starsEarned >= 3;

    let label = isTest ? `Level ${node.level} Test` : challenge.name;
    if (isLocked) {
      label = `${label}, Locked`;
    } else if (isCurrent) {
      label = `${label}, Current challenge`;
    } else if (isMastered) {
      label = `${label}, Mastered`;
    } else if (isCompleted) {
      label = `${label}, Completed`;
    }
    label += `. ${challenge.description}. Reward: ${node.xpReward} XP`;
    return label;
  };

  // Render a single node
  const renderNode = (node: ProgressTreeNode, position: { x: number; y: number; side: string; index: number; offsetX: number }) => {
    const isLocked = node.status === 'locked';
    const isCurrent = node.id === progressTree.currentNodeId;
    const isCompleted = node.status === 'completed' || node.status === 'perfect';
    const isMastered = node.status === 'perfect' && node.starsEarned >= 3;
    const challenge = CHALLENGE_DESCRIPTIONS[node.challengeType];
    const isTest = node.nodeType === 'test';

    const nodeSize = isTest ? 72 : 56;
    const nodeX = position.x + position.offsetX;
    const nodeLabel = getNodeLabel(node);

    return (
      <g key={node.id}>
        {/* Accessible button overlay for keyboard navigation */}
        <foreignObject
          x={nodeX - nodeSize / 2}
          y={position.y - nodeSize / 2}
          width={nodeSize}
          height={nodeSize}
          className="pointer-events-auto"
        >
          <button
            ref={(el) => {
              nodeRefs.current[node.id] = el;
            }}
            onClick={() => handleNodeClick(node)}
            onKeyDown={(e) => handleNodeKeyDown(e, node)}
            disabled={isLocked}
            aria-label={nodeLabel}
            aria-disabled={isLocked}
            aria-current={isCurrent ? 'step' : undefined}
            className={`absolute inset-0 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLocked
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:scale-110'
            } ${
              isCurrent
                ? 'focus:ring-cyan-400'
                : isCompleted
                ? 'focus:ring-teal-400'
                : 'focus:ring-gray-400'
            }`}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
            }}
            tabIndex={isLocked ? -1 : 0}
          />
        </foreignObject>

        {/* Node circle */}
        <circle
          cx={nodeX}
          cy={position.y}
          r={nodeSize / 2}
          fill={isLocked ? COLORS.nodeLockedFill : COLORS.nodeCurrentInner}
          stroke={
            isLocked
              ? COLORS.nodeLockedBorder
              : isMastered
              ? COLORS.accentGold
              : isCompleted
              ? COLORS.accentSecondary
              : isCurrent
              ? COLORS.accentPrimary
              : COLORS.nodeLockedBorder
          }
          strokeWidth={isLocked ? 2 : 3}
          className={isCurrent ? 'animate-pulse' : ''}
          style={{
            filter: isCurrent || isCompleted || isMastered
              ? `drop-shadow(0 0 ${isCurrent ? '12px' : '8px'} ${isMastered ? COLORS.accentGold : isCompleted ? COLORS.accentSecondary : COLORS.accentPrimary})`
              : 'none',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />

        {/* Inner glow for current node */}
        {isCurrent && (
          <circle
            cx={nodeX}
            cy={position.y}
            r={nodeSize / 2 - 4}
            fill="none"
            stroke={COLORS.accentPrimary}
            strokeWidth={1}
            opacity={0.5}
            className="animate-pulse"
          />
        )}

        {/* Node icon/content */}
        {isLocked ? (
          <foreignObject x={nodeX - 8} y={position.y - 8} width={16} height={16} aria-hidden="true">
            <Lock className="w-4 h-4" style={{ color: COLORS.textMuted }} aria-hidden="true" />
          </foreignObject>
        ) : (
          <text
            x={nodeX}
            y={position.y + 4}
            textAnchor="middle"
            fontSize={isTest ? 24 : 20}
            fill={COLORS.textPrimary}
            aria-hidden="true"
          >
            {isTest ? '🎯' : challenge.emoji}
          </text>
        )}

        {/* Check mark for completed */}
        {isCompleted && !isLocked && (
          <foreignObject
            x={nodeX + nodeSize / 2 - 8}
            y={position.y - nodeSize / 2 + 8}
            width={16}
            height={16}
            aria-hidden="true"
          >
            <CheckCircle2
              className="w-4 h-4"
              style={{ color: COLORS.accentSecondary }}
              aria-label="Completed"
            />
          </foreignObject>
        )}

        {/* Star badge for mastered */}
        {isMastered && (
          <foreignObject
            x={nodeX + nodeSize / 2 - 10}
            y={position.y - nodeSize / 2 + 10}
            width={20}
            height={20}
            aria-hidden="true"
          >
            <Star
              className="w-5 h-5"
              style={{ color: COLORS.accentGold }}
              fill={COLORS.accentGold}
              aria-label="Mastered"
            />
          </foreignObject>
        )}

        {/* Node label - visible text */}
        <text
          x={nodeX}
          y={position.y + nodeSize / 2 + 20}
          textAnchor="middle"
          fontSize={12}
          fill={isLocked ? COLORS.textMuted : COLORS.textAvailable}
          fontWeight={isCurrent ? 'bold' : 'normal'}
          aria-hidden="true"
        >
          {isTest ? `Level ${node.level} Test` : challenge.name}
        </text>
      </g>
    );
  };

  // Render path line between nodes
  const renderPath = () => {
    const pathElements = [];
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const current = nodePositions[i];
      const next = nodePositions[i + 1];
      // Path is unlocked if current node is completed/available (not locked)
      const isUnlocked = current.node.status !== 'locked';

      const currentX = current.x + current.offsetX;
      const nextX = next.x + next.offsetX;

      // Create smooth curve
      const midY = (current.y + next.y) / 2;
      const controlX1 = currentX;
      const controlY1 = current.y + 20;
      const controlX2 = nextX;
      const controlY2 = next.y - 20;

      const pathColor = isUnlocked ? COLORS.accentPrimary : COLORS.pathLocked;
      const pathWidth = isUnlocked ? 3 : 2;

      pathElements.push(
        <path
          key={`path-${i}`}
          d={`M ${currentX} ${current.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${nextX} ${next.y}`}
          fill="none"
          stroke={pathColor}
          strokeWidth={pathWidth}
          opacity={isUnlocked ? 0.8 : 0.3}
          strokeLinecap="round"
        />
      );

      // Add inner highlight for unlocked segments
      if (isUnlocked) {
        pathElements.push(
          <path
            key={`path-highlight-${i}`}
            d={`M ${currentX} ${current.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${nextX} ${next.y}`}
            fill="none"
            stroke={COLORS.accentPrimary}
            strokeWidth={1}
            opacity={0.5}
            strokeLinecap="round"
          />
        );
      }
    }
    return pathElements;
  };

  // Get unit headers (every 5 exercises or at level boundaries)
  const unitHeaders = useMemo(() => {
    const headers: Array<{ y: number; level: number; title: string; subtitle: string }> = [];
    let lastLevel = 0;
    nodePositions.forEach((pos) => {
      if (pos.node.level !== lastLevel) {
        headers.push({
          y: pos.y - 40,
          level: pos.node.level,
          title: `Unit ${pos.node.level} · Calm Foundations`,
          subtitle: 'Intro drills that stabilize your attention',
        });
        lastLevel = pos.node.level;
      }
    });
    return headers;
  }, [nodePositions]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden" 
      style={{ backgroundColor: COLORS.background }}
      role="main"
      aria-label="Progress path"
    >
      {/* Skip to content link for screen readers */}
      <a
        href="#progress-path-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-white focus:rounded-md"
      >
        Skip to progress path
      </a>

      {/* Header */}
      <header
        className="sticky top-0 z-20 px-4 py-6"
        style={{ backgroundColor: COLORS.headerBg }}
        role="banner"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-1"
            aria-label="Go back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-1" style={{ color: COLORS.textPrimary }}>
            Your Focus Journey
          </h1>
          <p className="text-sm mb-4" style={{ color: COLORS.textSecondary }}>
            Complete a node each day to grow your attention
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-3" role="list" aria-label="Your progress statistics">
            {/* Streak pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: COLORS.statsPillBg }}
              role="listitem"
              aria-label={`${progress.streak} day streak`}
            >
              <Flame className="w-4 h-4" style={{ color: COLORS.accentPrimary }} aria-hidden="true" />
              <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                {progress.streak} day streak
              </span>
            </div>

            {/* XP pill */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: COLORS.statsPillBg }}
              role="listitem"
              aria-label={`${progress.xp} experience points`}
            >
              <Zap className="w-4 h-4" style={{ color: COLORS.accentPrimary }} aria-hidden="true" />
              <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                {progress.xp} XP
              </span>
            </div>

            {/* Hearts pill */}
            {heartState && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: COLORS.statsPillBg }}
                role="listitem"
                aria-label={`${heartState.currentHearts} hearts remaining`}
              >
                <Heart className="w-4 h-4" style={{ color: COLORS.accentError }} aria-hidden="true" />
                <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                  {heartState.currentHearts} hearts
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main path visualization */}
      <div 
        id="progress-path-content"
        className="relative max-w-2xl mx-auto px-4 pb-20"
        role="region"
        aria-label="Progress path with challenges"
      >
        <svg
          width="400"
          height={nodePositions.length * 80 + 200}
          viewBox={`0 0 400 ${nodePositions.length * 80 + 200}`}
          className="w-full"
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="Visual progress path showing your learning journey"
        >
          <title>Your Focus Journey Progress Path</title>
          <desc>
            A vertical path showing {allNodes.length} challenges arranged in a curved line. 
            {allNodes.filter(n => n.status === 'locked').length} challenges are locked, 
            {allNodes.filter(n => n.status === 'completed' || n.status === 'perfect').length} are completed, 
            and {allNodes.filter(n => n.id === progressTree.currentNodeId).length > 0 ? '1 is your current challenge' : 'none are currently active'}.
          </desc>
          {/* Render path lines */}
          {renderPath()}

          {/* Render unit headers */}
          {unitHeaders.map((header, idx) => (
            <g key={`header-${idx}`} role="group" aria-label={`Unit ${header.level}`}>
              {/* Divider line */}
              <line
                x1="50"
                y1={header.y}
                x2="350"
                y2={header.y}
                stroke={COLORS.pathLocked}
                strokeWidth={1}
                opacity={0.3}
                strokeDasharray="4 4"
                aria-hidden="true"
              />
              {/* Unit title */}
              <text
                x="200"
                y={header.y - 20}
                textAnchor="middle"
                fontSize={14}
                fontWeight="bold"
                fill={COLORS.textPrimary}
                role="text"
                aria-label={header.title}
              >
                {header.title}
              </text>
              {/* Unit subtitle */}
              <text
                x="200"
                y={header.y - 5}
                textAnchor="middle"
                fontSize={11}
                fill={COLORS.textSecondary}
                role="text"
                aria-label={header.subtitle}
              >
                {header.subtitle}
              </text>
            </g>
          ))}

          {/* Render all nodes */}
          {nodePositions.map((position) => renderNode(position.node, position))}
        </svg>
      </div>

      {/* Bottom Sheet for node details */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl"
          style={{ backgroundColor: COLORS.bottomSheetBg, borderColor: COLORS.pathLocked }}
          aria-label="Challenge details"
        >
          {selectedNode && (
            <>
              <SheetHeader>
                <SheetTitle style={{ color: COLORS.textPrimary }}>
                  {selectedNode.nodeType === 'test'
                    ? `Level ${selectedNode.level} Test`
                    : CHALLENGE_DESCRIPTIONS[selectedNode.challengeType].name}
                </SheetTitle>
                <SheetDescription style={{ color: COLORS.textSecondary }}>
                  {selectedNode.nodeType === 'test'
                    ? 'Complete all challenges to pass this level'
                    : CHALLENGE_DESCRIPTIONS[selectedNode.challengeType].description}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-4 space-y-4" role="region" aria-label="Challenge information">
                <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.textSecondary }}>
                  <span>Reward: +{selectedNode.xpReward} XP</span>
                  {selectedNode.status === 'completed' && (
                    <span className="flex items-center gap-1" aria-label="Challenge completed">
                      <CheckCircle2 className="w-4 h-4" style={{ color: COLORS.accentSecondary }} aria-hidden="true" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>
              </div>

              <SheetFooter>
                <Button
                  onClick={handleStartChallenge}
                  className="w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  style={{
                    backgroundColor: COLORS.accentPrimary,
                    color: COLORS.background,
                  }}
                  aria-label={selectedNode.status === 'completed' ? 'Review this challenge' : 'Start this challenge'}
                >
                  {selectedNode.status === 'completed' ? 'Review' : 'Start Challenge'}
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
