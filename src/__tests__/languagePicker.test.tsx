/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      font: 'charissil',
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
      font: 'charissil',
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
      font: 'charissil',
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
        .nextSibling?.firstChild as Element,
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
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as Element,
      { target: { value: 'en' } }
    );
    await waitFor(() => screen.getByText(/^en-001$/i));
    fireEvent.click(screen.getByText(/^en-001$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('en-001');
    expect(props.setName).toHaveBeenCalledWith('English');
    expect(props.setFont).toHaveBeenCalledWith('charissil');
    expect(props.setDir).toHaveBeenCalledWith(false);
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
        .nextSibling?.firstChild as Element,
      { target: { value: 'zh-CN-x-pyn' } }
    );
    await waitFor(() => screen.getByText(/^zh-CN$/i));
    fireEvent.click(screen.getByText(/^zh-CN$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('zh-CN-x-pyn');
    expect(props.setName).toHaveBeenCalledWith('Chinese');
    expect(props.setFont).toHaveBeenCalledWith('notoserifsc');
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
        .nextSibling?.firstChild as Element,
      { target: { value: 'zhn-fonapi' } }
    );
    await waitFor(() => screen.getByText(/^zhn$/i));
    fireEvent.click(screen.getByText(/^zhn$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('zhn-fonapi');
    expect(props.setName).toHaveBeenCalledWith('Zhuang, Nong');
    expect(props.setFont).toHaveBeenCalledWith('charissil');
  });

  it('choosing ar returns right values', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as Element,
      { target: { value: 'ar' } }
    );
    await waitFor(() => screen.getAllByText(/Egypt/i));
    fireEvent.click(screen.getAllByText(/Egypt/i)[0]);
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('ar');
    expect(props.setName).toHaveBeenCalledWith('Arabic');
    expect(props.setFont).toHaveBeenCalledWith('scheherazadenew');
    expect(props.setDir).toHaveBeenCalledWith(true);
  });

  it('name Cherokee returns right values', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as Element,
      { target: { value: 'Cherokee' } }
    );
    await waitFor(() => screen.getByText(/^chr$/i));
    fireEvent.click(screen.getByText(/^chr$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('chr');
    expect(props.setName).toHaveBeenCalledWith('Cherokee');
    expect(props.setFont).toHaveBeenCalledWith('notosanscherokee');
    expect(props.setDir).toHaveBeenCalledWith(false);
  });

  it('country Senegal returns Wolof values', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as Element,
      { target: { value: 'Senegal' } }
    );
    await waitFor(() => screen.getByText(/^wo$/i));
    fireEvent.click(screen.getByText(/^wo$/i));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('wo');
    expect(props.setName).toHaveBeenCalledWith('Wolof');
    expect(props.setFont).toHaveBeenCalledWith('charissil');
    expect(props.setDir).toHaveBeenCalledWith(false);
  });

  it('Wolof Script can be changed to Arabic', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as Element,
      { target: { value: 'Senegal' } }
    );
    await waitFor(() => screen.getByText(/^wo$/i));
    fireEvent.click(screen.getByText(/^wo$/i));
    fireEvent.change(
      screen.getByTestId('select-script').querySelector('input') as HTMLElement,
      {
        target: { value: 'Arab' },
      }
    );
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('wo-Arab');
    expect(props.setName).toHaveBeenCalledWith('Wolof');
    expect(props.setFont).toHaveBeenCalledWith('scheherazadenew');
    expect(props.setDir).toHaveBeenCalledWith(true);
  });

  it('Wolof Font can be changed to NotoSansLatin', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as Element,
      { target: { value: 'Senegal' } }
    );
    await waitFor(() => screen.getByText(/^wo$/i));
    fireEvent.click(screen.getByText(/^wo$/i));
    fireEvent.change(
      screen.getByTestId('select-font').querySelector('input') as HTMLElement,
      {
        target: { value: 'NotoSansLatin' },
      }
    );
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('wo');
    expect(props.setName).toHaveBeenCalledWith('Wolof');
    expect(props.setFont).toHaveBeenCalledWith('charissil');
    expect(props.setDir).toHaveBeenCalledWith(false);
  });

  it('Wolof can be changed to Senegal Wolof', async () => {
    const props = {
      value: 'und',
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(<LanguagePicker {...props} />);
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
    fireEvent.change(
      screen.getAllByText(/Find a language by name, code, or country/i)[0]
        .nextSibling?.firstChild as Element,
      { target: { value: 'wo' } }
    );
    await waitFor(() => screen.getByText(/^wo$/i));
    fireEvent.click(screen.getByText(/^wo$/i));
    fireEvent.click(screen.getByTestId('change-name'));
    await waitFor(() => screen.getByText('Change Name'));
    fireEvent.change(
      screen.getByTestId('name').querySelector('input') as HTMLElement,
      {
        target: { value: 'Senegal Wolof' },
      }
    );
    fireEvent.click(screen.getByText('Change'));
    fireEvent.click(screen.getByText('Save'));
    expect(props.setCode).toHaveBeenCalledWith('wo');
    expect(props.setName).toHaveBeenCalledWith('Senegal Wolof');
    expect(props.setFont).toHaveBeenCalledWith('charissil');
    expect(props.setDir).toHaveBeenCalledWith(false);
  });

  it('It does not crash when value empty', async () => {
    const props = {
      name: '',
      font: '',
      t: languagePickerStrings_en,
      setCode: jest.fn(),
      setName: jest.fn(),
      setFont: jest.fn(),
      setDir: jest.fn(),
      setInfo: jest.fn(),
    };
    const { container } = render(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      <LanguagePicker {...props} value={undefined as any} />
    );
    fireEvent.click(container.querySelector('input') as Element);
    await waitFor(() =>
      expect(screen.getByText('Choose Language Details')).not.toBe(null)
    );
  });
});
