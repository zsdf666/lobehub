'use client';

import { Flexbox, Text } from '@lobehub/ui';
import { cssVar } from '@lobehub/ui/stylex/cssVar.stylex';
import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Static list (rather than a computed key) so every string stays a literal that
 * i18next's typed `t` can check, and so the reading order of the steps is
 * obvious at a glance.
 */
const STEPS = [
  { desc: 'quickStart.steps.model.desc', title: 'quickStart.steps.model.title' },
  { desc: 'quickStart.steps.question.desc', title: 'quickStart.steps.question.title' },
  { desc: 'quickStart.steps.answer.desc', title: 'quickStart.steps.answer.title' },
] as const;

const styles = stylex.create({
  badge: {
    alignItems: 'center',
    backgroundColor: cssVar.colorFillSecondary,
    borderRadius: '50%',
    color: cssVar.colorText,
    display: 'flex',
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
    height: 22,
    justifyContent: 'center',
    lineHeight: 1,
    width: 22,
  },
  card: {
    backgroundColor: cssVar.colorBgContainer,
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
    borderStyle: 'solid',
    borderWidth: 1,
    paddingBlock: 14,
    paddingInline: 18,
  },
  /* auto-fit keeps three columns on desktop and stacks them on narrow screens
     without a media query. */
  steps: {
    columnGap: 24,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    rowGap: 14,
  },
});

const QuickStartGuide = memo(() => {
  const { t } = useTranslation('home');

  return (
    <section aria-label={t('quickStart.title')} {...stylex.props(styles.card)}>
      <Flexbox gap={12}>
        <Text as={'h3'} fontSize={14} weight={600}>
          {t('quickStart.title')}
        </Text>
        <div {...stylex.props(styles.steps)}>
          {STEPS.map((step, index) => (
            <Flexbox horizontal align={'flex-start'} gap={8} key={step.title}>
              <span {...stylex.props(styles.badge)}>{index + 1}</span>
              <Flexbox gap={2}>
                <Text fontSize={13} weight={500}>
                  {t(step.title)}
                </Text>
                <Text fontSize={12} type={'secondary'}>
                  {t(step.desc)}
                </Text>
              </Flexbox>
            </Flexbox>
          ))}
        </div>
      </Flexbox>
    </section>
  );
});

QuickStartGuide.displayName = 'HomeQuickStartGuide';

export default QuickStartGuide;
