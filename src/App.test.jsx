import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const advance = (milliseconds) => act(() => vi.advanceTimersByTime(milliseconds));
const start = () => fireEvent.click(screen.getByRole('button', { name: 'Start' }));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-21T10:00:00Z'));
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

test('defaults remain a one-minute Natural Taoist session', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Natural Taoist Breath' })).toBeInTheDocument();
  expect(screen.getByText('1 min')).toBeInTheDocument();
  expect(localStorage.getItem('taoistBreathSessions')).toBe('0');
});

test('restores saved settings and keeps changed settings after remount', () => {
  localStorage.setItem('taoistBreathSelectedDuration', '90');
  localStorage.setItem('taoistBreathSelectedPattern', 'boxBreathing');
  localStorage.setItem('taoistBreathSessions', '7');
  const view = render(<App />);
  expect(screen.getByRole('heading', { name: 'Box Breathing (Wu Wei Balance)' })).toBeInTheDocument();
  expect(screen.getByText('1:30')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  fireEvent.click(screen.getByText('Embryonic Breathing (Deep focus)'));
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  fireEvent.click(screen.getByRole('button', { name: 'Up' }));
  fireEvent.click(screen.getByRole('button', { name: '2 min', exact: true }));
  view.unmount();
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Embryonic Breathing (Deep focus)' })).toBeInTheDocument();
  expect(screen.getByText('2 min')).toBeInTheDocument();
  expect(localStorage.getItem('taoistBreathSelectedDuration')).toBe('120');
  expect(localStorage.getItem('taoistBreathSelectedPattern')).toBe('embryonicBreathing');
  expect(localStorage.getItem('taoistBreathSessions')).toBe('7');
});

test('Natural Taoist phases follow four-second inhale and six-second exhale', () => {
  render(<App />);
  start();
  expect(screen.getByText('Inhale')).toBeInTheDocument();
  advance(4016);
  expect(screen.getByText('Exhale')).toBeInTheDocument();
  advance(6000);
  expect(screen.getByText('Inhale')).toBeInTheDocument();
  expect(localStorage.getItem('taoistBreathSessions')).toBe('0');
});

test('pause freezes the timer and resume excludes paused time', () => {
  render(<App />);
  start();
  advance(2000);
  fireEvent.click(screen.getByText('Inhale'));
  expect(screen.getByText('00:58')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  advance(70000);
  expect(screen.getByText('00:58')).toBeInTheDocument();
  expect(screen.queryByText('Breathing Sessions')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  advance(2016);
  expect(screen.getByText('Exhale')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Exhale'));
  expect(screen.getByText('00:55')).toBeInTheDocument();
});

test('stopping a paused session does not count it as completed', () => {
  localStorage.setItem('taoistBreathSessions', '3');
  render(<App />);
  start();
  advance(1000);
  fireEvent.click(screen.getByText('Inhale'));
  fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
  fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
  expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument();
  expect(localStorage.getItem('taoistBreathSessions')).toBe('3');
  advance(70000);
  expect(localStorage.getItem('taoistBreathSessions')).toBe('3');
});

test('a hidden page pauses until the user resumes', () => {
  render(<App />);
  start();
  advance(2000);
  Object.defineProperty(document, 'hidden', { configurable: true, value: true });
  fireEvent(document, new Event('visibilitychange'));
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  advance(70000);
  Object.defineProperty(document, 'hidden', { configurable: true, value: false });
  fireEvent(document, new Event('visibilitychange'));
  expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
  expect(localStorage.getItem('taoistBreathSessions')).toBe('0');
  fireEvent.click(screen.getByRole('button', { name: 'Play' }));
  advance(58016);
  expect(screen.getByText('Breathing Sessions')).toBeInTheDocument();
  expect(localStorage.getItem('taoistBreathSessions')).toBe('1');
});

test('completion increments once and a new session starts with a fresh timer', () => {
  localStorage.setItem('taoistBreathSessions', '3');
  render(<App />);
  start();
  advance(60016);
  expect(screen.getByText('Breathing Sessions')).toBeInTheDocument();
  expect(localStorage.getItem('taoistBreathSessions')).toBe('4');
  advance(70000);
  expect(localStorage.getItem('taoistBreathSessions')).toBe('4');
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  start();
  fireEvent.click(screen.getByText('Inhale'));
  expect(screen.getByText('01:00')).toBeInTheDocument();
  advance(60016);
  expect(localStorage.getItem('taoistBreathSessions')).toBe('5');
});


test('the saved Box Breathing pattern keeps its hold phases', () => {
  localStorage.setItem('taoistBreathSelectedPattern', 'boxBreathing');
  render(<App />);
  start();
  advance(4016);
  expect(screen.getByText('Hold')).toBeInTheDocument();
  advance(1000);
  expect(screen.getByText('3')).toBeInTheDocument();
  advance(3000);
  expect(screen.getByText('Exhale')).toBeInTheDocument();
  advance(4000);
  expect(screen.getByText('Hold')).toBeInTheDocument();
});
