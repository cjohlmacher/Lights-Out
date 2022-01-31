import { render } from '@testing-library/react';
import Cell from './Cell';

it('renders without crashing', () => {
    render(<Cell isLit={true}/>);
});

it('matches snapshot when lit', () => {
    const {asFragment} = render(<Cell flipCellsAroundMe={() => null} isLit={true} />);
    expect(asFragment()).toMatchSnapshot();
});

it('matches snapshot when unlit', () => {
    const {asFragment} = render(<Cell flipCellsAroundMe={() => null} isLit={false} />);
    expect(asFragment()).toMatchSnapshot();
});