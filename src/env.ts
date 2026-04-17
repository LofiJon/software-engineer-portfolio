const e = (import.meta as any).env ?? {};

export const ENV = {
  publicUrl:   e['VITE_PUBLIC_URL']   as string,
  photoUrl:    e['VITE_PHOTO_URL']    as string,
  whatsappUrl: e['VITE_WHATSAPP_URL'] as string,
  githubUrl:   e['VITE_GITHUB_URL']   as string,
  linkedinUrl: e['VITE_LINKEDIN_URL'] as string,
};
