# Challenge Style Update Guide

All challenges should use:
- `TEXT_STYLES` for consistent typography
- `BACKGROUND_STYLES` for consistent backgrounds
- Enhanced color palette from `CHALLENGE_COLORS`

## Common Style Updates:

1. **Import**: Add `TEXT_STYLES, BACKGROUND_STYLES` to imports
2. **Container**: Use `...BACKGROUND_STYLES.container` with `padding: 20`
3. **Card**: Use `...BACKGROUND_STYLES.card` with `padding: 24, marginBottom: 20`
4. **Title**: Use `...TEXT_STYLES.h2` with `textAlign: 'center'`
5. **Description**: Use `...TEXT_STYLES.bodyLarge` with `textAlign: 'center', maxWidth: 320`
6. **Labels**: Use `...TEXT_STYLES.label` or `...TEXT_STYLES.labelSmall`
7. **Numbers**: Use `...TEXT_STYLES.number`
8. **Challenge Area**: Use `...BACKGROUND_STYLES.challengeArea` with `minHeight: 380`
9. **Progress Bars**: Height `12`, borderRadius `6`, use `CHALLENGE_COLORS.progressFill`
10. **Tips Container**: Use `CHALLENGE_COLORS.progressBg` with `borderLeftWidth: 4`


















