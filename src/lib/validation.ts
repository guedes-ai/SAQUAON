export interface FieldResult {
  value: string;
  error?: string;
}

// ---------------------------------------------------------------- e-mail
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(raw: string): FieldResult {
  const value = raw.trim().toLowerCase();
  if (!value) return { value, error: 'Informe seu e-mail.' };
  if (value.length > 254 || !EMAIL_RE.test(value)) {
    return { value, error: 'Digite um e-mail válido, como nome@exemplo.com.' };
  }
  return { value };
}

// ----------------------------------------------------------------- senha
export interface PasswordRule {
  id: 'tamanho' | 'letra' | 'numero';
  label: string;
  ok: boolean;
}

export function checkPasswordRules(password: string): PasswordRule[] {
  return [
    { id: 'tamanho', label: 'Pelo menos 8 caracteres', ok: password.length >= 8 },
    { id: 'letra', label: 'Pelo menos uma letra', ok: /\p{L}/u.test(password) },
    { id: 'numero', label: 'Pelo menos um número', ok: /\d/.test(password) },
  ];
}

const COMMON_PASSWORDS = new Set([
  '12345678', '123456789', '1234567890', '11111111', '00000000', '87654321',
  'password', 'password1', 'senha123', 'senha1234', 'qwerty123', 'abc12345', 'saquarema1', 'saquarema123',
]);

export function validateNewPassword(password: string): string | undefined {
  if (!password) return 'Crie uma senha.';
  // o bcrypt do Supabase só considera os primeiros 72 bytes
  if (new TextEncoder().encode(password).length > 72) return 'A senha pode ter no máximo 72 caracteres.';
  if (checkPasswordRules(password).some((rule) => !rule.ok)) {
    return 'Sua senha precisa ter no mínimo 8 caracteres, com letras e números.';
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) return 'Essa senha é muito comum. Escolha outra.';
  return undefined;
}

// ------------------------------------------------------------------ nomes
const NAME_RE = /^[\p{L}][\p{L}\p{M}' .-]*$/u;

export function validatePersonName(raw: string): FieldResult {
  const value = raw.trim().replace(/\s+/g, ' ');
  if (!value) return { value, error: 'Informe seu nome.' };
  if (value.length < 2) return { value, error: 'O nome precisa ter pelo menos 2 letras.' };
  if (value.length > 80) return { value, error: 'O nome pode ter no máximo 80 caracteres.' };
  if (!NAME_RE.test(value)) return { value, error: 'Use só letras, espaços, apóstrofo, ponto ou hífen no nome.' };
  return { value };
}

export function validateBusinessName(raw: string): FieldResult {
  const value = raw.trim().replace(/\s+/g, ' ');
  if (!value) return { value, error: 'Informe o nome do estabelecimento.' };
  if (value.length < 2) return { value, error: 'O nome precisa ter pelo menos 2 caracteres.' };
  if (value.length > 120) return { value, error: 'O nome pode ter no máximo 120 caracteres.' };
  if (!/[\p{L}\p{N}]/u.test(value)) return { value, error: 'O nome precisa ter letras ou números.' };
  return { value };
}

export function validateOptionalText(raw: string, max: number, label: string): FieldResult {
  const value = raw.trim().replace(/\s+/g, ' ');
  if (value.length > max) return { value, error: `${label} pode ter no máximo ${max} caracteres.` };
  return { value };
}

// ------------------------------------------------------------- telefone BR
const DDDS_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function validateWhatsapp(raw: string): FieldResult {
  let digits = raw.replace(/\D/g, '');
  if (!digits) return { value: '', error: 'Informe o WhatsApp com DDD.' };

  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2);

  const formato = 'Use o formato com DDD, por exemplo (22) 99876-5432.';
  if (digits.length !== 10 && digits.length !== 11) return { value: digits, error: formato };
  if (!DDDS_VALIDOS.has(Number(digits.slice(0, 2)))) return { value: digits, error: 'DDD inválido. ' + formato };
  if (digits.length === 11 && digits[2] !== '9') {
    return { value: digits, error: 'Celulares têm 9 dígitos e começam com 9. ' + formato };
  }
  if (/^(\d)\1+$/.test(digits.slice(2))) return { value: digits, error: 'Esse número não parece válido.' };
  return { value: `55${digits}` };
}

