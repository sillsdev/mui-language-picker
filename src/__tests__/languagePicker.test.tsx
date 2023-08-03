import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import LanguagePicker from '../LanguagePicker';
import { languagePickerStrings_en } from '../localization';

describe('LanguagePicker', () => {
  beforeEach(cleanup);

  it('renders without crashing', () => {
    const props = {
      value: '',
      name: '',
      font: '',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    expect(container).not.toBe(null);
    expect(container.querySelector('label')).not.toBe(null);
    expect(container.querySelector('label')?.firstChild?.textContent).toEqual(
      'Language'
    );
    expect(container.querySelector('input')).not.toBe(null);
  });

  it('renders with a value und', () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    expect(container.querySelector('input')?.hasAttribute('value')).toBe(true);
    expect(container.querySelector('input')?.getAttribute('value')).toEqual('');
  });

  it('renders with a value', () => {
    const props = {
      value: 'en',
      name: '',
      font: '',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    expect(container.querySelector('input')?.hasAttribute('value')).toBe(true);
    expect(container.querySelector('input')?.getAttribute('value')).toEqual(
      ' (en)'
    );
  });

  it('renders with a value and name', () => {
    const props = {
      value: 'en',
      name: 'English',
      font: '',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    expect(container.querySelector('input')?.hasAttribute('value')).toBe(true);
    expect(container.querySelector('input')?.getAttribute('value')).toEqual(
      'English (en)'
    );
  });

  it('renders with a value, name and font', () => {
    const props = {
      value: 'en',
      name: 'English',
      font: 'Charis SIL',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    expect(container.querySelector('input')?.hasAttribute('value')).toBe(true);
    expect(container.querySelector('input')?.getAttribute('value')).toEqual(
      'English (en)'
    );
  });

  it('renders with a value, name when disabled', () => {
    const props = {
      value: 'en',
      name: 'English',
      font: '',
      t: languagePickerStrings_en,
      disabled: true,
    };
    const { container } = render(<LanguagePicker {...props} />);
    expect(container.querySelector('input')?.hasAttribute('value')).toBe(true);
    expect(container.querySelector('input')?.getAttribute('value')).toEqual(
      'English (en)'
    );
    expect(container.querySelector('input')?.hasAttribute('disabled')).toBe(
      true
    );
  });

  it('opens picker when clicked', () => {
    const props = {
      value: 'en',
      name: 'English',
      font: 'Charis SIL',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    expect(screen.getByText('Choose Language Details')).not.toBe(null);
  });

  it('opens picker when clicked and closes when clicked', async () => {
    const props = {
      value: 'en',
      name: 'English',
      font: 'Charis SIL',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    expect(screen.getByText('Choose Language Details')).not.toBe(null);
    fireEvent.click(screen.getByText('Cancel') as Element);
    await waitFor(() =>
      expect(screen.queryByText('Choose Language Details')).toBe(null)
    );
  });

  it('gives English in response to en code', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as any,
      { target: { value: 'en' } }
    );
    await waitFor(() => expect(screen.getByText(/^en-001$/i)).not.toBe(null));
  });

  it('choosing en-001 returns right values', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as any,
      { target: { value: 'en' } }
    );
    await waitFor(() => screen.getByText(/^en-001$/i));
    fireEvent.click(screen.getByText(/^en-001$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('en-001');
    expect(props.setName).toHaveBeenCalledWith('English');
    expect(props.setFont).toHaveBeenCalledWith('Charis SIL');
  });

  it('choosing zh-CN-x-pyn returns right values', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as any,
      { target: { value: 'zh-CN-x-pyn' } }
    );
    await waitFor(() => screen.getByText(/^zh-CN$/i));
    fireEvent.click(screen.getByText(/^zh-CN$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('zh-CN-x-pyn');
    expect(props.setName).toHaveBeenCalledWith('Chinese');
    expect(props.setFont).toHaveBeenCalledWith('Noto Sans CJK SC');
  });

  it('choosing zhn-fonapi returns right values', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as any,
      { target: { value: 'zhn-fonapi' } }
    );
    await waitFor(() => screen.getByText(/^zhn$/i));
    fireEvent.click(screen.getByText(/^zhn$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('zhn-fonapi');
    expect(props.setName).toHaveBeenCalledWith('Zhuang, Nong');
    expect(props.setFont).toHaveBeenCalledWith('Charis SIL');
  });
});
