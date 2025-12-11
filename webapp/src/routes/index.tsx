import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { GameProvider, useGame } from "@/contexts/GameContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Welcome } from "@/components/onboarding/Welcome";
import { PatternInterrupt } from "@/components/onboarding/PatternInterrupt";
import { HabitIntake } from "@/components/onboarding/HabitIntake";
import { AttentionBaselineTest } from "@/components/onboarding/AttentionBaselineTest";
import { HabitGraph } from "@/components/onboarding/HabitGraph";
import { PersonalGoalBuilder } from "@/components/onboarding/PersonalGoalBuilder";
import { DynamicPlanCreation } from "@/components/onboarding/DynamicPlanCreation";
import { EmotionalMomentum } from "@/components/onboarding/EmotionalMomentum";
import { FirstUpsell } from "@/components/onboarding/FirstUpsell";
import { UserTypeTag } from "@/components/onboarding/UserTypeTag";
import { PermissionRequests } from "@/components/onboarding/PermissionRequests";
import { FirstWin } from "@/components/onboarding/FirstWin";
import { FinalConfirmation } from "@/components/onboarding/FinalConfirmation";
import { GoalSelection } from "@/components/onboarding/GoalSelection";
import { BaselineTest } from "@/components/onboarding/BaselineTest";
import { Dashboard } from "@/components/Dashboard";
import { ChallengePlayer } from "@/components/ChallengePlayer";
import { ProgressTree } from "@/components/ProgressTree";
import { LevelPage } from "@/components/LevelPage";
import { SkillTree } from "@/components/SkillTree";
import { Insights } from "@/components/Insights";
import { Settings } from "@/components/Settings";
import { Premium } from "@/components/Premium";
import { PersonalizedTrainingPlanComponent } from "@/components/PersonalizedTrainingPlan";
import { WindDownMode } from "@/components/WindDownMode";
import { Button } from "@/components/ui/button";
import { CornerHeartDisplay } from "@/components/CornerHeartDisplay";
import type { GoalType, ChallengeType, OnboardingData, OnboardingGoalResult, UserPersonalityType } from "@/types";

export const Route = createFileRoute("/")({
	component: App,
});

type OnboardingStep =
  | 'welcome'
  | 'pattern_interrupt'
  | 'habit_intake'
  | 'attention_baseline'
  | 'habit_graph'
  | 'personal_goal'
  | 'plan_creation'
  | 'emotional_momentum'
  | 'first_upsell'
  | 'user_type'
  | 'permissions'
  | 'first_win'
  | 'final_confirmation'
  | 'goal'
  | 'baseline';
type ViewMode = 'dashboard' | 'hub' | 'level' | 'skill-tree' | 'insights' | 'settings' | 'premium' | 'training-plan' | 'wind-down';

