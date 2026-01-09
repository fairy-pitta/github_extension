import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkeletonLoader } from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders single skeleton by default', () => {
    const { container } = render(<SkeletonLoader />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(1);
  });

  it('renders multiple skeletons when count is specified', () => {
    const { container } = render(<SkeletonLoader count={3} />);
    const skeletons = container.querySelectorAll('.skeleton');
    expect(skeletons.length).toBe(3);
  });

  it('applies custom className', () => {
    const { container } = render(<SkeletonLoader className="custom-class" />);
    const skeleton = container.querySelector('.skeleton');
    expect(skeleton?.classList.contains('custom-class')).toBe(true);
  });
});



