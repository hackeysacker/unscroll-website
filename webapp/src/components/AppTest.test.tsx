import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { TestMode } from "./TestMode";
import type { ChallengeType } from "@/types";

describe("Basic test setup", () => {
	it("should pass a simple test", () => {
		expect(true).toBe(true);
	});

	it("should render text correctly", () => {
		render(<div>Hello Testing</div>);
		expect(screen.getByText("Hello Testing")).toBeInTheDocument();
	});
});

describe("TestMode challenge loading", () => {
	const mockOnComplete = () => {};
	const mockOnCancel = () => {};

	it("should load and render intro for Level 1 test", () => {
		const level1Sequence: ChallengeType[] = ['focus_hold', 'tap_only_correct', 'anti_scroll_swipe', 'finger_hold'];

		render(
			<TestMode
				testSequence={level1Sequence}
				level={1}
				onComplete={mockOnComplete}
				onCancel={mockOnCancel}
			/>
		);

		// Check if intro screen renders with test info
		expect(screen.getByText(/Level 1 Test/i)).toBeInTheDocument();
		expect(screen.getByText(/Start Test/i)).toBeInTheDocument();
		expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
	});

	it("should display correct challenge count for Level 1", () => {
		const level1Sequence: ChallengeType[] = ['focus_hold', 'tap_only_correct', 'anti_scroll_swipe', 'finger_hold'];

		render(
			<TestMode
				testSequence={level1Sequence}
				level={1}
				onComplete={mockOnComplete}
				onCancel={mockOnCancel}
			/>
		);

		// Check that it shows 4 challenges
		expect(screen.getByText(/4 different challenges/i)).toBeInTheDocument();
	});

	it("should load and render intro for Level 2 test", () => {
		const level2Sequence: ChallengeType[] = ['finger_hold', 'memory_flash', 'tap_only_correct', 'anti_scroll_swipe'];

		render(
			<TestMode
				testSequence={level2Sequence}
				level={2}
				onComplete={mockOnComplete}
				onCancel={mockOnCancel}
			/>
		);

		expect(screen.getByText(/Level 2 Test/i)).toBeInTheDocument();
	});

	it("should load and render intro for Level 3 test", () => {
		const level3Sequence: ChallengeType[] = ['slow_tracking', 'memory_flash', 'reaction_inhibition', 'stillness_test'];

		render(
			<TestMode
				testSequence={level3Sequence}
				level={3}
				onComplete={mockOnComplete}
				onCancel={mockOnCancel}
			/>
		);

		expect(screen.getByText(/Level 3 Test/i)).toBeInTheDocument();
	});

	it("should load and render intro for Level 10 test with 10 challenges", () => {
		const level10Sequence: ChallengeType[] = [
			'focus_hold', 'finger_hold', 'slow_tracking', 'tap_only_correct',
			'memory_flash', 'anti_scroll_swipe', 'reaction_inhibition',
			'stillness_test', 'breath_pacing', 'delay_unlock'
		];

		render(
			<TestMode
				testSequence={level10Sequence}
				level={10}
				onComplete={mockOnComplete}
				onCancel={mockOnCancel}
			/>
		);

		expect(screen.getByText(/Level 10 Test/i)).toBeInTheDocument();
		expect(screen.getByText(/10 different challenges/i)).toBeInTheDocument();
	});

	it("should render all MVP challenge types in intro", () => {
		const allMVPChallenges: ChallengeType[] = [
			'focus_hold',
			'finger_hold',
			'slow_tracking',
			'tap_only_correct',
			'memory_flash',
			'anti_scroll_swipe',
			'reaction_inhibition',
			'stillness_test',
			'breath_pacing',
			'delay_unlock',
			'impulse_spike_test',
			'popup_ignore',
			'controlled_breathing',
		];

		render(
			<TestMode
				testSequence={allMVPChallenges}
				level={10}
				onComplete={mockOnComplete}
				onCancel={mockOnCancel}
			/>
		);

		// Check that all challenge names appear
		expect(screen.getByText('Focus Hold')).toBeInTheDocument();
		expect(screen.getByText('Finger Hold')).toBeInTheDocument();
		expect(screen.getByText('Slow Tracking')).toBeInTheDocument();
		expect(screen.getByText('Tap Only Correct')).toBeInTheDocument();
		expect(screen.getByText('Memory Flash')).toBeInTheDocument();
		expect(screen.getByText('Anti-Scroll Swipe')).toBeInTheDocument();
		expect(screen.getByText('Reaction Inhibition')).toBeInTheDocument();
		expect(screen.getByText('Stillness Test')).toBeInTheDocument();
	});
});