function AppContent() {
	const { user, isOnboarded, completeOnboarding, updateOnboardingData, logout } = useAuth();
	const { heartState, progressTree } = useGame();
	const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
	const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
	const [selectedChallenge, setSelectedChallenge] = useState<ChallengeType | null>(null);
	const [showingChallenge, setShowingChallenge] = useState(false);
	const [isTest, setIsTest] = useState(false);
	const [testSequence, setTestSequence] = useState<ChallengeType[] | undefined>(undefined);
	const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
	const [selectedLevel, setSelectedLevel] = useState<number>(1);
	const [showResetButton, setShowResetButton] = useState(false);

	// Developer reset: Press 'r' 3 times quickly to show reset button
	useEffect(() => {
		let pressCount = 0;
		let resetTimeout: number;

		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'r' || e.key === 'R') {
				pressCount++;
				clearTimeout(resetTimeout);

				if (pressCount >= 3) {
					setShowResetButton(true);
					pressCount = 0;
				} else {
					resetTimeout = window.setTimeout(() => {
						pressCount = 0;
					}, 1000);
				}
			}
		};

		window.addEventListener('keydown', handleKeyPress);
		return () => window.removeEventListener('keydown', handleKeyPress);
	}, []);

	// Show onboarding flow if user hasn't completed it yet
	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
				<div className="text-center space-y-4">
					<div className="text-xl font-semibold text-gray-900 dark:text-white">Loading FocusFlow...</div>
					<div className="text-sm text-gray-600 dark:text-gray-300">Initializing your account</div>
				</div>
			</div>
		);
	}

	if (!isOnboarded) {
		// Comprehensive onboarding flow following MVP spec
		if (onboardingStep === 'welcome') {
			return <Welcome onNext={() => setOnboardingStep('pattern_interrupt')} />;
		}

		if (onboardingStep === 'pattern_interrupt') {
			return <PatternInterrupt onNext={() => setOnboardingStep('habit_intake')} />;
		}

		if (onboardingStep === 'habit_intake') {
			return (
				<HabitIntake
					onNext={(data) => {
						setOnboardingData({ ...onboardingData, ...data });
						updateOnboardingData(data);
						setOnboardingStep('attention_baseline');
					}}
				/>
			);
		}

		if (onboardingStep === 'attention_baseline') {
			return (
				<AttentionBaselineTest
					onComplete={(score) => {
						const data = { attentionBaselineScore: score };
						setOnboardingData({ ...onboardingData, ...data });
						updateOnboardingData(data);
						setOnboardingStep('habit_graph');
					}}
				/>
			);
		}

		if (onboardingStep === 'habit_graph') {
			return (
				<HabitGraph
					onboardingData={onboardingData}
					onNext={() => setOnboardingStep('personal_goal')}
				/>
			);
		}

		if (onboardingStep === 'personal_goal') {
			return (
				<PersonalGoalBuilder
					onNext={(goal, minutes) => {
						const data = { goalResult: goal, dailyTrainingMinutes: minutes };
						setOnboardingData({ ...onboardingData, ...data });
						updateOnboardingData(data);
						setOnboardingStep('plan_creation');
					}}
				/>
			);
		}

		if (onboardingStep === 'plan_creation') {
			return <DynamicPlanCreation onNext={() => setOnboardingStep('emotional_momentum')} />;
		}

		if (onboardingStep === 'emotional_momentum') {
			return <EmotionalMomentum onNext={() => setOnboardingStep('first_upsell')} />;
		}

		if (onboardingStep === 'first_upsell') {
			return (
				<FirstUpsell
					onUpgrade={() => {
						// User upgraded to premium (already premium by default)
						setOnboardingStep('permissions');
					}}
					onContinueFree={() => {
						// User continues with free version (show user type screen)
						setOnboardingStep('user_type');
					}}
				/>
			);
		}

		if (onboardingStep === 'user_type') {
			return (
				<UserTypeTag
					onNext={(personalityType) => {
						const data = { userPersonalityType: personalityType };
						setOnboardingData({ ...onboardingData, ...data });
						updateOnboardingData(data);
						setOnboardingStep('permissions');
					}}
				/>
			);
		}

		if (onboardingStep === 'permissions') {
			return (
				<PermissionRequests
					onComplete={(permissions) => {
						const data = {
							hasAcceptedNotifications: permissions.notifications,
							hasAcceptedScreenTime: permissions.screenTime,
							hasAcceptedDailyCheckIn: permissions.dailyCheckIn,
						};
						setOnboardingData({ ...onboardingData, ...data });
						updateOnboardingData(data);
						setOnboardingStep('first_win');
					}}
				/>
			);
		}

		if (onboardingStep === 'first_win') {
			return <FirstWin onNext={() => setOnboardingStep('final_confirmation')} />;
		}

		if (onboardingStep === 'final_confirmation') {
			return (
				<FinalConfirmation
					onComplete={() => {
						// Mark onboarding as complete
						const finalData = {
							...onboardingData,
							completedOnboardingAt: Date.now(),
						};
						updateOnboardingData(finalData);
						completeOnboarding('improve_focus'); // Default goal
					}}
				/>
			);
		}
	}

	// Main app - show challenge, level page, hub, or dashboard
	if (showingChallenge && selectedChallenge) {
		// Determine if there's a next lesson
		const currentNode = progressTree?.nodes.find(n => n.id === progressTree?.currentNodeId);
		const currentNodeIndex = currentNode && progressTree ? progressTree.nodes.findIndex(n => n.id === currentNode.id) : -1;
		const nextNode = (currentNodeIndex !== undefined && currentNodeIndex >= 0 && progressTree) ? progressTree.nodes[currentNodeIndex + 1] : null;
		const hasNextLesson = nextNode?.status === 'locked' && nextNode?.nodeType === 'exercise';

		const handleNextLesson = () => {
			if (nextNode && hasNextLesson) {
				// Set the next challenge and stay in challenge mode
				setSelectedChallenge(nextNode.challengeType);
			}
		};

		return (
			<>
				<ChallengePlayer
					onBack={() => {
						setShowingChallenge(false);
						setIsTest(false);
						setTestSequence(undefined);
						// Return to level page after challenge
					}}
					preSelectedChallenge={selectedChallenge}
					isTest={isTest}
					testSequence={testSequence}
					testLevel={selectedLevel}
					onNextLesson={handleNextLesson}
					hasNextLesson={hasNextLesson}
				/>
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show individual level page
	if (viewMode === 'level') {
		return (
			<>
				<LevelPage
					level={selectedLevel}
					onBack={() => setViewMode('hub')}
					onSelectChallenge={(challengeType, isTestMode, sequence) => {
						setSelectedChallenge(challengeType);
						setIsTest(isTestMode || false);
						setTestSequence(sequence);
						setShowingChallenge(true);
					}}
				/>
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show hub (level selection)
	if (viewMode === 'hub') {
		return (
			<>
				<ProgressTree
					onBack={() => setViewMode('dashboard')}
					onSelectLevel={(level) => {
						setSelectedLevel(level);
						setViewMode('level');
					}}
				/>
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show skill tree
	if (viewMode === 'skill-tree') {
		return (
			<>
				<SkillTree onBack={() => setViewMode('dashboard')} />
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show insights
	if (viewMode === 'insights') {
		return (
			<>
				<Insights onBack={() => setViewMode('dashboard')} />
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show settings
	if (viewMode === 'settings') {
		return (
			<>
				<Settings onBack={() => setViewMode('dashboard')} />
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show premium
	if (viewMode === 'premium') {
		return (
			<>
				<Premium onBack={() => setViewMode('dashboard')} />
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show training plan
	if (viewMode === 'training-plan') {
		return (
			<>
				<PersonalizedTrainingPlanComponent onBack={() => setViewMode('dashboard')} />
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Show wind-down mode
	if (viewMode === 'wind-down') {
		return (
			<>
				<WindDownMode onBack={() => setViewMode('dashboard')} />
				{/* Heart Display - visible on all screens */}
				{heartState && (
					<CornerHeartDisplay
						heartState={heartState}
						isPremium={false}
					/>
				)}
				{showResetButton && (
					<div className="fixed bottom-4 left-4 z-50">
						<Button
							onClick={() => {
								if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
									logout();
									window.location.reload();
								}
							}}
							variant="destructive"
							size="sm"
						>
							Reset App
						</Button>
					</div>
				)}
			</>
		);
	}

	// Main dashboard is the default home screen
	return (
		<>
			<Dashboard
				onNavigate={(route) => {
					if (route === 'progress-tree') {
						setViewMode('hub');
					} else if (route === 'skill-tree') {
						setViewMode('skill-tree');
					} else if (route === 'insights') {
						setViewMode('insights');
					} else if (route === 'settings') {
						setViewMode('settings');
					} else if (route === 'premium') {
						setViewMode('premium');
					} else if (route === 'training-plan') {
						setViewMode('training-plan');
					} else if (route === 'wind-down') {
						setViewMode('wind-down');
					}
				}}
			/>
			{/* Heart Display - visible on all screens */}
			{heartState && (
				<CornerHeartDisplay
					heartState={heartState}
					isPremium={false}
				/>
			)}
			{showResetButton && (
				<div className="fixed bottom-4 left-4 z-50">
					<Button
						onClick={() => {
							if (window.confirm('Reset all app data and start fresh? This cannot be undone.')) {
								logout();
								window.location.reload();
							}
						}}
						variant="destructive"
						size="sm"
					>
						Reset App
					</Button>
				</div>
			)}
		</>
	);
}

function BaselineTestWrapper() {
	const { initializeProgress } = useGame();

	return (
		<BaselineTest
			onComplete={(level: number) => {
				initializeProgress(level);
			}}
			onSkip={() => {
				initializeProgress(1);
			}}
		/>
	);
}

function App() {
	return (
		<AuthProvider>
			<AppWrapper />
		</AuthProvider>
	);
}

function AppWrapper() {
	return (
		<GameProvider>
			<SettingsProvider>
				<ThemeProvider>
					<AppContent />
				</ThemeProvider>
			</SettingsProvider>
		</GameProvider>
	);
}
