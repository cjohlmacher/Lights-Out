import { fireEvent, getByText, render } from '@testing-library/react';
import Board from './Board';

beforeEach(function() {
    jest
        .spyOn(Math, "random")
        .mockReturnValueOnce(0.01)
        .mockReturnValueOnce(0.01)
        .mockReturnValueOnce(0.875)
        .mockReturnValueOnce(0.875)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.725)
        .mockReturnValueOnce(0.725)
        .mockReturnValueOnce(0.375)
        .mockReturnValueOnce(0.375)
        .mockReturnValueOnce(0.125)
        .mockReturnValueOnce(0.125)
        .mockReturnValueOnce(0.625)
        .mockReturnValueOnce(0.625)
        .mockReturnValueOnce(0.125)
        .mockReturnValueOnce(0.125)
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.5);
});

it('renders without crashing', () => {
    render(<Board />);
});

it('matches snapshot with 3x3 grid', () => {
    const {asFragment} = render(<Board nrows={3} ncols={3}/>);
    expect(asFragment()).toMatchSnapshot();
});

it('flips cell on click', () => {
    const { getByRole, debug } = render(<Board nrows={3} ncols={3}/>);
    const board = getByRole('table');
    const tbody = board.children[0];
    const grid = [
        [tbody.children[0].children[0],tbody.children[0].children[1],tbody.children[0].children[2]],
        [tbody.children[1].children[0],tbody.children[1].children[1],tbody.children[1].children[2]],
        [tbody.children[2].children[0],tbody.children[2].children[1],tbody.children[2].children[2]]
    ];
    const cell1 = grid[0][0];
    fireEvent.click(cell1);
    expect(cell1.className).toBe('Cell Cell-lit');
    expect(grid[0][1].className).toBe('Cell Cell-lit');
    expect(grid[0][2].className).toBe('Cell Cell-lit');
    expect(grid[1][0].className).toBe('Cell Cell-lit');
    expect(grid[1][1].className).toBe('Cell Cell-lit');
    expect(grid[1][2].className).toBe('Cell ');
    expect(grid[2][0].className).toBe('Cell Cell-lit');
    expect(grid[2][1].className).toBe('Cell ');
    expect(grid[2][2].className).toBe('Cell ');
});

it('shows win', () => {
    const { getByRole, getByText, debug } = render(<Board nrows={3} ncols={3}/>);
    const board = getByRole('table');
    const tbody = board.children[0];
    const grid = [
        [tbody.children[0].children[0],tbody.children[0].children[1],tbody.children[0].children[2]],
        [tbody.children[1].children[0],tbody.children[1].children[1],tbody.children[1].children[2]],
        [tbody.children[2].children[0],tbody.children[2].children[1],tbody.children[2].children[2]]
    ];
    const cell1 = grid[0][0];
    const cell2 = grid[2][2];
    fireEvent.click(cell1);
    fireEvent.click(cell2);
    const heading = getByText('You Win!');
    expect(heading).toBeInTheDocument();
    expect(board).not.toBeInTheDocument();
});