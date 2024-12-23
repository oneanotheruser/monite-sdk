import { ThemeConfig } from '@/core/theme/types';

export const getTheme = (theme: ThemeConfig) => {
  return {
    borderRadius: theme.borderRadius || 3,
    spacing: theme.spacing || 8,

    colors: {
      primary: theme.colors?.primary || '#3737FF',
      secondary: theme.colors?.secondary || '#707070',
      neutral: theme.colors?.neutral || '#707070',

      info: theme.colors?.info || theme.colors?.primary || '#3737FF',
      success: theme.colors?.success || '#1FBCA0',
      warning: theme.colors?.warning || '#C78032',
      error: theme.colors?.error || '#CC394B',

      background: theme.colors?.background || '#FAFAFA',

      text: theme.colors?.text || '#292929',
    },

    typography: {
      fontFamily:
        theme?.typography?.fontFamily ||
        // eslint-disable-next-line lingui/no-unlocalized-strings
        '"Faktum", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      fontSize: theme?.typography?.fontSize || 16,

      h1: {
        fontSize: theme.typography?.h1?.fontSize || 48,
        fontWeight: theme.typography?.h1?.fontWeight || 600,
        lineHeight: theme.typography?.h1?.lineHeight || '68px',
      },
      h2: {
        fontSize: theme.typography?.h2?.fontSize || 34,
        fontWeight: theme.typography?.h2?.fontWeight || 640,
        lineHeight: theme.typography?.h2?.lineHeight || '40px',
      },
      h3: {
        fontSize: theme.typography?.h2?.fontSize || 24,
        fontWeight: theme.typography?.h2?.fontWeight || 600,
        lineHeight: theme.typography?.h2?.lineHeight || '32px',
      },
      subtitle1: {
        fontSize: theme.typography?.h2?.fontSize || 20,
        fontWeight: theme.typography?.h2?.fontWeight || 600,
        lineHeight: theme.typography?.h2?.lineHeight || '24px',
      },
      subtitle2: {
        fontSize: theme.typography?.h2?.fontSize || 18,
        fontWeight: theme.typography?.h2?.fontWeight || 600,
        lineHeight: theme.typography?.h2?.lineHeight || '24px',
      },
      body1: {
        fontSize: theme.typography?.body1?.fontSize || 16,
        fontWeight: theme.typography?.body1?.fontWeight || 500,
        lineHeight: theme.typography?.body1?.lineHeight || '24px',
      },
      body2: {
        fontSize: theme.typography?.body2?.fontSize || 14,
        fontWeight: theme.typography?.body2?.fontWeight || 400,
        lineHeight: theme.typography?.body2?.lineHeight || '20px',
      },
    },

    components: {
      TablePagination: {
        pageSizeOptions: theme.components?.TablePagination?.pageSizeOptions || [
          15, 30, 100,
        ],
      },
    },
  };
};