export function formatWhatsappDisplay(full: string): string {
  const d = full.replace(/\D/g, '').replace(/^55/, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return full;
}

// -------------------------------------------------------------- Instagram
export function validateInstagram(raw: string): FieldResult {
  let value = raw.trim();
  if (!value) return { value: '' };
  value = value.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '').replace(/^@/, '');
  if (!/^[A-Za-z0-9._]{1,30}$/.test(value)) {
    return { value, error: 'Instagram inválido. Use só letras, números, ponto ou _ (ex.: @quiosquedomar).' };
  }
  return { value: `@${value}` };
}

// ------------------------------------------------------------- avaliação
export function validateReview(nota: number, comentario: string): { nota?: string; comentario?: string } {
  const errors: { nota?: string; comentario?: string } = {};
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) errors.nota = 'Escolha de 1 a 5 estrelas.';
  if (comentario.trim().length > 1000) errors.comentario = 'O comentário pode ter no máximo 1000 caracteres.';
  return errors;
}

// ------------------------------------------------- tradução de mensagens
interface AnyError {
  code?: string;
  status?: number;
  message?: string;
  name?: string;
}

const GENERIC = 'Não foi possível concluir agora. Tente novamente em instantes.';
const OFFLINE = 'Sem conexão com o servidor. Verifique sua internet e tente de novo.';

function isNetworkError(err: AnyError): boolean {
  const msg = (err.message ?? '').toLowerCase();
  return msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('network request failed') ||
    err.name === 'AuthRetryableFetchError';
}

export function translateAuthError(error: unknown): string {
  const err = (error ?? {}) as AnyError;
  const code = (err.code ?? '').toLowerCase();
  const msg = (err.message ?? '').toLowerCase();

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'Você ainda não confirmou seu e-mail. Abra o link que enviamos (olhe também o spam).';
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return 'Não foi possível criar a conta com esses dados. Se você já tem cadastro, entre ou recupere a senha.';
  }
  if (code === 'weak_password' || msg.includes('password should')) {
    return 'Senha fraca. Use pelo menos 8 caracteres, com letras e números.';
  }
  if (code === 'same_password' || msg.includes('different from the old password')) {
    return 'A nova senha precisa ser diferente da senha atual.';
  }
  if (code.includes('rate_limit') || err.status === 429 || msg.includes('rate limit')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.';
  }
  if (code === 'signup_disabled' || msg.includes('signups not allowed')) return 'Os cadastros estão temporariamente desativados.';
  if (code === 'email_address_invalid' || msg.includes('invalid email')) return 'Esse e-mail não é aceito. Confira se digitou certo.';
  if (msg.includes('auth session missing')) {
    return 'O link de recuperação expirou. Peça um novo em “Esqueci minha senha”.';
  }
  if (code === 'session_not_found' || code === 'refresh_token_not_found' || msg.includes('jwt expired')) {
    return 'Sua sessão expirou. Entre novamente.';
  }
  if (isNetworkError(err)) return OFFLINE;
  return GENERIC;
}

export function translateDbError(error: unknown): string {
  const err = (error ?? {}) as AnyError;
  const code = err.code ?? '';
  const msg = err.message ?? '';

  if (code === 'P0001' && msg) return msg;
  if (code === '42501') return 'Você não tem permissão para fazer isso. Entre na sua conta e tente de novo.';
  if (code === '23505') {
    return msg.includes('avaliacoes_uma_por')
      ? 'Você já avaliou este local. Abra de novo para editar sua avaliação.'
      : 'Esse registro já existe.';
  }
  if (code === '23514') return 'Alguns dados não são válidos. Revise os campos e tente de novo.';
  if (code === '23503') return 'Não encontramos um item relacionado. Atualize a página e tente de novo.';
  if (code === '22001') return 'Um dos textos está longo demais.';
  if (code.startsWith('PGRST30') || msg.toLowerCase().includes('jwt')) return 'Sua sessão expirou. Entre novamente.';
  if (isNetworkError(err)) return OFFLINE;
  return GENERIC;
}
